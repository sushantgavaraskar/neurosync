import { TrendingUp, TrendingDown, Activity, Clock, Users, Zap, Database, Search as SearchIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnimatedCounter } from "@/components/ui/animated-counter";

// Mock data for charts and analytics
const searchTrendData = [
  { day: "Mon", searches: 45, aiQueries: 12 },
  { day: "Tue", searches: 52, aiQueries: 18 },
  { day: "Wed", searches: 38, aiQueries: 15 },
  { day: "Thu", searches: 67, aiQueries: 22 },
  { day: "Fri", searches: 71, aiQueries: 28 },
  { day: "Sat", searches: 23, aiQueries: 8 },
  { day: "Sun", searches: 19, aiQueries: 6 },
];

const topQueries = [
  { query: "deployment process", count: 34, trend: "up" },
  { query: "API documentation", count: 28, trend: "up" },
  { query: "team meeting notes", count: 25, trend: "down" },
  { query: "customer feedback", count: 22, trend: "up" },
  { query: "security policies", count: 19, trend: "stable" },
];

const sourceActivity = [
  { name: "Slack", percentage: 45, change: "+12%", color: "bg-green-500" },
  { name: "Notion", percentage: 28, change: "+8%", color: "bg-blue-500" },
  { name: "Gmail", percentage: 15, change: "-3%", color: "bg-red-500" },
  { name: "GitHub", percentage: 8, change: "+15%", color: "bg-purple-500" },
  { name: "Drive", percentage: 4, change: "+2%", color: "bg-yellow-500" },
];

const recentInsights = [
  {
    id: 1,
    title: "Peak usage detected at 2 PM",
    description: "Your team is most active searching for information during mid-afternoon hours.",
    type: "timing",
    impact: "high",
    time: "2 hours ago"
  },
  {
    id: 2,
    title: "New knowledge gap identified",
    description: "Multiple queries about 'React testing' suggest missing documentation.",
    type: "content",
    impact: "medium",
    time: "5 hours ago"
  },
  {
    id: 3,
    title: "Integration performing well",
    description: "Slack integration has 98% uptime with fast sync times.",
    type: "technical",
    impact: "low",
    time: "1 day ago"
  },
];

export function UsageAnalyticsWidget() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Usage Analytics</span>
        </CardTitle>
        <CardDescription>Search and AI query trends over the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Mini chart representation */}
          <div className="flex items-end space-x-2 h-32">
            {searchTrendData.map((day, index) => (
              <div key={day.day} className="flex-1 flex flex-col items-center space-y-1">
                <div className="flex flex-col space-y-1 w-full">
                  <div 
                    className="bg-primary rounded-t transition-all duration-1000 ease-out"
                    style={{ 
                      height: `${(day.searches / 80) * 100}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  />
                  <div 
                    className="bg-neural-purple rounded-t transition-all duration-1000 ease-out"
                    style={{ 
                      height: `${(day.aiQueries / 30) * 50}%`,
                      animationDelay: `${index * 100 + 50}ms`
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Regular Searches</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-neural-purple rounded"></div>
                <span>AI Queries</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              +23% vs last week
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TopQueriesWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <SearchIcon className="w-5 h-5" />
          <span>Top Queries</span>
        </CardTitle>
        <CardDescription>Most searched topics this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topQueries.map((query, index) => (
            <div key={query.query} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-sm mb-1">{query.query}</div>
                <div className="text-xs text-muted-foreground">{query.count} searches</div>
              </div>
              <div className="flex items-center space-x-2">
                {query.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                {query.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                {query.trend === "stable" && <div className="w-4 h-4 rounded-full bg-muted"></div>}
                <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SourceActivityWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Source Activity</span>
        </CardTitle>
        <CardDescription>Usage distribution across data sources</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sourceActivity.map((source) => (
            <div key={source.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{source.name}</span>
                <div className="flex items-center space-x-2">
                  <span>{source.percentage}%</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      source.change.startsWith('+') ? 'text-green-600' : 
                      source.change.startsWith('-') ? 'text-red-600' : 'text-muted-foreground'
                    }`}
                  >
                    {source.change}
                  </Badge>
                </div>
              </div>
              <Progress value={source.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function AIInsightsWidget() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5" />
          <span>AI Insights</span>
        </CardTitle>
        <CardDescription>Intelligent observations about your team's knowledge usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentInsights.map((insight) => (
            <div key={insight.id} className="p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm">{insight.title}</h4>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      insight.impact === 'high' ? 'border-red-200 text-red-700' :
                      insight.impact === 'medium' ? 'border-yellow-200 text-yellow-700' :
                      'border-green-200 text-green-700'
                    }`}
                  >
                    {insight.impact} impact
                  </Badge>
                  <span className="text-xs text-muted-foreground">{insight.time}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickStatsGrid() {
  const stats = [
    {
      label: "Total Searches Today",
      value: 47,
      change: "+12%",
      trend: "up",
      icon: SearchIcon,
      color: "text-blue-600"
    },
    {
      label: "AI Queries",
      value: 23,
      change: "+34%", 
      trend: "up",
      icon: Zap,
      color: "text-purple-600"
    },
    {
      label: "Active Users",
      value: 18,
      change: "+5%",
      trend: "up",
      icon: Users,
      color: "text-green-600"
    },
    {
      label: "Avg Response Time",
      value: 245,
      suffix: "ms",
      change: "-12%",
      trend: "down",
      icon: Clock,
      color: "text-orange-600"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={stat.label} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-muted/20 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">
                <AnimatedCounter 
                  to={stat.value} 
                  suffix={stat.suffix || ""}
                  duration={1500}
                />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
