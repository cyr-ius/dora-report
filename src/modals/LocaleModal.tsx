import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../contexts/LocaleContext';


interface LocaleModalProps {
  open: boolean;
  onClose: () => void;
}

export const LocaleModal: FC<LocaleModalProps> = ({ open, onClose }) => {
    const {t} = useTranslation()
    const { locale, setLocale } = useLocale();

    return (
        <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth={true}>
            <DialogTitle>{t('Locale')}</DialogTitle>
            <DialogContent>
                <InputLabel id="locale-label">{t("Locale")}</InputLabel>
                <Select
                    labelId="locale-label"
                    value={locale}
                    label={t("Locale")}
                    onChange={e => setLocale(e.target.value as 'en' | 'fr')}>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('Cancel')}</Button>
            </DialogActions>
        </Dialog>
    );
};

