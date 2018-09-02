import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import 'normalize.css/normalize.css';
import '../sass/app.scss';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {addToCart, addToCartHelper} from "./actions/shoppingCart";
import {imageWatch} from "./components/image";
import axios from "./api/axiosInstance";
import {getUserAPI, getUserCartAPI} from "./api/apiURLs";
import {loginUser, logoutUser} from "./actions/authentication";
import {ACCESS_TOKEN} from "./api/strings";

const store = configureStore();
const theme = createMuiTheme({
  typography: {
    // Tell Material-UI what's the font-size on the html element is.
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

const product = {
    productName: "Product Name",
    productDescription: "Product Description",
    sellerName: "Seller Name",
    quantity: 1,
    price: 19.99,
    productID: 1
};

// initial load, check if user is logged in
// const access_token = window.localStorage.getItem(ACCESS_TOKEN);
// const headers = {Accept: "application/json", Authorization: `Bearer ${access_token}`};
// axios.get(getUserCartAPI, {headers})
//     .then((response) => {
//         store.dispatch(loginUser());
//         response.data.map((item) => {
//             store.dispatch(addToCartHelper(item));
//         })
//     })
//     .catch((error) => {
//         window.localStorage.removeItem(ACCESS_TOKEN);
//         store.dispatch(logoutUser());
//     });

const appRoot = document.getElementById('app');
ReactDOM.render(jsx, appRoot);
