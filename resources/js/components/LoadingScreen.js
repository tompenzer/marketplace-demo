import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme();

const loadingDivStyle = {
    minHeight: '360px',
    textAlign: 'center'
}

const LoadingScreen = () => (
    <div style={loadingDivStyle}>
        <MuiThemeProvider theme={theme}>
            <CircularProgress size={80} thickness={5} className="margin-t-3xl" />
        </MuiThemeProvider>
    </div>
);

export default LoadingScreen;
