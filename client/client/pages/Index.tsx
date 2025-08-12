import { ArrowRight, Brain, Search, Zap, Shield, Globe, Database, Users, CheckCircle, Play, Star, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import InteractiveDemo from "@/components/InteractiveDemo";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import PricingCalculator from "@/components/PricingCalculator";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-neural-gradient rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-neural-gradient bg-clip-text text-transparent">
              NeuroSync
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#integrations" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-8">
                <a href="#features" className="text-muted-foreground hover:text-foreground py-2">Features</a>
                <a href="#integrations" className="text-muted-foreground hover:text-foreground py-2">Integrations</a>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground py-2">Pricing</a>
                <div className="border-t pt-4 space-y-2">
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/login">Get Started</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge variant="secondary" className="mb-4">
            🚀 Now with GPT-4 and advanced embeddings
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Your AI-Powered
            <br />
            <span className="bg-neural-gradient bg-clip-text text-transparent animate-gradient-x">
              Knowledge Hub
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect all your data sources. Search semantically. Get AI-powered insights with full provenance. 
            Transform your scattered information into intelligent, searchable knowledge.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/login">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground pt-8">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Cancel anytime
            </div>
          </div>
        </div>
        
        {/* Hero Illustration */}
        <div className="mt-16 relative">
          <div className="bg-gradient-to-r from-neural-blue/20 via-neural-purple/20 to-neural-cyan/20 rounded-2xl p-8 backdrop-blur-sm border border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-neural-blue/20 bg-background/50 backdrop-blur animate-float">
                <CardHeader className="pb-3">
                  <div className="w-8 h-8 bg-neural-blue rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-sm">Semantic Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Find answers across all your data sources with natural language queries</p>
                </CardContent>
              </Card>
              
              <Card className="border-neural-purple/20 bg-background/50 backdrop-blur animate-float" style={{animationDelay: '2s'}}>
                <CardHeader className="pb-3">
                  <div className="w-8 h-8 bg-neural-purple rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-sm">AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Get intelligent summaries and insights with full source attribution</p>
                </CardContent>
              </Card>
              
              <Card className="border-neural-cyan/20 bg-background/50 backdrop-blur animate-float" style={{animationDelay: '4s'}}>
                <CardHeader className="pb-3">
                  <div className="w-8 h-8 bg-neural-cyan rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-sm">Universal Connect</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Integrate Slack, Notion, Drive, GitHub, Gmail, and more in minutes</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <InteractiveDemo />

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to transform your scattered data into intelligent, searchable knowledge
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-neural-gradient rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Semantic Understanding</CardTitle>
                <CardDescription>
                  Advanced AI models understand context and meaning, not just keywords
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-neural-gradient rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Bank-grade encryption, SOC 2 compliance, and complete audit trails
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-neural-gradient rounded-lg flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Multi-Tenant Architecture</CardTitle>
                <CardDescription>
                  Complete workspace isolation with per-tenant quotas and controls
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-neural-gradient rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Real-time Sync</CardTitle>
                <CardDescription>
                  Near-instant updates from all connected sources with intelligent change detection
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-neural-gradient rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Hybrid Search</CardTitle>
                <CardDescription>
                  Combines semantic search with traditional keyword search for best results
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-neural-gradient rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Share insights, collaborate on queries, and build team knowledge bases
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Integrations Section */}
      <section id="integrations" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Connect Everything</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Seamlessly integrate with all your favorite tools and platforms
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              'Slack', 'Notion', 'Google Drive', 'GitHub', 'Gmail', 'Confluence',
              'Jira', 'Dropbox', 'OneDrive', 'Trello', 'Asana', 'Linear'
            ].map((integration) => (
              <Card key={integration} className="text-center p-6 hover:shadow-lg transition-shadow border-0">
                <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-xs font-medium">{integration.slice(0, 2)}</span>
                </div>
                <p className="font-medium text-sm">{integration}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Pricing Section */}
      <section id="pricing">
        <PricingCalculator />
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">Ready to Transform Your Knowledge?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of teams already using NeuroSync to unlock insights from their data
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/login">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Schedule a Demo
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-6 pt-8">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-muted-foreground">Trusted by 10,000+ teams worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-neural-gradient rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-neural-gradient bg-clip-text text-transparent">
                  NeuroSync
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Transform your scattered information into intelligent, searchable knowledge.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Features</div>
                <div>Integrations</div>
                <div>Pricing</div>
                <div>Security</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Documentation</div>
                <div>API</div>
                <div>Support</div>
                <div>Status</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 NeuroSync. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
