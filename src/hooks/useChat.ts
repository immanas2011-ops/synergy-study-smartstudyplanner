import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

interface Message {
  role: "user" | "ai";
  content: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setMessages(prev => [...prev, { role: "user", content }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: content }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
};
