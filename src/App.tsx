import React from 'react';
import { Box, CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from './theme';
import Main from './components/Main';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box display='flex' justifyContent='center' alignItems='center'>
        <CssBaseline />
        <Main />
     </Box>
    </ThemeProvider>
  );
}

export default App;
