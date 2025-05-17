import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebug } from './contexts/DebugContext';
import { appVersion } from './utils/version';


export const Footer: FC = () => {
  const { debugMode } = useDebug();
  const { t } = useTranslation();

  return (
    <footer className="App-footer">
      <img src="./logo_covea.png" alt="Logo" className="Branding-logo" />
      <div className="App-version">
        <small>Version: {appVersion}</small>
        {debugMode && <small> - {t('Created by')} Cédric Levasseur</small>}
      </div>
      {/* <LocaleButton /> */}

    </footer>
  );
};
