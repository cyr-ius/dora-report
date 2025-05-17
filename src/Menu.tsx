import MenuIcon from '@mui/icons-material/Menu';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const MenuDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (

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
                    } }>
                    Incident Report
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        navigate('/threat');
                        handleClose();
                    } }>
                    Threat Report
                </MenuItem>
            </Menu>
        </Box>
    )

}
