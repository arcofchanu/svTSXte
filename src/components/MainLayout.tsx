import React, { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}

export function MainLayout({ children, header, footer }: MainLayoutProps) {
  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#0a0a0a] font-sans text-gray-200 relative overflow-hidden">
      <div className="relative z-10 flex flex-col h-full">
        {header}
        <main className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
          {children}
        </main>
        {footer}
      </div>
    </div>
  );
}
