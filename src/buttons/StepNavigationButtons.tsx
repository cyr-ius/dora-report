import { Button } from "@mui/material";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../contexts/DataContext";
import { useFormRef } from "../contexts/FormRefContext";
import { useStepper } from "../contexts/Stepper";
import { DownloadJSONButton } from "./DownloadJSON";
import { GeneratePDGButton } from "./GeneratePDF";

export const StepNavigationButtons: FC<{ stepFields: string[] }> = ({
  stepFields,
}) => {
  const { t } = useTranslation();
  const formRef = useFormRef();
  const { data } = useData();
  const { step, setStep } = useStepper();

  const goNext = () => setStep((prev) => prev + 1);
  const goPrevious = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <>
      {step > 0 && <Button onClick={goPrevious}>{t("Previous")}</Button>}
      {step < stepFields.length - 1 && (
        <Button onClick={goNext}>{t("Next")}</Button>
      )}
      {step === stepFields.length - 1 && (
        <>
          <DownloadJSONButton data={data} formRef={formRef} />
          <GeneratePDGButton data={data} formRef={formRef} />
        </>
      )}
    </>
  );
};
