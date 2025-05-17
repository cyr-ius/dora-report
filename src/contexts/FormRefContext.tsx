
import type Form from "@rjsf/core";
import { createContext, useContext, useRef, type FC, type ReactNode, type RefObject } from "react";

type FormRefType = RefObject<Form<any> | null>;

const FormRefContext = createContext<FormRefType | null>(null);

export const FormRefProvider: FC<{ children: ReactNode }> = ({children,}) => {
  const formRef = useRef<Form<any>>(null);

  return (
    <FormRefContext.Provider value={formRef}>
      {children}
    </FormRefContext.Provider>
  );
}

export function useFormRef() {
  const context = useContext(FormRefContext);
  if (context === null) {
    throw new Error("useFormRef must be used within a FormRefProvider");
  }
  return context;
}
