import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import 'normalize.css/normalize.css';
import '../sass/app.scss';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { getCart } from "./actions/shoppingCart";
import { imageWatch } from "./components/image";
import axios, { getAuthHeaders } from "./api/axiosInstance";
import { getUserAPI, getUserCartAPI } from "./api/apiURLs";
import { loginUser, logoutUser } from "./actions/authentication";
import { ACCESS_TOKEN } from "./api/strings";

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

store.dispatch(getCart());

// initial load, check if user is logged in
axios.get(getUserAPI, getAuthHeaders())
    .then(() => {
        store.dispatch(loginUser());
    })
    .catch((error) => {
        window.localStorage.removeItem(ACCESS_TOKEN);
        store.dispatch(logoutUser());
    });


const appRoot = document.getElementById('app');
ReactDOM.render(jsx, appRoot);
