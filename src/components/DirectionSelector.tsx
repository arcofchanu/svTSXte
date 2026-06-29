import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { ConversionDirection } from '../types';

interface DirectionSelectorProps {
  direction: ConversionDirection;
  onChange: (dir: ConversionDirection) => void;
  disabled?: boolean;
}

export function DirectionSelector({ direction, onChange, disabled }: DirectionSelectorProps) {
  const isTsxToSvelte = direction === 'tsx-to-svelte';

  const toggleDirection = () => {
    onChange(isTsxToSvelte ? 'svelte-to-tsx' : 'tsx-to-svelte');
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <div className={`px-3 py-1 font-mono text-xs rounded transition-colors ${isTsxToSvelte ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
        React TSX
      </div>
      
      <button
        onClick={toggleDirection}
        disabled={disabled}
        className="text-gray-500 hover:text-white transition-colors disabled:opacity-50"
        title="Toggle direction"
      >
        <ArrowRightLeft size={14} />
      </button>

      <div className={`px-3 py-1 font-mono text-xs rounded transition-colors ${!isTsxToSvelte ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
        Svelte
      </div>
    </div>
  );
}
