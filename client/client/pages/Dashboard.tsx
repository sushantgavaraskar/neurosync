import { useState } from "react";
import { Search, Plus, Brain, Settings, Users, Database, Zap, ArrowUpRight, Filter, Calendar, FileText, MessageSquare, Github, Mail, HardDrive, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { useSyncStatus } from "@/hooks/useWebSocket";
import {
  QuickStatsGrid,
  UsageAnalyticsWidget,
  TopQueriesWidget,
  SourceActivityWidget,
  AIInsightsWidget
} from "@/components/dashboard/AdvancedWidgets";
import { FloatingActionButton } from "@/components/ui/enhanced-loading";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { syncStatus, isConnected } = useSyncStatus();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neural-gradient rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-neural-gradient bg-clip-text text-transparent">
                NeuroSync
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-foreground font-medium">Dashboard</Link>
              <Link to="/search" className="text-muted-foreground hover:text-foreground">Search</Link>
              <Link to="/ask" className="text-muted-foreground hover:text-foreground">Ask AI</Link>
              <Link to="/integrations" className="text-muted-foreground hover:text-foreground">Integrations</Link>
              <Link to="/analytics" className="text-muted-foreground hover:text-foreground">Analytics</Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Settings className="w-4 h-4" />
            </Button>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link to="/dashboard" className="text-foreground font-medium py-2">Dashboard</Link>
                  <Link to="/search" className="text-muted-foreground hover:text-foreground py-2">Search</Link>
                  <Link to="/ask" className="text-muted-foreground hover:text-foreground py-2">Ask AI</Link>
                  <Link to="/integrations" className="text-muted-foreground hover:text-foreground py-2">Integrations</Link>
                  <Link to="/analytics" className="text-muted-foreground hover:text-foreground py-2">Analytics</Link>
                  <div className="border-t pt-4">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">
              What would you like to know?
            </h1>
            
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Ask anything about your connected data..."
                className="pl-12 pr-12 h-14 text-lg border-2 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10">
                <Zap className="w-4 h-4 mr-2" />
                Ask AI
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                "Latest updates from engineering team"
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                "Project roadmap documents"
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                "Meeting notes from last week"
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                "Customer feedback analysis"
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Stats Grid */}
            <QuickStatsGrid />

            {/* Advanced Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <UsageAnalyticsWidget />
              <TopQueriesWidget />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SourceActivityWidget />
              <AIInsightsWidget />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-neural-blue/5 to-neural-purple/5 border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span>Quick Actions</span>
                  </CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/10">
                    <Plus className="w-4 h-4 mr-2" />
                    Connect New Integration
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/10" asChild>
                    <Link to="/search">
                      <Search className="w-4 h-4 mr-2" />
                      Advanced Search
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/10" asChild>
                    <Link to="/ask">
                      <Brain className="w-4 h-4 mr-2" />
                      Ask AI Assistant
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/10">
                    <Users className="w-4 h-4 mr-2" />
                    Invite Team Members
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-neural-purple/5 to-neural-cyan/5 border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-neural-purple" />
                    <span>AI Usage Today</span>
                  </CardTitle>
                  <CardDescription>Your AI-powered insights and queries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Queries processed</span>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">47</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sources analyzed</span>
                      <Badge variant="secondary" className="bg-neural-purple/10 text-neural-purple">234</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Insights generated</span>
                      <Badge variant="secondary" className="bg-neural-cyan/10 text-neural-cyan">12</Badge>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div className="bg-neural-gradient h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: '68%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">68% of daily AI quota used</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your connected sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { icon: MessageSquare, source: "Slack", title: "New message in #engineering", time: "2 minutes ago", color: "text-green-500" },
                    { icon: Github, source: "GitHub", title: "Pull request merged: Feature/auth-system", time: "15 minutes ago", color: "text-purple-500" },
                    { icon: FileText, source: "Notion", title: "Product roadmap updated", time: "1 hour ago", color: "text-blue-500" },
                    { icon: Mail, source: "Gmail", title: "Customer feedback received", time: "2 hours ago", color: "text-red-500" },
                    { icon: HardDrive, source: "Google Drive", title: "New document shared: Q4 Planning", time: "3 hours ago", color: "text-yellow-500" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.source}</span>
                          <Badge variant="outline" className="text-xs">{item.time}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.title}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
                <CardDescription>Smart summaries and recommendations from your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-l-4 border-neural-blue pl-4">
                    <h4 className="font-semibold mb-2">Weekly Team Summary</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Based on Slack messages, GitHub commits, and meeting notes, your team has been highly productive this week with 23 commits, 45 messages in engineering channels, and 3 major feature completions.
                    </p>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs">Slack</Badge>
                      <Badge variant="outline" className="text-xs">GitHub</Badge>
                      <Badge variant="outline" className="text-xs">Calendar</Badge>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-neural-purple pl-4">
                    <h4 className="font-semibold mb-2">Customer Sentiment Analysis</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Recent customer feedback shows 89% positive sentiment, with users particularly praising the new search functionality. Main concern: mobile app performance.
                    </p>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs">Gmail</Badge>
                      <Badge variant="outline" className="text-xs">Notion</Badge>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-neural-cyan pl-4">
                    <h4 className="font-semibold mb-2">Knowledge Gaps Identified</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      AI detected that deployment procedures are frequently asked about but documentation is scattered across multiple sources. Consider consolidating this information.
                    </p>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs">All Sources</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Slack", icon: MessageSquare, status: "Connected", documents: "2,847", color: "text-green-500", bgColor: "bg-green-500/10" },
                { name: "Notion", icon: FileText, status: "Connected", documents: "432", color: "text-blue-500", bgColor: "bg-blue-500/10" },
                { name: "GitHub", icon: Github, status: "Connected", documents: "1,234", color: "text-purple-500", bgColor: "bg-purple-500/10" },
                { name: "Gmail", icon: Mail, status: "Connected", documents: "5,623", color: "text-red-500", bgColor: "bg-red-500/10" },
                { name: "Google Drive", icon: HardDrive, status: "Connected", documents: "2,711", color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
                { name: "Confluence", icon: FileText, status: "Disconnected", documents: "0", color: "text-muted-foreground", bgColor: "bg-muted/10" },
              ].map((source) => (
                <Card key={source.name} className={`${source.bgColor} border-0`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg ${source.bgColor} flex items-center justify-center`}>
                          <source.icon className={`w-5 h-5 ${source.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{source.name}</CardTitle>
                          <Badge variant={source.status === "Connected" ? "default" : "secondary"} className="text-xs">
                            {source.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Documents</span>
                        <span className="font-medium">{source.documents}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last sync</span>
                        <span className="font-medium">{source.status === "Connected" ? "2 min ago" : "Never"}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      {source.status === "Connected" ? "Configure" : "Connect"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating AI Assistant Button */}
      <FloatingActionButton
        onClick={() => window.location.href = '/ask'}
        icon={<Brain className="w-6 h-6" />}
        label="Ask AI Assistant"
      />
    </div>
  );
}
