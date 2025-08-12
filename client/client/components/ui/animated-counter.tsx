import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  formatNumber?: (num: number) => string;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2000,
  suffix = "",
  prefix = "",
  className = "",
  formatNumber,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (inView && !hasStarted.current) {
      hasStarted.current = true;
      const startTime = Date.now();
      const startValue = from;
      const endValue = to;
      const totalChange = endValue - startValue;

      const updateCount = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = startValue + (totalChange * easeOutQuart);
        setCount(Math.floor(currentValue));

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setCount(endValue);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [inView, from, to, duration]);

  const formatValue = (value: number) => {
    if (formatNumber) {
      return formatNumber(value);
    }
    return value.toLocaleString();
  };

  return (
    <span ref={ref} className={className}>
      {prefix}{formatValue(count)}{suffix}
    </span>
  );
}
