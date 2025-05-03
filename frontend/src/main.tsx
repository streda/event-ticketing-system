import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme.js';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './app/store';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}> 
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>,
  );
} else {
  console.error("Root element not found");
}