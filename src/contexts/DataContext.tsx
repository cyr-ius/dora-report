import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
} from 'react';

interface DataContextType {
  data: Record<string, any>;
  setData: Dispatch<SetStateAction<Record<string, any>>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: FC<{ children: ReactNode }> = ({children,}) => {
  const [data, setData] = useState<Record<string, any>>({});

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
