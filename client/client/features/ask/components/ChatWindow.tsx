import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ExternalLink, Copy, ThumbsUp, ThumbsDown, Loader2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useStreamingAnswer } from "@/hooks/useStreamingAnswer";

interface Source {
  id: string;
  title: string;
  url: string;
  score: number;
  excerpt: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
  isStreaming?: boolean;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { text, sources, status, ask, abort } = useStreamingAnswer();

  // Auto-scroll to bottom when new content arrives
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, text]);

  // Handle streaming response
  useEffect(() => {
    if (status === 'loading' && text) {
      setMessages(prev => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        
        if (lastMessage && lastMessage.type === 'assistant' && lastMessage.isStreaming) {
          // Update existing streaming message
          lastMessage.content = text;
          lastMessage.sources = sources;
        } else {
          // Add new streaming message
          updated.push({
            id: Date.now().toString(),
            type: 'assistant',
            content: text,
            sources,
            timestamp: new Date(),
            isStreaming: true,
          });
        }
        
        return updated;
      });
    } else if (status === 'done') {
      // Mark final message as complete
      setMessages(prev => 
        prev.map(msg => 
          msg.isStreaming 
            ? { ...msg, isStreaming: false, content: text, sources }
            : msg
        )
      );
    }
  }, [text, sources, status]);

  const handleSend = () => {
    if (!inputValue.trim() || status === 'loading') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    ask(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const formatText = (content: string) => {
    // Simple formatting for bold, italic, and code
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-neural-gradient rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">NeuroSync AI Assistant</span>
        </div>
        
        {status === 'loading' && (
          <Button variant="outline" size="sm" onClick={abort}>
            Stop Generation
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Ask me anything</h3>
              <p className="text-muted-foreground text-sm">
                I can help you find information across all your connected data sources
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className="flex items-center space-x-2 mb-1">
                  {message.type === 'assistant' ? (
                    <Bot className="w-4 h-4 text-primary" />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <Card className={message.type === 'user' ? 'bg-primary text-primary-foreground' : ''}>
                  <CardContent className="p-3">
                    <div 
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: formatText(message.content) }}
                    />
                    
                    {message.isStreaming && (
                      <div className="flex items-center mt-2">
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        <span className="text-xs text-muted-foreground">Thinking...</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Sources:</div>
                    {message.sources.map((source) => (
                      <Card key={source.id} className="text-xs">
                        <CardContent className="p-2">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium truncate">{source.title}</div>
                              <div className="text-muted-foreground truncate">{source.excerpt}</div>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              <Badge variant="outline" className="text-xs">
                                {Math.round(source.score * 100)}%
                              </Badge>
                              <Button variant="ghost" size="sm" asChild>
                                <a href={source.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Message Actions */}
                {message.type === 'assistant' && !message.isStreaming && (
                  <div className="flex items-center space-x-1 mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(message.content)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      {/* Input */}
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <Input
            ref={inputRef}
            placeholder="Ask a question about your data..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status === 'loading'}
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={!inputValue.trim() || status === 'loading'}
            size="sm"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
