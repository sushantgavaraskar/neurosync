import { Brain, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  pageName: string;
}

export default function PlaceholderPage({ pageName }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-neural-gradient rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-neural-gradient bg-clip-text text-transparent">
              NeuroSync
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
            <Link to="/search" className="text-muted-foreground hover:text-foreground">Search</Link>
            <Link to="/integrations" className="text-muted-foreground hover:text-foreground">Integrations</Link>
            <Link to="/analytics" className="text-muted-foreground hover:text-foreground">Analytics</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-2 border-dashed border-muted-foreground/25">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">{pageName} Page</CardTitle>
              <CardDescription className="text-base">
                This page is coming soon! We're working hard to bring you an amazing {pageName.toLowerCase()} experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Want to see this page built next? Let us know what features would be most valuable to you.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link to="/dashboard">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Request Features
                  </Button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Continue using NeuroSync through the{" "}
                  <Link to="/dashboard" className="text-primary hover:underline">
                    Dashboard
                  </Link>{" "}
                  to search your data and get AI insights.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
