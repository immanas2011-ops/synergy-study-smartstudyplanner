import { useState } from "react";
import { CheckCircle2, XCircle, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function QuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { toast } = useToast();

  const startQuiz = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('quiz', {
        body: { text: "Engineering Mechanics sample content" }
      });

      if (error) throw error;

      setQuestions(data.questions || []);
      setQuizStarted(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate quiz",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentQuestion] || {
    question: "What is Newton's First Law of Motion?",
    options: [
      "Force equals mass times acceleration",
      "An object at rest stays at rest unless acted upon by force",
      "Every action has an equal and opposite reaction",
      "Energy cannot be created or destroyed"
    ],
    correct: 1
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">AI-Generated Quizzes</h1>
          <p className="text-muted-foreground">
            Test your knowledge with smart quizzes from your uploaded notes
          </p>
        </div>

        {!quizStarted ? (
          <div className="space-y-6">
            {/* Available Quizzes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { subject: "Engineering Mechanics", questions: 15, difficulty: "Medium" },
                { subject: "Thermodynamics", questions: 20, difficulty: "Hard" },
                { subject: "Digital Electronics", questions: 10, difficulty: "Easy" },
              ].map((quiz, idx) => (
                <Card key={idx} className="p-6 border-border/50 shadow-card hover:shadow-glow transition-smooth">
                  <h3 className="text-lg font-bold mb-3">{quiz.subject}</h3>
                  <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
                    <span>{quiz.questions} Questions</span>
                    <span>•</span>
                    <span className={
                      quiz.difficulty === 'Easy' ? 'text-success' :
                      quiz.difficulty === 'Medium' ? 'text-warning' : 'text-destructive'
                    }>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <Button 
                    onClick={startQuiz}
                    className="w-full gradient-primary text-primary-foreground"
                    disabled={loading}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {loading ? "Generating..." : "Start Quiz"}
                  </Button>
                </Card>
              ))}
            </div>

            {/* Quiz Stats */}
            <Card className="p-6 border-border/50 shadow-card">
              <h3 className="text-lg font-bold mb-4">Your Quiz Stats</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">24</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-success">85%</p>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">120</p>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quiz Header */}
            <Card className="p-4 border-border/50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Engineering Mechanics Quiz</h3>
                <p className="text-sm text-muted-foreground">Question 1 of 15</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Time Left</p>
                <p className="text-xl font-bold text-primary">12:45</p>
              </div>
            </Card>

            {/* Question Card */}
            <Card className="p-8 border-border/50 shadow-card">
              <h2 className="text-xl font-bold mb-6">{currentQ.question}</h2>
              <div className="space-y-3">
                {currentQ.options.map((option: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-smooth ${
                      selectedAnswer === idx
                        ? idx === currentQ.correct
                          ? 'border-success bg-success/10'
                          : 'border-destructive bg-destructive/10'
                        : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {selectedAnswer === idx && (
                        idx === currentQ.correct ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1">Skip</Button>
                <Button className="flex-1 gradient-primary text-primary-foreground">
                  Next Question
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
