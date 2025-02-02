import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  text?: string;
  size?: "sm" | "default" | "lg";
}

export function LoadingState({
  className,
  text = "Loading...",
  size = "default",
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-muted-foreground",
        className
      )}
    >
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <p className="mt-2 text-sm">{text}</p>}
    </div>
  );
}
