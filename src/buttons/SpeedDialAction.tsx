import { Language, List, Save, Upload } from '@mui/icons-material';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImportModal } from '../modals/ImportModal';
import { LocaleModal } from '../modals/LocaleModal';
import { SaveListModal } from '../modals/SaveListModal';
import SaveModal from '../modals/SaveModal';

type Props = {
    formType: 'threat' | 'incident'
}

export const SpeedDialActions = (props: Props) => {
    const {t} = useTranslation()
    const [localeModalOpen, setLocaleModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [saveListDialogOpen, setSaveListDialogOpen] = useState(false);

    return (
        <>
        <SpeedDial
            ariaLabel="Actions"
            sx={{ position: 'fixed', bottom: 16, right: 16, color: 'pink' }}
            icon={<SpeedDialIcon />}
            FabProps={{
                size:"medium",
                sx: {bgcolor: '#122147', color: '#fff', '&:hover': {bgcolor: '#00000061'}}
            }}
        >
            <SpeedDialAction
            icon={<Language />}
            onClick={() => setLocaleModalOpen(true)}
            slotProps={{
                tooltip:{title:t('Locale')}
            }}            
            />
            <SpeedDialAction
            icon={<Upload />}
            onClick={() => setImportModalOpen(true)}
            slotProps={{
                tooltip:{title:t('JSON Import')}
            }}
            />
            <SpeedDialAction
            icon={<Save />}
            onClick={() => setSaveDialogOpen(true)}
            slotProps={{
                tooltip:{title:t('Save')}
            }}          
            />
            <SpeedDialAction
            icon={<List />}
            onClick={() => setSaveListDialogOpen(true)}
            slotProps={{
                tooltip:{title:t('View saves')}
            }}          
            />
        </SpeedDial>
        <ImportModal open={importModalOpen} onClose={() => setImportModalOpen(false)}/>
        <SaveListModal formType={props.formType} open={saveListDialogOpen} onClose={() => setSaveListDialogOpen(false)} />
        <LocaleModal open={localeModalOpen} onClose={() => setLocaleModalOpen(false)}/>       
        <SaveModal formType={props.formType} open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} />
        </>
    );
};
