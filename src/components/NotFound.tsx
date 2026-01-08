import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft } from "lucide-react";

export function NotFound(props: any) {
  const { children } = props;
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <Card className="bg-card/50 backdrop-blur-xl border-border">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {children || "Page not found"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
