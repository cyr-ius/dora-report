import { Box } from '@mui/material';
import { useMemo, type FC } from 'react';
import { useData } from './contexts/DataContext';
import { useLocale } from './contexts/LocaleContext';
import { useErrors } from './contexts/ErrorContext';


export const DebugMode: FC = () => {
  const { locale } = useLocale();
  const {data} = useData()
  const {errors} = useErrors()
  const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);


  return (
    <Box className="App-debug-pre">
      <small>
        Locale: {locale.toUpperCase()}
        <br />
        Current Errors:
        <br />

        <br />    
        Export JSON:
        <pre id="boundData">{stringifiedData}</pre>
        Errors:
        {JSON.stringify(errors)}
        <br />
      </small>
    </Box>
  );
};
