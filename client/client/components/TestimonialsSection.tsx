import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, Users, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Engineering Manager",
    company: "TechFlow",
    avatar: "/placeholder.svg",
    rating: 5,
    quote: "NeuroSync transformed how our team accesses knowledge. Instead of spending hours searching through Slack, Notion, and GitHub, we get instant, accurate answers with full context.",
    metrics: {
      timeSaved: "15 hours/week",
      efficiency: "+67%",
      satisfaction: "9.8/10"
    },
    tags: ["Engineering", "500+ employees"]
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Head of Product",
    company: "InnovateCorp",
    avatar: "/placeholder.svg",
    rating: 5,
    quote: "The AI-powered insights have been game-changing. We can quickly understand customer feedback patterns across all our channels and make data-driven decisions faster than ever.",
    metrics: {
      timeSaved: "12 hours/week",
      efficiency: "+45%",
      satisfaction: "9.6/10"
    },
    tags: ["Product", "200+ employees"]
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Customer Success Lead",
    company: "GrowthLabs",
    avatar: "/placeholder.svg",
    rating: 5,
    quote: "Our customer support team can now find solutions instantly across our entire knowledge base. Response times decreased by 40% while customer satisfaction scores increased.",
    metrics: {
      timeSaved: "20 hours/week",
      efficiency: "+52%",
      satisfaction: "9.9/10"
    },
    tags: ["Customer Success", "100+ employees"]
  },
  {
    id: 4,
    name: "David Kim",
    role: "CTO",
    company: "ScaleTech",
    avatar: "/placeholder.svg",
    rating: 5,
    quote: "NeuroSync's semantic search capabilities are incredible. It understands context and finds relevant information even when we don't know exactly what we're looking for.",
    metrics: {
      timeSaved: "25 hours/week",
      efficiency: "+73%",
      satisfaction: "9.7/10"
    },
    tags: ["Leadership", "1000+ employees"]
  }
];

const companyStats = [
  { label: "Teams Using NeuroSync", value: 2500, suffix: "+", icon: Users },
  { label: "Hours Saved Weekly", value: 15000, suffix: "+", icon: TrendingUp },
  { label: "Faster Knowledge Access", value: 85, suffix: "%", icon: Zap },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            💬 Customer Stories
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Loved by Teams Worldwide</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how teams are transforming their knowledge management with NeuroSync
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {companyStats.map((stat, index) => (
            <Card key={index} className="text-center p-6 border-0 bg-background/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-neural-gradient rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold bg-neural-gradient bg-clip-text text-transparent mb-2">
                  <AnimatedCounter 
                    to={stat.value} 
                    suffix={stat.suffix}
                    duration={2500}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-background via-background to-neural-blue/5">
            <CardContent className="p-8 md:p-12">
              {/* Quote Icon */}
              <div className="absolute top-6 left-6 opacity-10">
                <Quote className="w-16 h-16 text-primary" />
              </div>

              {/* Navigation */}
              <div className="absolute top-6 right-6 flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevTestimonial}
                  className="w-8 h-8 p-0 hover:bg-primary/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextTestimonial}
                  className="w-8 h-8 p-0 hover:bg-primary/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="relative z-10">
                {/* Quote */}
                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8 text-foreground">
                  "{currentTestimonial.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={currentTestimonial.avatar} />
                    <AvatarFallback className="bg-neural-gradient text-white font-semibold">
                      {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-lg">{currentTestimonial.name}</div>
                    <div className="text-muted-foreground">{currentTestimonial.role}</div>
                    <div className="text-sm font-medium text-primary">{currentTestimonial.company}</div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="flex">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentTestimonial.rating}.0 out of 5
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {currentTestimonial.metrics.timeSaved}
                    </div>
                    <div className="text-xs text-green-600/80">Time Saved</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {currentTestimonial.metrics.efficiency}
                    </div>
                    <div className="text-xs text-blue-600/80">Efficiency Gain</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {currentTestimonial.metrics.satisfaction}
                    </div>
                    <div className="text-xs text-purple-600/80">Satisfaction</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {currentTestimonial.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary scale-125"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.filter((_, index) => index !== currentIndex).slice(0, 3).map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-background/50 backdrop-blur"
              onClick={() => setCurrentIndex(testimonials.findIndex(t => t.id === testimonial.id))}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback className="bg-neural-gradient text-white text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3">
                  "{testimonial.quote}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
