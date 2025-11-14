import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const motivationalQuotes = [
  "Bro, even electrons keep moving… don't stop studying. ⚡",
  "You got this! Even JEE toppers cry sometimes. 😭",
  "Loading motivation... 99.9% (pls don't close tab). 💪",
  "AI believes in you more than your last semester grades. 🤖",
  "Coffee + Concepts = Success. Keep brewing! ☕",
  "Even Newton needed three laws to get it right. Take your time! 🍎",
  "Your future self is thanking you for studying right now. 🚀",
  "Study mode: activated. Distractions: rejected. 🎯",
  "Every formula you learn is a superpower unlocked. ⚡",
  "Pro tip: Understanding > Memorizing. You're doing great! 🧠",
];

export function MotivationalBanner() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
    
    // Change quote every 30 seconds
    const interval = setInterval(() => {
      const newQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      setQuote(newQuote);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl gradient-accent p-4 shadow-glow-accent">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{quote}</p>
        </div>
      </div>
    </div>
  );
}
