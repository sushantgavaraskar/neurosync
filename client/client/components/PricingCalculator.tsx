import { useState, useMemo } from "react";
import { Check, X, Calculator, Users, Database, Zap, Shield, Globe, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface PricingTier {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  userPrice: number;
  maxUsers: number;
  features: {
    [key: string]: boolean | string;
  };
  popular?: boolean;
  color: string;
  gradient: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small teams getting started",
    basePrice: 29,
    userPrice: 0,
    maxUsers: 5,
    color: "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20",
    gradient: "from-blue-500 to-blue-600",
    features: {
      "Max Users": "5 users",
      "Storage": "10 GB",
      "AI Queries": "500/month",
      "Integrations": "Basic (3)",
      "Search History": "30 days",
      "Support": "Email",
      "API Access": false,
      "Custom Retention": false,
      "SSO": false,
      "Audit Logs": false,
      "Priority Support": false,
      "Custom Integrations": false,
      "SLA": false,
      "White-label": false,
    }
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing teams with advanced needs",
    basePrice: 99,
    userPrice: 10,
    maxUsers: 100,
    popular: true,
    color: "border-primary bg-primary/5",
    gradient: "from-primary to-neural-purple",
    features: {
      "Max Users": "25 users",
      "Storage": "100 GB", 
      "AI Queries": "5,000/month",
      "Integrations": "All available",
      "Search History": "1 year",
      "Support": "Priority chat & email",
      "API Access": true,
      "Custom Retention": true,
      "SSO": false,
      "Audit Logs": true,
      "Priority Support": true,
      "Custom Integrations": false,
      "SLA": false,
      "White-label": false,
    }
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with custom needs",
    basePrice: 299,
    userPrice: 20,
    maxUsers: 1000,
    color: "border-purple-200 bg-purple-50/50 dark:bg-purple-950/20",
    gradient: "from-purple-500 to-purple-600",
    features: {
      "Max Users": "Unlimited",
      "Storage": "Unlimited",
      "AI Queries": "Unlimited",
      "Integrations": "All + Custom",
      "Search History": "Unlimited",
      "Support": "24/7 dedicated",
      "API Access": true,
      "Custom Retention": true,
      "SSO": true,
      "Audit Logs": true,
      "Priority Support": true,
      "Custom Integrations": true,
      "SLA": "99.9% uptime",
      "White-label": true,
    }
  }
];

const addOns = [
  { id: "extra_storage", name: "Additional Storage", price: 5, unit: "per 10GB/month" },
  { id: "extra_queries", name: "Extra AI Queries", price: 10, unit: "per 1000/month" },
  { id: "premium_support", name: "Premium Support", price: 50, unit: "per month" },
  { id: "custom_training", name: "Custom AI Training", price: 200, unit: "one-time" },
];

