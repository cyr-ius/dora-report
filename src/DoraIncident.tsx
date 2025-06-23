import { Box, Button, Grid, Step, StepLabel, Stepper } from "@mui/material";
import Form from "@rjsf/mui";
import type { RegistryFieldsType } from "@rjsf/utils";
import { useEffect, useMemo, useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { SpeedDialActions } from "./buttons/SpeedDialAction";
import { StepNavigationButtons } from "./buttons/StepNavigationButtons";
import { useData } from "./contexts/DataContext";
import { useDebug } from "./contexts/DebugContext";
import { useErrors } from "./contexts/ErrorContext";
import { useFormRef } from "./contexts/FormRefContext";
import { useStepper } from "./contexts/Stepper";
import { DebugMode } from "./DebugMode";
import { ErrorBoundary } from "./ErrorBoundary";
import DownTimeField from "./fields/DownTimeField";
import schema from "./schemas/irSchema.json";
import uischema from "./schemas/uiIR.json";
import { getValidatorForLanguage } from "./utils/ajv";
import {
  translateSchema,
  translateString,
  translateUiSchema,
} from "./utils/translate";

export const DoraIncident: FC = () => {
  const formRef = useFormRef();
  const { t, i18n } = useTranslation();
  const { data, setData } = useData();
  const { setErrors } = useErrors();
  const { debugMode } = useDebug();
  const { step, setStep } = useStepper();
  const [displayErrors, setDisplayErrors] = useState<
    false | "bottom" | "top" | undefined
  >(false);

  const initialData = useMemo(
    () => ({
      reportCurrency: "EUR",
      submittingEntity: {
        entityType: "SUBMITTING_ENTITY",
      },
      affectedEntity: [
        {
          entityType: "AFFECTED_ENTITY",
        },
      ],
    }),
    []
  );

  const stepFields = useMemo(
    () => [
      t("incident:incidentSubmission.title", "incidentSubmission"),
      t("incident:submittingEntity.title", "submittingEntity"),
      t("incident:affectedEntity.title", "affectedEntity"),
      t(
        "incident:ultimateParentUndertaking.title",
        "ultimateParentUndertaking"
      ),
      t("incident:primaryContact.title", "primaryContact"),
      t("incident:incident.title", "incident"),
      t("incident:impactAssessment.title", "impactAssessment"),
      t(
        "incident:reportingToOtherAuthorities.title",
        "reportingToOtherAuthorities"
      ),
      t(
        "incident:informationDurationServiceDowntimeActualOrEstimate.title",
        "informationDurationServiceDowntimeActualOrEstimate"
      ),
    ],
    [t]
  );

  const translatedSchema = useMemo(() => {
    console.debug(
      "Translated Schema: ",
      translateSchema(schema, t, "incident")
    );
    return translateSchema(schema, t, "incident");
  }, [t]);
  const translatedUiSchema = useMemo(() => {
    console.debug(
      "Translated UISchema: ",
      translateUiSchema(uischema, t, "incident")
    );
    return translateUiSchema(uischema, t, "incident");
  }, [t]);
  const validator = useMemo(
    () => getValidatorForLanguage(i18n.language),
    [i18n.language]
  );

  useEffect(() => {
    setStep(0);
    setData(initialData);
  }, []);

  useEffect(() => {
    const updateSteps = () => {
      document.querySelectorAll("div.category").forEach((div) => {
        const classList = Array.from(div.classList);
        const isCurrentStep = classList.includes(`step${step}`);
        div.classList.toggle("active-step", isCurrentStep);
      });
    };

    const timeoutId = setTimeout(updateSteps, 10);
    const observer = new MutationObserver(updateSteps);
    const formContainer = document.querySelector(".step-container");
    if (formContainer) {
      observer.observe(formContainer, { childList: true, subtree: true });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    step === stepFields.length - 1
      ? setDisplayErrors("bottom")
      : setDisplayErrors(false);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [i18n.language, step, stepFields.length]);

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
      setStep(0);
      setTimeout(() => setData(initialData), 10);
    }
  };

  const transformErrors = (errors: any) => {
    return errors.map((error: any) => {
      // console.debug(error)
      if (error.name === "const") error.message = "";
      if (error.name === "oneOf") error.message = "";
      return error;
    });
  };

  const fields: RegistryFieldsType = {
    DownTimeField: DownTimeField as any,
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
            schema={translatedSchema}
            uiSchema={translatedUiSchema}
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
              constAsDefaults: "skipOneOf",
              mergeDefaultsIntoFormData: "useDefaultIfFormDataUndefined",
              emptyObjectFields: "skipDefaults",
            }}
            focusOnFirstError={true}
            transformErrors={transformErrors}
            translateString={translateString}
            fields={fields}
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
              <StepNavigationButtons stepFields={stepFields} />
            </Box>
          </Box>
        </Grid>
        <SpeedDialActions formType="incident" />
      </Grid>
    </ErrorBoundary>
  );
};
