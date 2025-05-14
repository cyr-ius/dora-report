import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light', // ou 'dark'
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
    components: {
      MuiTextField: {
        defaultProps: {
          variant: 'standard',
          fullWidth: true
        }
      },
      MuiSelect: {
        defaultProps: {
          variant: 'standard',
          fullWidth: true
        }
      },
      MuiFormControl: {
        defaultProps: {
          variant: 'standard',
          fullWidth: true
        }
      }
    },  
})

export default theme