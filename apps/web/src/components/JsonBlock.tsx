import { Copy } from "lucide-react";
import { Button } from "./Button";
import { useState } from "react";

export function JsonBlock({ value }: { value: unknown }) {
  const [copied, setCopied] = useState(false);
  const text = JSON.stringify(value, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-border/50 bg-[#1e1e1e]">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={copyToClipboard}
          className="h-7 bg-white/10 hover:bg-white/20 text-white border-transparent"
        >
          {copied ? "Copied!" : <><Copy className="w-3.5 h-3.5 mr-1" /> Copy</>}
        </Button>
      </div>
      <pre className="p-4 text-xs font-mono text-[#d4d4d4] overflow-x-auto whitespace-pre">
        {text}
      </pre>
    </div>
  );
}