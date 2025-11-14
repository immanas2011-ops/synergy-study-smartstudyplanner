import { TrendingUp, TrendingDown, Target, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Progress Report</h1>
          <p className="text-muted-foreground">
            Track your performance and identify areas for improvement
          </p>
        </div>

        {/* Overall Score */}
        <Card className="p-8 gradient-primary text-primary-foreground shadow-glow">
          <div className="text-center">
            <p className="text-sm opacity-90 mb-2">Overall Performance</p>
            <p className="text-6xl font-bold mb-2">85%</p>
            <p className="text-sm opacity-90">Keep it up! You're doing great 🚀</p>
          </div>
        </Card>

        {/* Subject Performance */}
        <div>
          <h2 className="text-xl font-bold mb-4">Subject-wise Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { subject: "Engineering Mechanics", score: 92, trend: "up", color: "success" },
              { subject: "Thermodynamics", score: 78, trend: "down", color: "warning" },
              { subject: "Digital Electronics", score: 88, trend: "up", color: "primary" },
              { subject: "Fluid Mechanics", score: 81, trend: "up", color: "accent" },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 border-border/50 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{item.subject}</h3>
                  {item.trend === "up" ? (
                    <TrendingUp className="h-5 w-5 text-success" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-warning" />
                  )}
                </div>
                <div className="flex items-end gap-2">
                  <p className={`text-3xl font-bold text-${item.color}`}>{item.score}%</p>
                  <p className="text-sm text-muted-foreground mb-1">
                    {item.trend === "up" ? "+5% from last week" : "-3% from last week"}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Weak Areas */}
        <Card className="p-6 border-border/50 shadow-card">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Target className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Areas to Focus On</h3>
              <p className="text-sm text-muted-foreground">
                Based on your recent quiz performance
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { topic: "Heat Transfer Mechanisms", accuracy: 65, questions: 10 },
              { topic: "Logic Gates Combinations", accuracy: 70, questions: 8 },
              { topic: "Fluid Dynamics Equations", accuracy: 72, questions: 12 },
            ].map((weak, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{weak.topic}</p>
                  <p className="text-sm text-warning font-semibold">{weak.accuracy}%</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {weak.questions} questions attempted
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Improvement Tips */}
        <Card className="p-6 border-border/50 shadow-card gradient-accent text-white">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">AI Recommendations</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Spend 20 more minutes on Heat Transfer concepts this week</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Practice 5 more Logic Gates problems to strengthen understanding</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Review your Thermodynamics notes and take the quiz again</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
