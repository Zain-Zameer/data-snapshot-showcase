
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full pt-8 pb-6", className)}>
      <div className="container flex flex-col items-center justify-center space-y-4">
        <div className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary animate-fade-in">
          Data Showcase
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-center tracking-tight animate-fade-up" style={{ animationDelay: '100ms' }}>
          Dataset Visualization
        </h1>
        
        <p className="text-lg text-muted-foreground text-center max-w-2xl animate-fade-up" style={{ animationDelay: '200ms' }}>
          Upload your dataset and visualizations to create a beautiful showcase of your data analysis
        </p>
        
        <button 
          onClick={() => {
            const element = document.getElementById('upload-section');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mt-8 flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors animate-fade-up"
          style={{ animationDelay: '300ms' }}
        >
          <span>Get started</span>
          <ChevronDown className="ml-1 h-4 w-4 animate-pulse-slow" />
        </button>
      </div>
    </header>
  );
};

export default Header;
