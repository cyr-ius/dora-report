import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useLocale } from '../contexts/LocaleContext';
import type { FC } from 'react';

export const LocaleButton: FC = () => {
  const { locale, setLocale } = useLocale();
  const {t} = useTranslation()
  
  return (
    <Box className="App-language">
      <FormControl size="small">
        <InputLabel id="locale-label">{t("Locale")}</InputLabel>
        <Select
          labelId="locale-label"
          value={locale}
          label={t("Locale")}
          onChange={e => setLocale(e.target.value as 'en' | 'fr')}>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="fr">Français</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
