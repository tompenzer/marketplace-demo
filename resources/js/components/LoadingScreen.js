import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const loadingDivStyle = {
    minHeight: '360px',
    textAlign: 'center'
}

const LoadingScreen = () => (
    <div style={loadingDivStyle}>
        <CircularProgress size={80} thickness={5} className="margin-t-3xl" />
    </div>
);

export default LoadingScreen;
