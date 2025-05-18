import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Input
} from '@mui/material';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '../contexts/DataContext';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
}

export const ImportModal: FC<ImportModalProps> = ({ open, onClose }) => {
    const {t} = useTranslation()
    const { setData } = useData();

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
        try {
            const content = JSON.parse(reader.result as string);
            setData(content);
            onClose();
        } catch (e) {
            alert(t('Invalid JSON File'));
        }
        };
        reader.readAsText(file);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth={true}>
            <DialogTitle>{t('JSON Import')}</DialogTitle>
            <DialogContent>
                <Input type="file" inputProps={{accept:".json"}} onChange={handleImport} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('Cancel')}</Button>
            </DialogActions>
        </Dialog>
    );
};

