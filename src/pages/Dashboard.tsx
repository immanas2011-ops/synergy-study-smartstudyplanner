import { Upload, MessageSquare, ListChecks, BarChart3, FolderOpen, Calendar } from "lucide-react";
import { MotivationalBanner } from "@/components/MotivationalBanner";
import { FeatureCard } from "@/components/FeatureCard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-primary-glow bg-clip-text text-transparent">
              Welcome to Synergy Study
            </h1>
            <p className="text-lg text-muted-foreground">
              Your smart AI study partner for mastering engineering concepts 🚀
            </p>
          </div>
          
          {/* Motivational Banner */}
          <MotivationalBanner />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-card border border-border/50 p-4 shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Study Streak</p>
            <p className="text-2xl font-bold text-primary">7 Days 🔥</p>
          </div>
          <div className="rounded-xl bg-card border border-border/50 p-4 shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Quizzes Completed</p>
            <p className="text-2xl font-bold text-secondary">24</p>
          </div>
          <div className="rounded-xl bg-card border border-border/50 p-4 shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Notes Uploaded</p>
            <p className="text-2xl font-bold text-accent">12</p>
          </div>
          <div className="rounded-xl bg-card border border-border/50 p-4 shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Avg. Score</p>
            <p className="text-2xl font-bold text-success">85%</p>
          </div>
        </div>

        {/* Feature Cards */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Upload}
              title="Upload Notes"
              description="Upload PDFs and notes to get AI-powered summaries, highlights, and resources"
              link="https://undepreciated-scorningly-charlyn.ngrok-free.dev/docs"
              gradient
              external
            />
            <FeatureCard
              icon={MessageSquare}
              title="Ask Agora AI"
              description="Get instant help with doubts, concept clarity, and deep learning from your AI tutor"
              link="https://undepreciated-scorningly-charlyn.ngrok-free.dev/voice"
              gradient
              external
            />
            <FeatureCard
              icon={ListChecks}
              title="Start Quiz"
              description="Test your knowledge with AI-generated quizzes from your uploaded material"
              link="https://undepreciated-scorningly-charlyn.ngrok-free.dev/generate_quiz"
              external
            />
            <FeatureCard
              icon={BarChart3}
              title="Progress Report"
              description="Track your performance, identify weak areas, and get improvement tips"
              link="/progress"
            />
            <FeatureCard
              icon={FolderOpen}
              title="Subject Library"
              description="Organize your notes and materials by subject for easy access"
              link="/library"
            />
            <FeatureCard
              icon={Calendar}
              title="Assignments"
              description="Stay on top of timely assignments and tests with smart reminders"
              link="/assignments"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
