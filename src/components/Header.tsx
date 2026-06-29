import React from 'react';
import { FileCode2 } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center px-6 py-4 border-b border-white/5 bg-[#0a0a0a] shrink-0">
      <div className="flex items-center gap-3">
        <FileCode2 size={20} className="text-gray-400" />
        <h1 className="text-sm font-medium tracking-wide text-gray-200 uppercase">
          Formatter
        </h1>
      </div>
    </header>
  );
}
