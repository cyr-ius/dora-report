import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { DataProvider } from "./contexts/DataContext";
import { DebugProvider } from "./contexts/DebugContext";
import { ErrorProvider } from "./contexts/ErrorContext";
import { FormRefProvider } from "./contexts/FormRefContext";
import { StepperProvider } from "./contexts/Stepper";
import { DoraIncident } from "./DoraIncident";
import { DoraThreat } from "./DoraThreat";
import { Footer } from "./Footer";
import { Header } from "./Header";

function App() {
  return (
    <BrowserRouter>
      <DebugProvider>
        <StepperProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormRefProvider>
              <DataProvider>
                <ErrorProvider>
                  <Header />
                  <Routes>
                    <Route path="/" element={<DoraIncident />} />
                    <Route path="/threat" element={<DoraThreat />} />
                    <Route path="/incident" element={<DoraIncident />} />
                  </Routes>
                  <Footer />
                </ErrorProvider>
              </DataProvider>
            </FormRefProvider>
          </LocalizationProvider>
        </StepperProvider>
      </DebugProvider>
    </BrowserRouter>
  );
}

export default App;
