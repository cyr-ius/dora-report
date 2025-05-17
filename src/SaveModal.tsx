import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material';
import { useEffect, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from './contexts/DataContext';

interface SaveModalProps {
  open: boolean;
  formType: 'threat' | 'incident';
  onClose: () => void;
}

type SaveEntry = {
  label: string;
  type: 'threat' | 'incident';
  data: Record<string, any>;
};

const SaveModal: FC<SaveModalProps> = ({ open, formType, onClose }) => {
    const {t} = useTranslation()
    const {data} = useData()
    const [saves, setSaves] = useState<Record<string, SaveEntry>>(loadSaves());
    const [label, setLabel] = useState<string>(`${formType}-${new Date().toLocaleString()}`)

    useEffect(()=>{
        if (open)
            setLabel(`${formType}-${new Date().toLocaleString()}`)
    }, [open])

    function loadSaves() {
        return JSON.parse(localStorage.getItem('dora-saves') || '{}');
    }

    const handleSave = (label: string) => {
        const id = crypto.randomUUID();
        const entry: SaveEntry = { label, type: formType, data: data };
        const newSaves = { ...loadSaves(), [id]: entry };
        setSaves(newSaves);
        console.debug(newSaves)
        localStorage.setItem('dora-saves', JSON.stringify(newSaves));       
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth={true}>
        <DialogTitle>{t('Save naming')}</DialogTitle>
        <DialogContent>
            <TextField
            autoFocus
            margin="dense"
            label={t('Label')}
            type="text"
            fullWidth 
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>{t('Cancel')}</Button>
            <Button onClick={() => handleSave(label)}>{t('Save')}</Button>
        </DialogActions>
        </Dialog>
    );
};

export default SaveModal;
