import { useState } from "react";
import { Plus, Minus, HelpCircle, Sparkles, Shield, Zap, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const faqCategories = [
  {
    id: "general",
    name: "General",
    icon: HelpCircle,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    id: "features",
    name: "Features",
    icon: Sparkles,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/20",
  },
  {
    id: "technical",
    name: "Technical",
    icon: Zap,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/20",
  },
];

const faqs = [
  {
    id: 1,
    category: "general",
    question: "How does NeuroSync work?",
    answer: "NeuroSync connects to your existing tools (Slack, Notion, GitHub, Gmail, etc.) and uses advanced AI to understand and index your content. When you search, it provides semantic results with full context and source attribution, going beyond simple keyword matching to understand what you're really looking for."
  },
  {
    id: 2,
    category: "general",
    question: "Which integrations are supported?",
    answer: "We support all major productivity tools including Slack, Notion, Google Drive, GitHub, Gmail, Confluence, Jira, Dropbox, OneDrive, Trello, Asana, and Linear. We're constantly adding new integrations based on customer feedback."
  },
  {
    id: 3,
    category: "features",
    question: "What makes the AI search different?",
    answer: "Our semantic search understands context and meaning, not just keywords. It can find relevant information even when you don't use exact terms. Plus, every answer includes full source attribution with links back to the original documents, ensuring transparency and trust."
  },
  {
    id: 4,
    category: "features",
    question: "Can I ask questions in natural language?",
    answer: "Absolutely! Our conversational AI interface lets you ask questions naturally, like 'What were the main outcomes of yesterday's meeting?' or 'Find customer feedback about our mobile app.' The AI understands context and provides detailed answers with sources."
  },
  {
    id: 5,
    category: "security",
    question: "How secure is my data?",
    answer: "Security is our top priority. We use bank-grade encryption, SOC 2 compliance, complete workspace isolation, and never store your raw data permanently. All OAuth tokens are encrypted, and we maintain comprehensive audit logs. Your data stays within your control."
  },
  {
    id: 6,
    category: "security",
    question: "Do you train AI models on my data?",
    answer: "No, we never use your data to train AI models. Your information is used only for generating responses to your specific queries. We offer complete data privacy with options to opt out of any AI training usage for enterprise customers."
  },
  {
    id: 7,
    category: "technical",
    question: "How fast is the search?",
    answer: "Most searches return results in under 300ms for keyword queries and under 600ms for semantic search. Our caching and indexing infrastructure is designed for speed, with real-time sync capabilities for instant access to new content."
  },
  {
    id: 8,
    category: "technical",
    question: "What about API limits and quotas?",
    answer: "Each plan includes generous quotas for queries, storage, and AI requests. We implement intelligent caching and batching to minimize API calls. Enterprise plans offer unlimited usage with dedicated infrastructure and SLA guarantees."
  },
  {
    id: 9,
    category: "general",
    question: "How do I get started?",
    answer: "Simply sign up for a free 14-day trial, connect your first integration (takes about 2 minutes), and start searching. Our onboarding flow guides you through connecting multiple sources and learning the best search practices for your team."
  },
  {
    id: 10,
    category: "features",
    question: "Can I customize the search experience?",
    answer: "Yes! You can create custom filters, save frequent searches, set up alerts for new content, and configure workspace-specific settings. Admin users can also manage permissions and set up custom retention policies."
  },
];

export default function FAQSection() {
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [openItems, setOpenItems] = useState<number[]>([1]); // First item open by default

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqs.filter(faq => faq.category === selectedCategory);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            ❓ Frequently Asked Questions
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Know</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get quick answers to common questions about NeuroSync's features, security, and implementation.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
                  Categories
                </h3>
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.id
                        ? `${category.bg} ${category.color} shadow-sm`
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <category.icon className={`w-5 h-5 ${
                        selectedCategory === category.id ? category.color : "text-muted-foreground"
                      }`} />
                      <span className={`font-medium ${
                        selectedCategory === category.id ? category.color : "text-foreground"
                      }`}>
                        {category.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <Collapsible
                    key={faq.id}
                    open={openItems.includes(faq.id)}
                    onOpenChange={() => toggleItem(faq.id)}
                  >
                    <Card 
                      className={`border-0 transition-all duration-300 hover:shadow-md animate-slide-in-up ${
                        openItems.includes(faq.id)
                          ? "shadow-lg bg-muted/20"
                          : "bg-background hover:bg-muted/10"
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <CollapsibleTrigger className="w-full">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between text-left">
                            <h4 className="font-semibold text-lg pr-4">
                              {faq.question}
                            </h4>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                              openItems.includes(faq.id)
                                ? "bg-primary text-primary-foreground rotate-180"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {openItems.includes(faq.id) ? (
                                <Minus className="w-4 h-4" />
                              ) : (
                                <Plus className="w-4 h-4" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent className="px-6 pb-6 pt-0">
                          <div className="border-t border-border pt-4">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>

              {/* CTA at bottom */}
              <Card className="mt-12 bg-gradient-to-br from-neural-blue/10 via-neural-purple/10 to-neural-cyan/10 border-0">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
                  <p className="text-muted-foreground mb-6">
                    Our team is here to help you get the most out of NeuroSync.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      Contact Support
                    </button>
                    <button className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors">
                      Schedule Demo
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
