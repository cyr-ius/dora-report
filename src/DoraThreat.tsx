import { Box, Button, Grid2, Step, StepLabel, Stepper } from "@mui/material";
import Form from '@rjsf/mui';
import type { RJSFSchema } from "@rjsf/utils";
import { useEffect, type FC } from "react";
import { useTranslation } from "react-i18next";
import { DownloadJSONButton } from "./buttons/DownloadJSON";
import { GeneratePDGButton } from "./buttons/GeneratePDF";
import { SpeedDialActions } from "./buttons/SpeedDialAction";
import { useData } from "./contexts/DataContext";
import { useDebug } from "./contexts/DebugContext";
import { useErrors } from "./contexts/ErrorContext";
import { useFormRef } from "./contexts/FormRefContext";
import { useStepper } from "./contexts/Stepper";
import { DebugMode } from "./DebugMode";
import { ErrorBoundary } from "./ErrorBoundary";
import schema from "./schemas/cybSchema.json";
import uischema from "./schemas/uiCYB.json";
import { validator } from "./utils/ajv";



export const DoraThreat: FC = () => {
    const formRef = useFormRef();
    const { t } = useTranslation();
    const {data, setData} = useData()
    const {setErrors} = useErrors()
    const { debugMode } = useDebug();
    const {step, setStep} = useStepper();
    
    const initialData = {
        submittingEntity:{
            name: "Hello"
        }
    }

    useEffect(()=> {
        setStep(0)
        setData(initialData)
    }, [])

    useEffect(() => {
        const updateSteps = () => {
            document.querySelectorAll('div.category[class*="step"]').forEach(div => {
                const classList = Array.from(div.classList);
                const isCurrentStep = classList.includes(`step${step}`);
                div.classList.toggle('active-step', isCurrentStep);
                hideParents();
            });
        };

        const hideParents = () => {
            document.querySelectorAll('div.category[class*="step"]').forEach(div => {
                const isActive = div.classList.contains('active-step');
                const parent = div.parentElement;
                if (isActive) {
                    if (parent && parent.classList.contains('hidden-category'))
                        parent.classList.remove('hidden-category');
                } else {
                    if (parent && !parent.classList.contains('hidden-category'))
                        parent.classList.add('hidden-category');
                }


            });
        };
        updateSteps();
        const observer = new MutationObserver(updateSteps);
        const formContainer = document.querySelector('.step-container');
        if (formContainer) {
            observer.observe(formContainer, { childList: true, subtree: true });
        }

        return () => observer.disconnect();
    }, [step]);


    const stepFields = ['submittingEntity', 'affectedFinancialEntity','primaryContact','cyberThreat'];

    const goNext = () => {
        setStep((prev) => prev + 1);
    }

    const goPrevious = () => {
        setStep((prev) => Math.max(prev - 1, 0));
    }

    const handleReset = () => {
        formRef.current.reset()
        setStep(0)
        setTimeout(() => setData(initialData), 0);        
    }

    return (
        <ErrorBoundary>
            <Grid2 container spacing={2} justifyContent={'center'}>
                <Grid2 size={{ xs: 12, sm: 12, md: 8 }} >
                    <Stepper activeStep={step} alternativeLabel>
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
                        ref={formRef}
                        schema={schema as RJSFSchema} 
                        uiSchema={uischema} 
                        validator={validator}
                        formData={data} 
                        onChange={(e)=> {
                            console.debug(e);
                            setData(e.formData);
                            setErrors(e.errors)
                        }} 
                        onError={(e) => {console.error(e); setErrors(e)}} 
                        // onSubmit={(e)=> console.debug(e)} 
                        showErrorList={false}
                        liveValidate>
                        </Form>
                        <Box 
                            className="step-buttons" 
                            sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mt: 2 }}
                            >
                            <Button type="button" onClick={handleReset}>{t('Reset')}</Button>
                            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                                {step > 0 && (
                                    <Button type="button" onClick={goPrevious}>{t('Previous')}</Button>
                                )}
                                {step < stepFields.length -1 && (
                                    <Button type="button" onClick={goNext}>{t('Next')}</Button>
                                )}
                                {step === stepFields.length -1 && (
                                    <DownloadJSONButton data={data} formRef={formRef} />
                                )}
                                {step === stepFields.length -1 && (
                                    <GeneratePDGButton data={data} formRef={formRef}/>
                                )}
                            </Box>
                        </Box>
                </Grid2>
                <SpeedDialActions/>
            </Grid2>
        </ErrorBoundary>
    )
}