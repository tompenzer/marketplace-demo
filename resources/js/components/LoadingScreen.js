import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme();

const LoadingScreen = () => (
    <div className={"loading-div"}>
        <MuiThemeProvider theme={theme}>
            <CircularProgress size={80} thickness={5} className={"loading-circular-progress"} />
        </MuiThemeProvider>
    </div>
);

export default LoadingScreen;
