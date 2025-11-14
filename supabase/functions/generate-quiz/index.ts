import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { materialId, difficulty = 'medium' } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Fetch material content
    const { data: material, error: materialError } = await supabaseClient
      .from('study_materials')
      .select('*')
      .eq('id', materialId)
      .single();

    if (materialError) throw materialError;

    // Generate quiz using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an educational AI that generates high-quality quiz questions. Generate exactly 5 multiple-choice questions with 4 options each.'
          },
          {
            role: 'user',
            content: `Generate a ${difficulty} difficulty quiz based on this content:\n\nTitle: ${material.title}\n\nContent: ${material.extracted_text || material.summary}\n\nReturn ONLY a JSON array of 5 questions in this exact format:\n[{"question": "...", "options": ["A", "B", "C", "D"], "correct_answer": "A", "explanation": "..."}]`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;
    const questions = JSON.parse(content);

    // Create quiz
    const { data: quiz, error: quizError } = await supabaseClient
      .from('quizzes')
      .insert({
        user_id: user.id,
        material_id: materialId,
        title: `${material.title} - Quiz`,
        difficulty,
      })
      .select()
      .single();

    if (quizError) throw quizError;

    // Insert questions
    const questionsData = questions.map((q: any) => ({
      quiz_id: quiz.id,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
    }));

    const { error: questionsError } = await supabaseClient
      .from('quiz_questions')
      .insert(questionsData);

    if (questionsError) throw questionsError;

    return new Response(
      JSON.stringify({ quiz, questions: questionsData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
