import { useState } from "react";
import { Send, Sparkles, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hey there! 👋 I'm Agora, your AI study buddy. Ask me anything about your subjects - doubts, concepts, or even just explain things in simpler terms. Let's ace this together! 🚀"
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, 
      { role: "user", content: input },
      { role: "ai", content: "Great question! Let me break this down for you... (This is a demo response. In production, this will connect to real AI!)" }
    ]);
    setInput("");
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
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
          </div>

          {/* Input Area */}
          <div className="border-t border-border/50 p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything... like 'Explain Newton's Laws' or 'Help with Thermodynamics'"
                className="flex-1"
              />
              <Button 
                onClick={handleSend}
                className="gradient-primary text-primary-foreground shadow-glow"
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
