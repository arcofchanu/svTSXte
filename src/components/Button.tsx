import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ComponentProps<"button"> {
  isLoading?: boolean;
}

export function Button({ children, isLoading, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`relative inline-flex items-center justify-center px-4 py-2 text-xs font-mono tracking-widest uppercase text-white transition-all duration-200 bg-white/10 border border-white/5 rounded-md hover:bg-white/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Loader2 className="w-3 h-3 animate-spin text-white/80" />
        </span>
      )}
      <span className={isLoading ? 'pl-5 transition-all duration-200' : ''}>{children}</span>
    </button>
  );
}
