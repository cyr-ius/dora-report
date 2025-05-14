import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { DataProvider } from './contexts/DataContext';
import { DebugProvider } from './contexts/DebugContext';
import { ErrorProvider } from './contexts/ErrorContext';
import { DoraThreat } from './DoraThreat';
import { Footer } from './Footer';
import { Header } from './Header';

function App() {

  return (
    <BrowserRouter>
    <DebugProvider>
      <Header/>
      <DataProvider>
        <ErrorProvider>
        <Routes>
          <Route path="/" element={<DoraThreat />} />
          <Route path="/threat" element={<DoraThreat />} />
        </Routes>
        </ErrorProvider>
      </DataProvider>
      <Footer/>
      </DebugProvider>
    </BrowserRouter>
  )
}

export default App
