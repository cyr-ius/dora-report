import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useMemo, type FC } from "react";
import { useTranslation } from "react-i18next";
import { useDebug } from "../contexts/DebugContext";

interface LocaleModalProps {
  open: boolean;
  onClose: () => void;
}

export const LocaleModal: FC<LocaleModalProps> = ({ open, onClose }) => {
  const { t, i18n } = useTranslation();
  const { debugMode } = useDebug();

  const supportedLngs = useMemo(() => {
    const langs = Array.isArray(i18n.options.supportedLngs)
      ? i18n.options.supportedLngs
      : ["en"];
    return debugMode ? langs : langs.filter((lng: string) => lng !== "cimode");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debugMode]);

  useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"sm"} fullWidth={true}>
      <DialogTitle>{t("Locale")}</DialogTitle>
      <DialogContent>
        <InputLabel id="locale-label">{t("Locale")}</InputLabel>
        <Select
          labelId="locale-label"
          value={i18n.language}
          label={t("Locale")}
          onChange={(e) => i18n.changeLanguage(e.target.value as "en" | "fr")}
        >
          {supportedLngs.map((lang: any) => (
            <MenuItem key={lang} value={lang}>
              {t(`locales.${lang}`, t(lang))}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("Cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
};
