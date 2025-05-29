import { createContext, useContext, useState, type Dispatch, type FC, type ReactNode, type SetStateAction } from 'react';

interface StepperContextType {
  step: number;
  setStep: Dispatch<SetStateAction<number>>; 
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export const StepperProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [step, setStep] = useState(0);

  return (
    <StepperContext.Provider value={{ step, setStep }}>
      {children}
    </StepperContext.Provider>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) throw new Error('useStepper must be used within a StepperProvider');
  return context;
};