import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  gradient?: boolean;
  external?: boolean;
}

export function FeatureCard({ icon: Icon, title, description, link, gradient, external }: FeatureCardProps) {
  const content = (
    <div className="p-6">
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${
        gradient ? 'gradient-primary' : 'bg-muted'
      }`}>
        <Icon className={`h-6 w-6 ${gradient ? 'text-primary-foreground' : 'text-primary'}`} />
      </div>
      <h3 className="text-lg font-bold mb-2 text-card-foreground group-hover:text-primary transition-smooth">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {description}
      </p>
      <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
        Get Started →
      </Button>
    </div>
  );

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card hover:shadow-glow transition-smooth">
      {external ? (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        <Link to={link}>
          {content}
        </Link>
      )}
    </Card>
  );
}
