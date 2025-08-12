import { Brain, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "neural" | "gradient";
  className?: string;
}

export function LoadingSpinner({ size = "md", variant = "default", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
  };

  if (variant === "neural") {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <div className="absolute inset-0 bg-neural-gradient rounded-full animate-pulse"></div>
        <Brain className={cn("relative text-white animate-pulse", sizeClasses[size])} />
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div className={cn("animate-spin", sizeClasses[size], className)}>
        <div className="w-full h-full bg-neural-gradient rounded-full animate-gradient-x"></div>
      </div>
    );
  }

  return (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  );
}

interface SkeletonProps {
  className?: string;
  variant?: "default" | "neural";
}

export function Skeleton({ className, variant = "default" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md",
        variant === "neural" 
          ? "bg-gradient-to-r from-neural-blue/10 via-neural-purple/10 to-neural-cyan/10" 
          : "bg-muted",
        className
      )}
    />
  );
}

interface ThinkingIndicatorProps {
  text?: string;
  className?: string;
}

export function ThinkingIndicator({ text = "Thinking", className }: ThinkingIndicatorProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>
      <span className="text-sm text-muted-foreground">{text}...</span>
    </div>
  );
}

interface ProcessingIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function ProcessingIndicator({ steps, currentStep, className }: ProcessingIndicatorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
              index < currentStep
                ? "bg-green-500 text-white"
                : index === currentStep
                ? "bg-primary text-white animate-pulse"
                : "bg-muted text-muted-foreground"
            )}
          >
            {index < currentStep ? "✓" : index + 1}
          </div>
          <span
            className={cn(
              "text-sm transition-colors duration-300",
              index <= currentStep ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {step}
          </span>
          {index === currentStep && (
            <LoadingSpinner size="sm" variant="neural" />
          )}
        </div>
      ))}
    </div>
  );
}

interface PulsingDotProps {
  color?: "primary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PulsingDot({ color = "primary", size = "md", className }: PulsingDotProps) {
  const colorClasses = {
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500", 
    error: "bg-red-500",
  };

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "rounded-full animate-ping",
          colorClasses[color],
          sizeClasses[size]
        )}
      ></div>
      <div
        className={cn(
          "absolute inset-0 rounded-full",
          colorClasses[color],
          sizeClasses[size]
        )}
      ></div>
    </div>
  );
}

interface GlowEffectProps {
  children: React.ReactNode;
  color?: "primary" | "neural" | "success" | "warning";
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export function GlowEffect({ children, color = "primary", intensity = "medium", className }: GlowEffectProps) {
  const glowClasses = {
    primary: {
      low: "shadow-primary/20",
      medium: "shadow-primary/40",
      high: "shadow-primary/60",
    },
    neural: {
      low: "shadow-neural-blue/20",
      medium: "shadow-neural-blue/40", 
      high: "shadow-neural-blue/60",
    },
    success: {
      low: "shadow-green-500/20",
      medium: "shadow-green-500/40",
      high: "shadow-green-500/60",
    },
    warning: {
      low: "shadow-yellow-500/20",
      medium: "shadow-yellow-500/40",
      high: "shadow-yellow-500/60",
    },
  };

  return (
    <div
      className={cn(
        "transition-all duration-300 hover:shadow-lg",
        glowClasses[color][intensity],
        className
      )}
    >
      {children}
    </div>
  );
}

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  className?: string;
}

export function FloatingActionButton({ 
  onClick, 
  icon, 
  label, 
  position = "bottom-right", 
  className 
}: FloatingActionButtonProps) {
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6", 
    "top-left": "top-6 left-6",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed z-50 w-14 h-14 bg-neural-gradient rounded-full shadow-lg hover:shadow-xl",
        "flex items-center justify-center text-white transition-all duration-300",
        "hover:scale-110 active:scale-95 animate-bounce-gentle",
        positionClasses[position],
        className
      )}
      title={label}
    >
      {icon}
      {label && (
        <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
          {label}
        </span>
      )}
    </button>
  );
}
