import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import { checkLogin } from "./actions/authentication";
import { getCart } from "./actions/shoppingCart";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import styleVariables from '../sass/base/_variables.scss';

import 'normalize.css/normalize.css';
import '../sass/app.scss';

const store = configureStore();

// Tell Material-UI the font-size on the html element.
const theme = createMuiTheme({
    typography: {
        fontFamily: styleVariables.fontFamilyBase,
        htmlFontSize: 10
    }
});

ReactDOM.render((
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <AppRouter />
            </MuiThemeProvider>
        </Provider>
    ), document.getElementById('app'));

// Set auth and cart states upon load.
store.dispatch(checkLogin());
store.dispatch(getCart());
