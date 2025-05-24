import { Box, Button, Grid, Step, StepLabel, Stepper } from "@mui/material";
import Form from "@rjsf/mui";
import type {
  RegistryFieldsType,
  RegistryWidgetsType,
  RJSFSchema,
} from "@rjsf/utils";
import { useEffect, useState, type FC } from "react";
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
import LayoutHeaderField from "./fields/LayoutHeaderField";
import schema from "./schemas/cybSchema.json";
import uischema from "./schemas/uiCYB.json";
import DescriptionFieldTemplate from "./templates/DescriptionFieldTemplate";
import FieldTemplate from "./templates/FieldTemplate";
import { validator } from "./utils/ajv";
import { translateString } from "./utils/translate";
import SelectWidget from "./widgets/SelectWidget";

export const DoraThreat: FC = () => {
  const formRef = useFormRef();
  const { t } = useTranslation();
  const { data, setData } = useData();
  const { setErrors } = useErrors();
  const { debugMode } = useDebug();
  const { step, setStep } = useStepper();
  const [displayErrors, setDisplayErrors] = useState<
    false | "bottom" | "top" | undefined
  >(false);

  const initialData = {};

  const stepFields = [
    t("Submitting Entity"),
    t("Affected Entity"),
    t("Contact"),
    t("Threat"),
  ];

  useEffect(() => {
    setStep(0);
    setData(initialData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateSteps = () => {
      document.querySelectorAll("div.category").forEach((div) => {
        const classList = Array.from(div.classList);
        const isCurrentStep = classList.includes(`step${step}`);
        div.classList.toggle("active-step", isCurrentStep);
      });
    };

    updateSteps();
    const observer = new MutationObserver(updateSteps);
    const formContainer = document.querySelector(".step-container");
    if (formContainer) {
      observer.observe(formContainer, { childList: true, subtree: true });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    step === stepFields.length - 1
      ? setDisplayErrors("bottom")
      : setDisplayErrors(false);

    return () => observer.disconnect();
  }, [step, stepFields.length]);

  const goNext = () => {
    setStep((prev) => prev + 1);
  };

  const goPrevious = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
      setStep(0);
      setTimeout(() => setData(initialData), 0);
    }
  };

  const fields: RegistryFieldsType = {
    LayoutHeaderField: LayoutHeaderField as any,
  };

  const templates = {
    FieldTemplate: FieldTemplate,
    DescriptionFieldTemplate: DescriptionFieldTemplate,
  };

  const widgets: RegistryWidgetsType = {
    SelectWidget: SelectWidget,
  };

  return (
    <ErrorBoundary>
      <Grid container spacing={2} justifyContent={"center"}>
        <Grid size={{ xs: 12, sm: 12, md: 8 }}>
          <Stepper activeStep={step} alternativeLabel>
            {stepFields.map((label, idx) => (
              <Step key={label} onClick={() => setStep(idx)}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 12, md: 4 }}
          sx={{ display: debugMode ? "block" : "none", mx: 1 }}
        >
          <DebugMode />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: debugMode ? 6 : 8 }}>
          <Form
            ref={formRef}
            schema={schema as RJSFSchema}
            uiSchema={uischema}
            validator={validator}
            formData={data}
            onChange={(e) => {
              setData(e.formData);
              setErrors(e.errors);
            }}
            onError={(e) => {
              console.error(e);
              setErrors(e);
            }}
            showErrorList={displayErrors}
            experimental_defaultFormStateBehavior={{
              arrayMinItems: {
                populate: "requiredOnly",
                mergeExtraDefaults: false,
              },
              emptyObjectFields: "populateRequiredDefaults",
            }}
            translateString={translateString}
            templates={templates}
            fields={fields}
            widgets={widgets}
            liveValidate
          ></Form>
          <Box
            className="step-buttons"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
              mt: 2,
            }}
          >
            <Button type="button" onClick={handleReset}>
              {t("Reset")}
            </Button>
            <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
              {step > 0 && (
                <Button type="button" onClick={goPrevious}>
                  {t("Previous")}
                </Button>
              )}
              {step < stepFields.length - 1 && (
                <Button type="button" onClick={goNext}>
                  {t("Next")}
                </Button>
              )}
              {step === stepFields.length - 1 && (
                <DownloadJSONButton data={data} formRef={formRef} />
              )}
              {step === stepFields.length - 1 && (
                <GeneratePDGButton data={data} formRef={formRef} />
              )}
            </Box>
          </Box>
        </Grid>
        <SpeedDialActions formType="threat" />
      </Grid>
    </ErrorBoundary>
  );
};
