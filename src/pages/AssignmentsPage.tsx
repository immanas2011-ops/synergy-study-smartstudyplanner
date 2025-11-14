import { Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AssignmentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Assignments & Tests</h1>
            <p className="text-muted-foreground">
              Stay on top of your timely assignments and upcoming tests
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="reminders" />
            <Label htmlFor="reminders">Smart Reminders</Label>
          </div>
        </div>

        {/* Upcoming */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Due Soon
          </h2>
          <div className="space-y-3">
            {[
              { 
                title: "Thermodynamics Assignment 3", 
                subject: "Thermodynamics",
                dueDate: "Tomorrow",
                dueTime: "11:59 PM",
                priority: "high"
              },
              { 
                title: "Digital Electronics Lab Report", 
                subject: "Digital Electronics",
                dueDate: "In 3 days",
                dueTime: "5:00 PM",
                priority: "medium"
              },
            ].map((assignment, idx) => (
              <Card key={idx} className="p-4 border-l-4 border-warning shadow-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold mb-1">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{assignment.subject}</p>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-warning" />
                        <span className="text-warning font-medium">{assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.dueTime}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="gradient-primary text-primary-foreground">
                    Start
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* This Week */}
        <div>
          <h2 className="text-xl font-bold mb-4">This Week</h2>
          <div className="space-y-3">
            {[
              { 
                title: "Fluid Mechanics Quiz 2", 
                subject: "Fluid Mechanics",
                dueDate: "Friday",
                dueTime: "2:00 PM",
              },
              { 
                title: "Engineering Graphics Assignment", 
                subject: "Engineering Graphics",
                dueDate: "Saturday",
                dueTime: "11:59 PM",
              },
            ].map((task, idx) => (
              <Card key={idx} className="p-4 border-border/50 hover:shadow-card transition-smooth">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold mb-1">{task.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{task.subject}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{task.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{task.dueTime}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Completed */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Completed
          </h2>
          <div className="space-y-3">
            {[
              { 
                title: "Mechanics Chapter Test", 
                subject: "Engineering Mechanics",
                completedDate: "2 days ago",
                score: "92%"
              },
              { 
                title: "Math Assignment 5", 
                subject: "Mathematics III",
                completedDate: "1 week ago",
                score: "88%"
              },
            ].map((completed, idx) => (
              <Card key={idx} className="p-4 border-border/50 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{completed.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {completed.subject} • {completed.completedDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-success">{completed.score}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
