import { JsonSchema } from '@jsonforms/core';
import { Button } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { validateSchema } from '../components/utils';
import { useSchema } from '../context/SchemaContext';

interface JSONButtonProps {
  schema: JsonSchema;
  data: any;
}

export const DownloadJSONButton: FC<JSONButtonProps> = ({ schema, data }) => {
  const { t } = useTranslation();
  const { setErrors } = useSchema();

  const handleDownload = (data: any) => {
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

  const downloadButton = () => {
    const vs = validateSchema(schema, data);
    if (vs.valid) {
      handleDownload(data);
    } else {
      if (vs.validate.errors) setErrors(vs.validate.errors);
    }
  };
  return (
    <Button variant="contained" color="primary" onClick={downloadButton}>
      {t('Download')} JSON
    </Button>
  );
};
