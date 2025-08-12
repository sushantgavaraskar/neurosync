import { Brain, MessageSquare, Lightbulb, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import ChatWindow from "@/features/ask/components/ChatWindow";

const suggestedQuestions: string[] = [];

const recentQuestions: Array<{ id: number; question: string; timestamp: string; sources: number }> = [];

const popularQuestions: Array<{ id: number; question: string; count: number; trend: 'up' | 'down' }> = [];

export default function Ask() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
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
              <Link to="/ask" className="text-foreground font-medium">Ask AI</Link>
              <Link to="/integrations" className="text-muted-foreground hover:text-foreground">Integrations</Link>
              <Link to="/analytics" className="text-muted-foreground hover:text-foreground">Analytics</Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Chat Area */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Ask NeuroSync AI</h1>
                <p className="text-muted-foreground">
                  Get intelligent answers from all your connected data sources with full citations.
                </p>
              </div>
              
              <ChatWindow />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Tabs defaultValue="suggestions" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="suggestions" className="text-xs">Suggestions</TabsTrigger>
                  <TabsTrigger value="recent" className="text-xs">Recent</TabsTrigger>
                  <TabsTrigger value="popular" className="text-xs">Popular</TabsTrigger>
                </TabsList>

                <TabsContent value="suggestions" className="space-y-3 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Suggested Questions</span>
                  </div>
                  
                  {(suggestedQuestions.length ? suggestedQuestions : [
                    'Ask about your documents',
                    'Search for a topic',
                  ]).map((question, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <p className="text-sm text-muted-foreground">{question}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="recent" className="space-y-3 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Recent Questions</span>
                  </div>
                  
                  {(recentQuestions.length ? recentQuestions : []).map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <p className="text-sm text-muted-foreground mb-2">{item.question}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{item.timestamp}</span>
                          <Badge variant="secondary" className="text-xs">
                            {item.sources} sources
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="popular" className="space-y-3 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Popular Questions</span>
                  </div>
                  
                  {(popularQuestions.length ? popularQuestions : []).map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <p className="text-sm text-muted-foreground mb-2">{item.question}</p>
                        <div className="flex items-center justify-between text-xs">
                          <Badge variant="secondary" className="text-xs">
                            {item.count} asks
                          </Badge>
                          <span className={`flex items-center ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            <TrendingUp className={`w-3 h-3 mr-1 ${item.trend === 'down' ? 'rotate-180' : ''}`} />
                            {item.trend}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>

              {/* AI Tips */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    AI Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs">
                    <p className="font-medium mb-1">Be specific</p>
                    <p className="text-muted-foreground">Include context like team names, project names, or time ranges.</p>
                  </div>
                  <div className="text-xs">
                    <p className="font-medium mb-1">Ask follow-ups</p>
                    <p className="text-muted-foreground">The AI remembers our conversation context.</p>
                  </div>
                  <div className="text-xs">
                    <p className="font-medium mb-1">Check sources</p>
                    <p className="text-muted-foreground">Every answer includes links to source documents.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Today's Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Questions asked</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sources consulted</span>
                    <Badge variant="secondary">89</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>AI quota used</span>
                    <Badge variant="secondary">34%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
