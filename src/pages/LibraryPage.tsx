import { FolderOpen, FileText, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LibraryPage() {
  const subjects = [
    { name: "Engineering Mechanics", files: 12, color: "primary" },
    { name: "Thermodynamics", files: 8, color: "secondary" },
    { name: "Digital Electronics", files: 15, color: "accent" },
    { name: "Fluid Mechanics", files: 6, color: "success" },
    { name: "Mathematics III", files: 10, color: "warning" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Subject Library</h1>
            <p className="text-muted-foreground">
              Organize your notes and materials by subject
            </p>
          </div>
          <Button className="gradient-primary text-primary-foreground shadow-glow">
            <Plus className="h-4 w-4 mr-2" />
            New Subject
          </Button>
        </div>

        {/* Subject Folders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, idx) => (
            <Card 
              key={idx} 
              className="group p-6 border-border/50 shadow-card hover:shadow-glow transition-smooth cursor-pointer"
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-${subject.color}/10 mb-4 group-hover:scale-110 transition-smooth`}>
                <FolderOpen className={`h-8 w-8 text-${subject.color}`} />
              </div>
              <h3 className="text-lg font-bold mb-2">{subject.name}</h3>
              <p className="text-sm text-muted-foreground">
                {subject.files} files • Last updated 2 days ago
              </p>
            </Card>
          ))}
        </div>

        {/* Recent Files */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Files</h2>
          <div className="space-y-3">
            {[
              { name: "Chapter_3_Mechanics.pdf", subject: "Engineering Mechanics", date: "Today" },
              { name: "Heat_Transfer_Notes.pdf", subject: "Thermodynamics", date: "Yesterday" },
              { name: "Logic_Gates_Summary.pdf", subject: "Digital Electronics", date: "2 days ago" },
              { name: "Bernoulli_Equation.pdf", subject: "Fluid Mechanics", date: "3 days ago" },
            ].map((file, idx) => (
              <Card key={idx} className="p-4 border-border/50 hover:shadow-card transition-smooth">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {file.subject} • {file.date}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Open</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
