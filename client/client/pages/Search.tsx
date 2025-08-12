import { useState } from "react";
import { Search as SearchIcon, Filter, Clock, Bookmark, Brain, ArrowUpRight, Calendar, User, Globe, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useSearch, useSavedSearches, useRecentSearches } from "@/features/search/hooks/useSearch";

const sourceIcons = {
  slack: '💬',
  notion: '📝',
  github: '🐙',
  gmail: '📧',
  drive: '📁',
};

const sourceColors: Record<string, string> = {
  slack: 'bg-green-500/10 text-green-700 border-green-200',
  notion: 'bg-blue-500/10 text-blue-700 border-blue-200',
  github: 'bg-purple-500/10 text-purple-700 border-purple-200',
  gmail: 'bg-red-500/10 text-red-700 border-red-200',
  drive: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
};

export default function Search() {
  const {
    query,
    setQuery,
    results,
    total,
    facets,
    filters,
    updateFilters,
    clearFilters,
    isLoading,
    error,
    isAdvancedMode,
    setIsAdvancedMode,
    saveSearch,
    isSaving,
  } = useSearch();

  const { data: savedSearches } = useSavedSearches();
  const { data: recentSearches } = useRecentSearches();

  const handleSearch = () => {
    // Search is automatically triggered by the query change
  };

  const handleSourceFilter = (source: string, checked: boolean) => {
    const newSources = checked 
      ? [...(filters.sources || []), source]
      : (filters.sources || []).filter(s => s !== source);
    updateFilters({ sources: newSources });
  };

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
              <Link to="/search" className="text-foreground font-medium">Search</Link>
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
        {/* Search Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search across all your connected data..."
              className="pl-12 pr-32 h-14 text-lg border-2 focus:border-primary"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-1" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="space-y-6 mt-6">
                    <div>
                      <h4 className="font-medium mb-3">Sources</h4>
                      <div className="space-y-2">
                        {facets?.sources?.map((source) => (
                          <div key={source.name} className="flex items-center space-x-2">
                            <Checkbox
                              id={source.name}
                              checked={filters.sources?.includes(source.name) || false}
                              onCheckedChange={(checked) => handleSourceFilter(source.name, checked as boolean)}
                            />
                            <label htmlFor={source.name} className="text-sm flex-1 flex items-center justify-between">
                              <span className="flex items-center">
                                <span className="mr-2">{sourceIcons[source.name as keyof typeof sourceIcons]}</span>
                                {source.name}
                              </span>
                              <Badge variant="secondary" className="text-xs">{source.count}</Badge>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-3">Sort By</h4>
                      <Select
                        value={filters.sortBy || 'relevance'}
                        onValueChange={(value) => updateFilters({ sortBy: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="source">Source</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Search Stats & Quick Actions */}
          {query && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {isLoading ? 'Searching...' : `${total} results found`}
                {query && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-6 px-2"
                    onClick={() => saveSearch()}
                    disabled={isSaving}
                  >
                    <Bookmark className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAdvancedMode(!isAdvancedMode)}
              >
                Advanced {isAdvancedMode ? 'On' : 'Off'}
              </Button>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="results" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="results">Search Results</TabsTrigger>
              <TabsTrigger value="saved">Saved Searches</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-4">
              {error && (
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardContent className="pt-6">
                    <p className="text-destructive text-sm">
                      Error: {error.message || 'Search failed. Please try again.'}
                    </p>
                  </CardContent>
                </Card>
              )}

              {isLoading && (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="pt-6">
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

              {!isLoading && results.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${sourceColors[result.sourceType] ?? ''}`}
                          >
                            <span className="mr-1">{sourceIcons[result.sourceType as keyof typeof sourceIcons] ?? '📄'}</span>
                            {result.sourceType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Score: {Math.round(result.score * 100)}%
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2 leading-tight">
                          {result.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {result.excerpt}
                        </p>
                        
                        {result.highlight && (
                          <div className="bg-primary/5 border-l-4 border-primary pl-3 py-2 mb-3">
                            <p className="text-sm" dangerouslySetInnerHTML={{ __html: result.highlight }} />
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          {result.metadata?.author && (
                            <span className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {result.metadata?.author}
                            </span>
                          )}
                          {result.metadata?.channel && (
                            <span className="flex items-center">
                              <Globe className="w-3 h-3 mr-1" />
                              {result.metadata?.channel}
                            </span>
                          )}
                          {result.metadata?.createdAt && (
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(result.metadata.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" asChild>
                        <a href={result.url ?? '#'} target="_blank" rel="noopener noreferrer">
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {!isLoading && query && results.length === 0 && (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Try adjusting your search terms or filters
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="saved" className="space-y-4">
              {savedSearches?.map((search: any) => (
                <Card key={search.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{search.query}</h4>
                        <p className="text-sm text-muted-foreground">
                          Saved {new Date(search.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setQuery(search.query)}>
                        Run Search
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              {recentSearches?.map((search: any) => (
                <Card key={search.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{search.query}</h4>
                        <p className="text-sm text-muted-foreground">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(search.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setQuery(search.query)}>
                        Search Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
