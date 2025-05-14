import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
} from 'react';

interface ErrorContextType {
  errors: Record<string, any>;
  setErrors: Dispatch<SetStateAction<Record<string, any>>>;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [errors, setErrors] = useState<Record<string, any>>({});

  return (
    <ErrorContext.Provider value={{ errors, setErrors }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrors = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrors must be used within a ErrorProvider');
  }
  return context;
};
