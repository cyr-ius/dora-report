import { Grid } from '@mui/material';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useDebug } from './contexts/DebugContext';
import { MenuDropdown } from './Menu';

export const Header: FC = () => {
  const { debugMode, toggleDebugMode } = useDebug();
  const { t } = useTranslation();
  const currentPath = useLocation();

  return (
    <Grid className="App">
      <header className="App-header">
        <MenuDropdown />
        <img src="./logo.svg" className="Header-logo" alt="logo" onClick={toggleDebugMode}/>

        {(currentPath.pathname == '/incident' ||
          currentPath.pathname == '/') && (
          <h1 className="title">{t('DORA Major Incident Report')}</h1>
        )}
        {currentPath.pathname == '/threat' && (
          <h1 className="title">{t('DORA Threat Report')}</h1>
        )}
        <p className="subtitle">{t('European Banking Authority')}</p>
      </header>
      {debugMode && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          Debug mode is <strong>ON</strong>
        </div>
      )}
    </Grid>
  );
};
