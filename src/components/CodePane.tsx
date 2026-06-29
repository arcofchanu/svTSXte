import React, { useRef, useState } from 'react';
import { Upload, Download } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface CodePaneProps {
  title: string;
  value: string;
  language?: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  onUpload?: (val: string) => void;
  onDownload?: () => void;
}

export function CodePane({ title, value, language = 'typescript', onChange, readOnly = false, placeholder, className = '', onUpload, onDownload }: CodePaneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    
    // Check file extension based on language
    const fileName = file.name.toLowerCase();
    if (language === 'typescript' && !fileName.endsWith('.tsx') && !fileName.endsWith('.ts') && !fileName.endsWith('.jsx') && !fileName.endsWith('.js')) {
      alert("Invalid file type. Please upload a TypeScript/React file.");
      return;
    }
    if (language === 'html' && !fileName.endsWith('.svelte') && !fileName.endsWith('.html')) {
      alert("Invalid file type. Please upload a Svelte/HTML file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content && onUpload) {
        onUpload(content);
      } else if (content && onChange) {
        onChange(content);
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!readOnly && (onUpload || onChange)) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (readOnly || (!onUpload && !onChange)) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const loc = value ? value.split('\n').length : 0;

  return (
    <div 
      className={`flex flex-col h-full bg-[#0f0f0f] border rounded-lg overflow-hidden transition-colors ${
        isDragging ? 'border-gray-500' : 'border-white/5'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-mono tracking-wider text-gray-500 uppercase">
            {title}
          </h2>
          <span className="text-[10px] font-mono text-gray-600 bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-widest border border-white/5">
            {loc} LOC
          </span>
        </div>
        <div className="flex gap-2">
          {!readOnly && (onUpload || onChange) && (
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept={language === 'typescript' ? ".tsx,.ts,.jsx,.js" : ".svelte,.html"} 
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono text-gray-400 hover:text-white transition-colors cursor-pointer uppercase tracking-widest"
                title="Upload file"
              >
                <Upload size={12} />
                <span>Upload</span>
              </button>
            </div>
          )}
          {onDownload && (
            <button
              onClick={onDownload}
              disabled={!value.trim()}
              className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer uppercase tracking-widest"
              title="Download file"
            >
              <Download size={12} />
              <span>Download</span>
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 p-0 relative min-h-[300px]">
        {(!value && placeholder) && (
          <div className="absolute inset-0 p-4 pointer-events-none z-10 text-[13px] font-mono text-[#333]">
            {placeholder}
          </div>
        )}
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={value}
          onChange={(val) => onChange?.(val || '')}
          options={{
            readOnly: readOnly,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'Consolas, "Courier New", monospace',
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            tabSize: 2,
          }}
        />
        {isDragging && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-sm pointer-events-none text-gray-300 z-20">
            <Upload size={24} className="mb-2" />
            <p className="font-mono text-xs uppercase tracking-widest">Drop file</p>
          </div>
        )}
      </div>
    </div>
  );
}
