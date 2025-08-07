"use client";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function Loader({ text }: { readonly text: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <p>{text}</p>
    </div>
  );
}

interface SubmitButtonProps {
  text: string;
  loadingText: string;
  className?: string;
  loading?: boolean;
}

export function SubmitButton({
  text,
  loadingText,
  loading,
  className,
}: Readonly<SubmitButtonProps>) {
  const status = useFormStatus();
  const isLoading = status.pending || loading;

  return (
    <Button
      type="submit"
      aria-disabled={isLoading}
      disabled={isLoading}
      className={cn(
        "bg-[#0095ff] hover:bg-[#0085ee] text-white min-w-[120px] px-8 py-2 rounded transition duration-300",
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
    >
      {isLoading ? <Loader text={loadingText} /> : text}
    </Button>
  );
}
