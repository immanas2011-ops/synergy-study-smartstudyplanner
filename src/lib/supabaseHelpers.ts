import { supabase } from "@/integrations/supabase/client";

export const saveChat = async (message: string, role: 'user' | 'ai') => {
  const { data, error } = await supabase
    .from('chat_history')
    .insert({ message, role })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getHistory = async () => {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data || [];
};

export const savePDF = async (pdfName: string, pdfUrl: string) => {
  const { data, error } = await supabase
    .from('pdfs')
    .insert({ pdf_name: pdfName, pdf_url: pdfUrl })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const saveSummary = async (pdfId: string, summary: string) => {
  const { data, error } = await supabase
    .from('summaries')
    .insert({ pdf_id: pdfId, summary })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
