import React, { useState } from 'react';
import { Button } from './Button';
import { CodePane } from './CodePane';
import { DirectionSelector } from './DirectionSelector';
import { ConversionDirection } from '../types';
import { AlertCircle } from 'lucide-react';
import { convertCode } from '../lib/converter';

export function ConverterWidget() {
  const [direction, setDirection] = useState<ConversionDirection>('tsx-to-svelte');
  const [sourceCode, setSourceCode] = useState('');
  const [targetCode, setTargetCode] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    if (!sourceCode.trim()) return;
    
    setIsConverting(true);
    setError(null);
    
    try {
      setTimeout(() => {
        try {
          const result = convertCode(sourceCode, direction);
          setTargetCode(result);
        } catch (err: any) {
          setError(err.message || 'Conversion failed');
        } finally {
          setIsConverting(false);
        }
      }, 300);
    } catch (err: any) {
      setError(err.message);
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!targetCode.trim()) return;
    
    const isTsxToSvelte = direction === 'tsx-to-svelte';
    const extension = isTsxToSvelte ? 'svelte' : 'tsx';
    const filename = `Component.${extension}`;
    
    const blob = new Blob([targetCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isTsxToSvelte = direction === 'tsx-to-svelte';
  
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0a0a0a] border border-white/5 p-3 rounded-lg shrink-0">
        <DirectionSelector 
          direction={direction} 
          onChange={(dir) => {
            setDirection(dir);
          }}
          disabled={isConverting}
        />
        
        <div className="flex items-center gap-3">
          {error && (
            <div className="flex items-center gap-1.5 text-red-400 text-xs font-mono uppercase tracking-wider px-2 py-1">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
          <Button 
            onClick={handleConvert} 
            isLoading={isConverting}
            disabled={!sourceCode.trim()}
          >
            Convert
          </Button>
        </div>
      </div>

      {/* Editor Panes */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-4">
        <CodePane
          title={isTsxToSvelte ? "React TSX Input" : "Svelte Input"}
          value={sourceCode}
          language={isTsxToSvelte ? "typescript" : "html"}
          onChange={setSourceCode}
          placeholder={`// Paste your ${isTsxToSvelte ? 'React (TSX)' : 'Svelte'} code here...`}
          readOnly={isConverting}
          onUpload={setSourceCode}
        />
        
        <CodePane
          title={isTsxToSvelte ? "Svelte Output" : "React TSX Output"}
          value={targetCode}
          language={isTsxToSvelte ? "html" : "typescript"}
          readOnly={true}
          placeholder="// Converted code will appear here..."
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}
