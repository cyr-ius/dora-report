import { createContext, useContext, useState, type FC, type ReactNode } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
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


// eslint-disable-next-line react-refresh/only-export-components
export const useDebug = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};