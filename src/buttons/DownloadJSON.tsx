import { Button } from '@mui/material';
import { useEffect, type FC, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { useErrors } from '../contexts/ErrorContext';

interface JSONButtonProps {
  data: any;
  formRef: RefObject<any>
}

export const DownloadJSONButton: FC<JSONButtonProps> = ({ data, formRef }) => {
  const { t } = useTranslation();
  const {errors} = useErrors()

  useEffect(()=>{
    formRef.current.validateForm();
  }, [])

  const handleDownload = () => {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    const fileName = `formulaire_${timestamp}.json`;

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <Button variant="contained" color="primary" onClick={handleDownload} disabled={errors.length > 0}>
      {t('Download')} JSON
    </Button>
  );
};
