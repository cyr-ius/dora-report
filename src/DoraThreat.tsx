import { Button, Grid2, Step, StepLabel, Stepper } from "@mui/material";
import Form from '@rjsf/mui';
import type { RJSFSchema } from "@rjsf/utils";
import validator from '@rjsf/validator-ajv8';
import { useCallback, useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { useData } from "./contexts/DataContext";
import { useDebug } from "./contexts/DebugContext";
import { useErrors } from "./contexts/ErrorContext";
import { DebugMode } from "./DebugMode";
import schema from "./schemas/DORA_CYB_Schema_v1.1.json";
import uischema from "./schemas/uiCYB.json";

export const DoraThreat: FC = () => {
    const {t}=useTranslation()
    const [activeStep] = useState(0)
    const {setData} = useData()
    const {setErrors} = useErrors()
    const { debugMode } = useDebug();

    const initialData = {
        submittingEntity:{
            name: "Hello"
        }
    }

    const [step, setStep] = useState(0);
    const stepFields = ['submittingEntity', 'affectedFinancialEntity','primaryContact','secondaryContact','cyberThreat'];

    const goNext = () => {
        setStep((prev) => prev + 1);
    }

    const goPrevious = () => {
        setStep((prev) => Math.max(prev - 1, 0));
    }

    return (
        <Grid2 container spacing={2} justifyContent={'center'}>
            <Grid2 size={{ xs: 12, sm: 12, md: 8 }} >
                <Stepper activeStep={activeStep} alternativeLabel>
                    {stepFields.map((label) => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                    ))}
                </Stepper>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 12, md: 4 }} sx={{ display: debugMode ? 'block' : 'none', mx: 1 }}>
                <DebugMode/>
            </Grid2>            
            <Grid2 size={{ xs: 12, sm: 12, md: debugMode ? 6 : 8 }}>
                <Form 
                    className={`step-container step-${step}`}
                    schema={schema as RJSFSchema} 
                    uiSchema={uischema} 
                    validator={validator}
                    formData={initialData} 
                    onChange={(e)=> setData(e.formData)} 
                    onError={(e) => setErrors(e)} 
                    onSubmit={(e)=> console.debug(e)} 
                    showErrorList={false}
                    liveValidate>

                    </Form>
                    <div className="step-buttons">
                        {step > 0 && <Button type="button" onClick={goNext}>t('Previous')</Button>}
                        {step < 3 && <Button type="button" onClick={goPrevious}>t('Next')</Button>}
                        {step === 3 && <Button type="submit">Soumettre</Button>}
                    </div>
            </Grid2>
        </Grid2>
    )
}