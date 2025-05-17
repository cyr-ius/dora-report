import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { DataProvider } from './contexts/DataContext';
import { DebugProvider } from './contexts/DebugContext';
import { ErrorProvider } from './contexts/ErrorContext';
import { FormRefProvider } from './contexts/FormRefContext';
import { StepperProvider } from './contexts/Stepper';
import { DoraThreat } from './DoraThreat';
import { Footer } from './Footer';
import { Header } from './Header';

function App() {

  return (
    <BrowserRouter>
      <DebugProvider>
        <StepperProvider>
          <FormRefProvider>
          <DataProvider>
            <ErrorProvider>
              <Header/>
              <Routes>
                <Route path="/" element={<DoraThreat />} />
                <Route path="/threat" element={<DoraThreat />} />
              </Routes>
              <Footer/>
            </ErrorProvider>
          </DataProvider>
          </FormRefProvider>
        </StepperProvider>
      </DebugProvider>
    </BrowserRouter>
  )
}

export default App