export default function PricingCalculator() {
  const [selectedTier, setSelectedTier] = useState("professional");
  const [userCount, setUserCount] = useState([15]);
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const currentTier = pricingTiers.find(tier => tier.id === selectedTier)!;

  const calculatedPrice = useMemo(() => {
    const basePrice = currentTier.basePrice;
    const additionalUsers = Math.max(0, userCount[0] - (currentTier.id === "starter" ? 5 : currentTier.id === "professional" ? 25 : 0));
    const userCost = additionalUsers * currentTier.userPrice;
    const addOnCost = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find(a => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
    
    const monthlyTotal = basePrice + userCost + addOnCost;
    return isAnnual ? monthlyTotal * 12 * 0.8 : monthlyTotal; // 20% discount for annual
  }, [currentTier, userCount, selectedAddOns, isAnnual]);

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-neural-blue/5 via-background to-neural-purple/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Calculator className="w-4 h-4 mr-1" />
            Pricing Calculator
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Find Your Perfect Plan</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Customize your NeuroSync plan based on your team size and needs
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="calculator" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="comparison">Compare Plans</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-8">
              {/* Calculator Controls */}
              <Card className="p-6 bg-background/50 backdrop-blur border-0">
                <CardContent className="space-y-6">
                  {/* Annual/Monthly Toggle */}
                  <div className="flex items-center justify-center space-x-4">
                    <span className={`text-sm ${!isAnnual ? 'font-semibold' : 'text-muted-foreground'}`}>
                      Monthly
                    </span>
                    <Switch
                      checked={isAnnual}
                      onCheckedChange={setIsAnnual}
                    />
                    <span className={`text-sm ${isAnnual ? 'font-semibold' : 'text-muted-foreground'}`}>
                      Annual
                    </span>
                    {isAnnual && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        Save 20%
                      </Badge>
                    )}
                  </div>

                  {/* User Count Slider */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Team Size</label>
                      <Badge variant="outline">{userCount[0]} users</Badge>
                    </div>
                    <Slider
                      value={userCount}
                      onValueChange={setUserCount}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Plan Selection */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Plan</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {pricingTiers.map((tier) => (
                        <button
                          key={tier.id}
                          onClick={() => setSelectedTier(tier.id)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            selectedTier === tier.id 
                              ? tier.color + " shadow-lg transform scale-105"
                              : "border-border hover:border-muted-foreground/50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{tier.name}</h4>
                            {tier.popular && (
                              <Badge className="text-xs">Popular</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {tier.description}
                          </p>
                          <div className="text-lg font-bold">
                            ${tier.basePrice}
                            <span className="text-sm font-normal text-muted-foreground">/month</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Add-ons (Optional)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addOns.map((addOn) => (
                        <div
                          key={addOn.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedAddOns.includes(addOn.id)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-muted-foreground/50"
                          }`}
                          onClick={() => toggleAddOn(addOn.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-sm">{addOn.name}</h5>
                              <p className="text-xs text-muted-foreground">{addOn.unit}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">${addOn.price}</div>
                              <div className={`w-4 h-4 rounded border-2 ${
                                selectedAddOns.includes(addOn.id)
                                  ? "bg-primary border-primary"
                                  : "border-muted-foreground"
                              }`}>
                                {selectedAddOns.includes(addOn.id) && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Summary */}
              <Card className={`p-8 ${currentTier.color} border-2`}>
                <CardContent className="text-center space-y-4">
                  <h3 className="text-2xl font-bold">Your Custom Plan</h3>
                  <div className="space-y-2">
                    <div className="text-5xl font-bold bg-neural-gradient bg-clip-text text-transparent">
                      <AnimatedCounter 
                        to={Math.round(calculatedPrice)} 
                        prefix="$"
                        duration={1000}
                      />
                    </div>
                    <p className="text-muted-foreground">
                      {isAnnual ? "per year" : "per month"} for {userCount[0]} users
                    </p>
                    {isAnnual && (
                      <p className="text-sm text-green-600 font-medium">
                        You save ${Math.round(calculatedPrice * 0.25)} annually!
                      </p>
                    )}
                  </div>
                  
                  <div className="pt-4">
                    <Button size="lg" className="w-full md:w-auto">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start Free Trial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-8">
              {/* Feature Comparison Table */}
              <Card className="overflow-hidden border-0">
                <CardHeader>
                  <CardTitle>Feature Comparison</CardTitle>
                  <CardDescription>
                    Compare all features across our pricing tiers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-medium">Features</th>
                          {pricingTiers.map((tier) => (
                            <th key={tier.id} className="text-center p-4">
                              <div className="space-y-2">
                                <div className="font-semibold">{tier.name}</div>
                                <div className="text-2xl font-bold">${tier.basePrice}</div>
                                <div className="text-xs text-muted-foreground">per month</div>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(pricingTiers[0].features).map((feature) => (
                          <tr key={feature} className="border-b hover:bg-muted/30">
                            <td className="p-4 font-medium">{feature}</td>
                            {pricingTiers.map((tier) => (
                              <td key={tier.id} className="p-4 text-center">
                                {typeof tier.features[feature] === 'boolean' ? (
                                  tier.features[feature] ? (
                                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                                  ) : (
                                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                                  )
                                ) : (
                                  <span className="text-sm">{tier.features[feature]}</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
