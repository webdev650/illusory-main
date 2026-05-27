// contexts/IntroContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of your context value
type IntroContextType = {
  hasShownIntro: boolean;
  setHasShownIntro: (value: boolean) => void;
};

// 1. Create the context with initial value and type
const IntroContext = createContext<IntroContextType | undefined>(undefined);

// 2. Create the provider component with TypeScript props
export function IntroProvider({ children }: { children: ReactNode }) {
  const [hasShownIntro, setHasShownIntro] = useState(false);

  return (
    <IntroContext.Provider value={{ hasShownIntro, setHasShownIntro }}>
      {children}
    </IntroContext.Provider>
  );
}

// 3. Create a custom hook with proper typing
export function useIntro(): IntroContextType {
  const context = useContext(IntroContext);
  if (!context) {
    throw new Error('useIntro must be used within an IntroProvider');
  }
  return context;
}