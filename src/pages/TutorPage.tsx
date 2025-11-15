import { useState, useRef } from "react";
import { Send, Sparkles, Bot, Mic, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function TutorPage() {
  const { messages, sendMessage, loading } = useChat();
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input);
    setInput("");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          
          try {
            const { data, error } = await supabase.functions.invoke('voice-chat', {
              body: { audio: base64Audio }
            });

            if (error) throw error;

            const audio = new Audio(`data:audio/mp3;base64,${data.reply_audio}`);
            setPlayingAudio(true);
            audio.onended = () => setPlayingAudio(false);
            audio.play();

            sendMessage(data.user_text);
          } catch (error: any) {
            toast({
              title: "Error",
              description: error.message || "Voice chat failed",
              variant: "destructive"
            });
          }
        };
      };

      mediaRecorder.current.start();
      setRecording(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Microphone access denied",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.stop();
      setRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Ask Agora AI</h1>
          <p className="text-muted-foreground">
            Your 24/7 AI tutor for doubts, concepts, and deep learning
          </p>
        </div>

        <Card className="flex flex-col h-[calc(100vh-240px)] border-border/50 shadow-card">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Hey there! 👋 I'm Agora, your AI study buddy.</p>
                <p className="text-sm mt-2">Ask me anything about your subjects!</p>
              </div>
            )}
            
            {messages.map((message, idx) => (
              <div 
                key={idx}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                  message.role === 'ai' 
                    ? 'gradient-primary' 
                    : 'bg-muted'
                }`}>
                  {message.role === 'ai' ? (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <span className="text-sm font-bold">You</span>
                  )}
                </div>
                <div className={`flex-1 max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'ai'
                    ? 'bg-muted/50'
                    : 'gradient-accent text-white'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-muted/50 rounded-2xl p-4">
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border/50 p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                placeholder="Ask anything... like 'Explain Newton's Laws'"
                className="flex-1"
                disabled={loading}
              />
              <Button 
                onClick={recording ? stopRecording : startRecording}
                variant="outline"
                className={recording ? "bg-destructive text-destructive-foreground" : ""}
                disabled={playingAudio}
              >
                {playingAudio ? <Volume2 className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button 
                onClick={handleSend}
                className="gradient-primary text-primary-foreground shadow-glow"
                disabled={loading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Agora AI • Powered by advanced language models
            </p>
          </div>
        </Card>

        {/* Quick Prompts */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3">Quick Prompts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Explain this concept simply",
              "Give me practice problems",
              "What are the key formulas?",
              "Connect this to real-world examples"
            ].map((prompt, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="justify-start text-left h-auto py-3 hover:border-primary hover:bg-primary/5"
                onClick={() => setInput(prompt)}
                disabled={loading}
              >
                <Sparkles className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                <span className="text-sm">{prompt}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
