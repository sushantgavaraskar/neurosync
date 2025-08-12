import { useState, useEffect } from "react";
import { Search, FileText, MessageSquare, Mail, Github, HardDrive, Sparkles, Brain, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const demoQueries = [
  "deployment process",
  "customer feedback",
  "team meeting notes",
  "API documentation",
  "security policies",
];

const mockResults = [
  {
    id: 1,
    title: "Deployment Guide - Production Setup",
    source: "notion",
    icon: FileText,
    excerpt: "Complete guide for deploying applications to production including Docker containers, environment variables, and monitoring setup.",
    score: 95,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    id: 2,
    title: "Customer Feedback Analysis Q4",
    source: "gmail",
    icon: Mail,
    excerpt: "Analysis of customer feedback showing 89% satisfaction rate with key insights on feature requests and pain points.",
    score: 92,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/20",
  },
  {
    id: 3,
    title: "Engineering Team Standup",
    source: "slack",
    icon: MessageSquare,
    excerpt: "Daily standup notes discussing sprint progress, blockers, and upcoming deliverables for the engineering team.",
    score: 88,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/20",
  },
];

export default function InteractiveDemo() {
  const [currentQuery, setCurrentQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof mockResults>([]);
  const [queryIndex, setQueryIndex] = useState(0);

  // Auto-cycle through demo queries
  useEffect(() => {
    const interval = setInterval(() => {
      setQueryIndex((prev) => (prev + 1) % demoQueries.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Simulate search when query changes
  useEffect(() => {
    if (currentQuery) {
      setIsSearching(true);
      setResults([]);
      
      const timer = setTimeout(() => {
        setResults(mockResults);
        setIsSearching(false);
      }, 1200);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [currentQuery]);

  const handleDemoQuery = (query: string) => {
    setCurrentQuery(query);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-neural-blue/5 via-background to-neural-purple/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            ✨ Interactive Demo
          </Badge>
          <h2 className="text-4xl font-bold mb-4">See NeuroSync in Action</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of AI-driven knowledge search. Try searching across connected data sources.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Demo Interface */}
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Try searching for anything..."
                  className="pl-12 pr-4 h-14 text-lg border-2 focus:border-primary bg-background/80 backdrop-blur"
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Brain className="w-5 h-5 text-primary animate-spin" />
                  </div>
                )}
              </div>

              {/* Suggested Queries */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Try these examples:</p>
                <div className="flex flex-wrap gap-2">
                  {demoQueries.map((query, index) => (
                    <Button
                      key={query}
                      variant="outline"
                      size="sm"
                      onClick={() => handleDemoQuery(query)}
                      className={`transition-all duration-300 ${
                        index === queryIndex
                          ? "border-primary bg-primary/10 animate-pulse-glow"
                          : "hover:border-primary/50"
                      }`}
                    >
                      {query}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Search Results */}
              <div className="space-y-4 min-h-[400px]">
                {isSearching && (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                            <div className="h-16 bg-muted rounded"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {results.map((result, index) => (
                  <Card
                    key={result.id}
                    className={`hover:shadow-lg transition-all duration-500 cursor-pointer transform hover:-translate-y-1 ${result.bg} border-0 animate-slide-in-up`}
                    style={{
                      animationDelay: `${index * 150}ms`,
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg ${result.bg} flex items-center justify-center`}>
                          <result.icon className={`w-5 h-5 ${result.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">{result.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {result.score}% match
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {result.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={`text-xs ${result.color}`}>
                              {result.source}
                            </Badge>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {results.length > 0 && (
                <div className="text-center pt-4">
                  <Button asChild size="lg" className="animate-bounce">
                    <Link to="/dashboard">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Try NeuroSync Now
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Feature Highlights */}
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-neural-blue/10 to-neural-purple/10 border-0">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-neural-gradient rounded-lg flex items-center justify-center">
                      <Search className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Semantic Search</h3>
                      <p className="text-sm text-muted-foreground">Understands context and meaning</p>
                    </div>
                  </div>
                  <div className="pl-15">
                    <p className="text-sm">
                      Our AI doesn't just match keywords - it understands what you're really looking for
                      and finds relevant information even when you don't use exact terms.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-neural-purple/10 to-neural-cyan/10 border-0">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-neural-gradient rounded-lg flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI-Powered Insights</h3>
                      <p className="text-sm text-muted-foreground">Smart summaries with citations</p>
                    </div>
                  </div>
                  <div className="pl-15">
                    <p className="text-sm">
                      Get intelligent answers and summaries from your data with full source attribution.
                      Every insight is backed by specific documents and references.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-neural-cyan/10 to-neural-blue/10 border-0">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-neural-gradient rounded-lg flex items-center justify-center">
                      <HardDrive className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Universal Integration</h3>
                      <p className="text-sm text-muted-foreground">Connect everything in minutes</p>
                    </div>
                  </div>
                  <div className="pl-15">
                    <p className="text-sm">
                      Seamlessly connects to Slack, Notion, Google Drive, GitHub, Gmail, and more.
                      Your entire knowledge base, unified and searchable.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
