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
    const { materialId } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Fetch material
    const { data: material, error: materialError } = await supabaseClient
      .from('study_materials')
      .select('*')
      .eq('id', materialId)
      .single();

    if (materialError) throw materialError;

    // Use Lovable AI to generate summary and extract keywords
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
            content: 'You are an educational AI that creates concise summaries and extracts key concepts from study materials.'
          },
          {
            role: 'user',
            content: `Analyze this educational content and provide:\n1. A crisp, exam-ready summary (max 200 words)\n2. 5-10 important keywords/concepts\n\nContent: ${material.extracted_text}\n\nReturn as JSON: {"summary": "...", "keywords": ["...", "..."]}`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const result = JSON.parse(aiData.choices[0].message.content);

    // Update material with summary and keywords
    const { error: updateError } = await supabaseClient
      .from('study_materials')
      .update({
        summary: result.summary,
        keywords: result.keywords,
      })
      .eq('id', materialId);

    if (updateError) throw updateError;

    // Generate recommended resources
    const resourcesResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: `Generate 3 educational resource recommendations (YouTube videos or Wikipedia articles) for: ${material.title}. Return as JSON array: [{"title": "...", "url": "...", "type": "youtube|wikipedia"}]`
          }
        ],
      }),
    });

    const resourcesData = await resourcesResponse.json();
    const resources = JSON.parse(resourcesData.choices[0].message.content);

    // Insert resources
    const resourcesInsert = resources.map((r: any) => ({
      material_id: materialId,
      title: r.title,
      url: r.url,
      type: r.type,
    }));

    await supabaseClient.from('recommended_resources').insert(resourcesInsert);

    return new Response(
      JSON.stringify({ success: true, summary: result.summary, keywords: result.keywords, resources }),
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
