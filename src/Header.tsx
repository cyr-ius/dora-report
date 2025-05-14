import MenuIcon from '@mui/icons-material/Menu';
import { Box, Grid2, IconButton, Menu, MenuItem } from '@mui/material';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebug } from './contexts/DebugContext';

export const Header: FC = () => {
  const { debugMode, toggleDebugMode } = useDebug();
  const { t } = useTranslation();
  const currentPath = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid2 className="App">
      <header className="App-header">
        <Box position="absolute" top={10} left={10}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleClick}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
            <MenuItem
              onClick={() => {
                navigate('/incident');
                handleClose();
              }}>
              Incident Report
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate('/threat');
                handleClose();
              }}>
              Threat Report
            </MenuItem>
          </Menu>
        </Box>
        <img src="./logo.svg" className="App-logo" alt="logo" onClick={toggleDebugMode}/>

        {(currentPath.pathname == '/incident' ||
          currentPath.pathname == '/') && (
          <h1 className="title">{t('DORA Major Incident Report')}</h1>
        )}
        {currentPath.pathname == '/threat' && (
          <h1 className="title">{t('DORA Threat Report')}</h1>
        )}
        <p className="subtitle">European Bankink Authority.</p>
      </header>
      {debugMode && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          Debug mode is <strong>ON</strong>
        </div>
      )}
    </Grid2>
  );
};
