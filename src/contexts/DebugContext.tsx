import { createContext, useContext, useState, type FC, type ReactNode } from 'react';

export const DebugContext = createContext({
  debugMode: false,
  toggleDebugMode: () => {},
});

export const DebugProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [debugMode, setDebugMode] = useState(false);
  const toggleDebugMode = () => setDebugMode(prev => !prev);

  return (
    <DebugContext.Provider value={{ debugMode, toggleDebugMode }}>
      {children}
    </DebugContext.Provider>
  );
};


export const useDebug = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};