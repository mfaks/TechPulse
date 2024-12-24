import { createContext, useContext, useState, ReactNode } from 'react';

interface NewsState {
  isProcessing: boolean;
  summary: string;
  isInitialState: boolean;
  setIsProcessing: (value: boolean) => void;
  setSummary: (value: string) => void;
  setIsInitialState: (value: boolean) => void;
}

const NewsContext = createContext<NewsState | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState('Create Your Custom Feed to Get Started');
  const [isInitialState, setIsInitialState] = useState(true);

  return (
    <NewsContext.Provider 
      value={{ 
        isProcessing, 
        setIsProcessing, 
        summary, 
        setSummary, 
        isInitialState, 
        setIsInitialState 
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
}
