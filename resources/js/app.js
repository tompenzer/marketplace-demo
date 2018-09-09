import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import 'normalize.css/normalize.css';
import '../sass/app.scss';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { checkLogin } from "./actions/authentication";
import { getCart } from "./actions/shoppingCart";

const store = configureStore();
// Tell Material-UI the font-size on the html element.
const theme = createMuiTheme({
  typography: {
    htmlFontSize: 10,
  },
});

const App = () => (
    <MuiThemeProvider theme={theme}>
        <AppRouter />
    </MuiThemeProvider>
);

const jsx = (
    <Provider store={store}>
        <App />
    </Provider>
);

// Set auth and cart states upon load.
store.dispatch(checkLogin());
store.dispatch(getCart());

const appRoot = document.getElementById('app');
ReactDOM.render(jsx, appRoot);
