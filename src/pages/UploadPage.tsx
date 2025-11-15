import { useState } from "react";
import { Upload, FileText, Sparkles, Link as LinkIcon, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [currentPdfId, setCurrentPdfId] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) await uploadFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    if (!file.type.includes('pdf')) {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('upload-pdf', {
        body: formData
      });

      if (error) throw error;

      setCurrentPdfId(data.pdf_id);
      
      toast({
        title: "File uploaded! 🎉",
        description: "PDF uploaded successfully. Click Summarize to process it.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload PDF",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSummarize = async () => {
    if (!currentPdfId) {
      toast({
        title: "No PDF selected",
        description: "Please upload a PDF first",
        variant: "destructive"
      });
      return;
    }

    setSummarizing(true);

    try {
      const { data, error } = await supabase.functions.invoke('summarize-pdf', {
        body: { pdf_id: currentPdfId }
      });

      if (error) throw error;

      setSummary(data.summary);
      
      toast({
        title: "Summary generated! ✨",
        description: "Your PDF has been summarized",
      });
    } catch (error: any) {
      toast({
        title: "Summarization failed",
        description: error.message || "Failed to summarize PDF",
        variant: "destructive"
      });
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Upload Your Notes</h1>
          <p className="text-muted-foreground">
            Upload PDFs or documents to get AI-powered summaries and insights
          </p>
        </div>

        {/* Upload Area */}
        <Card 
          className={`border-2 border-dashed p-12 text-center transition-smooth ${
            isDragging 
              ? 'border-primary bg-primary/5 shadow-glow' 
              : 'border-border/50 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full gradient-primary shadow-glow">
              <Upload className="h-10 w-10 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                {uploading ? "Uploading..." : "Drag & Drop your files here"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse from your device
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button 
                  className="gradient-primary text-primary-foreground shadow-glow"
                  disabled={uploading}
                  type="button"
                >
                  Choose Files
                </Button>
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF (Max 50MB)
            </p>
          </div>
        </Card>

        {currentPdfId && (
          <Card className="p-6 border-border/50 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">PDF Ready</h3>
              <Button 
                onClick={handleSummarize}
                disabled={summarizing}
                className="gradient-primary text-primary-foreground"
              >
                {summarizing ? "Processing..." : "Summarize PDF"}
              </Button>
            </div>
            
            {summary && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2">Summary:</h4>
                <p className="text-sm whitespace-pre-wrap">{summary}</p>
              </div>
            )}
          </Card>
        )}

        <Card className="p-6 border-border/50 shadow-card">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-accent">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">What happens after upload?</h3>
              <p className="text-sm text-muted-foreground">
                Agora AI will automatically process your notes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3 p-4 rounded-xl bg-muted/30">
              <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Smart Summaries</h4>
                <p className="text-sm text-muted-foreground">
                  Get crisp, exam-ready summaries
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-xl bg-muted/30">
              <Sparkles className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Key Highlights</h4>
                <p className="text-sm text-muted-foreground">
                  Important keywords marked
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-xl bg-muted/30">
              <LinkIcon className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Reference Links</h4>
                <p className="text-sm text-muted-foreground">
                  YouTube & Wikipedia resources
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-xl bg-muted/30">
              <ListChecks className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Quiz Ready</h4>
                <p className="text-sm text-muted-foreground">
                  Auto-generate quizzes
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Uploads */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Uploads</h2>
          <div className="space-y-3">
            {[
              { name: "Engineering_Mechanics_Ch3.pdf", subject: "Mechanics", date: "2 hours ago" },
              { name: "Thermodynamics_Notes.pdf", subject: "Thermal", date: "1 day ago" },
              { name: "Digital_Electronics.pdf", subject: "Electronics", date: "2 days ago" },
            ].map((file, idx) => (
              <Card key={idx} className="p-4 border-border/50 hover:shadow-card transition-smooth">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{file.subject} • {file.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
