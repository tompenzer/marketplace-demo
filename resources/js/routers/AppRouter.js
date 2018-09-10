import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import LoginComponent from "../components/LoginComponent";
import RegistrationComponent from "../components/RegistrationComponent";
import LogoutComponent from "../components/LogoutComponent";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Products from "../components/Products";
import ProductInfo from '../components/ProductInfo';
import ProductAdd from "../components/ProductAdd";
import Stores from "../components/Stores";
import StoreInfo from '../components/StoreInfo';
import StoreAdd from "../components/StoreAdd";
import MyAccount from "../components/MyAccount";
import MyOrders from "../components/MyOrders";
import Checkout from "../components/Checkout";
import Order from "../components/Order";
import OrderDetail from "../components/OrderDetail";
import About from "../components/About";
import NotFoundPage from "../components/NotFoundPage";

const appRouter = () => (
    <BrowserRouter>
        <div>
            <Header/>
            <Switch>
                <Route path="/" exact={true} component={Products} />
                <Route path="/login" exact={true} component={LoginComponent}/>
                <Route path="/register" exact={true} component={RegistrationComponent}/>
                <Route path="/logout" exact={true} component={LogoutComponent}/>
                <Route path="/products" exact={true} component={Products} />
                <Route path="/products/:q" exact={true} component={Products} />
                <Route path="/product/:id" exact={true} component={ProductInfo} />
                <Route path="/stores" exact={true} component={Stores} />
                <Route path="/stores/:q" exact={true} component={Stores} />
                <Route path="/store/add" exact={true} component={StoreAdd} />
                <Route path="/store/:storeId" exact={true} component={StoreInfo} />
                <Route path="/store/:storeId/edit" exact={true} component={StoreAdd} />
                <Route path="/store/:storeId/products/add" exact={true} component={ProductAdd} />
                <Route path="/store/:storeId/product/:productId/edit" exact={true} component={ProductAdd} />
                <Route path="/checkout" exact={true} component={Checkout} />
                <Route path="/order" exact={true} component={Order}/>
                <Route path="/orders" exact={true} component={MyOrders}/>
                <Route path="/order/:orderId" exact={true} component={OrderDetail} />
                <Route path="/account" exact={true} component={MyAccount}/>
                <Route path="/about" exact={true} component={About}/>
                <Route component={NotFoundPage} />
            </Switch>
            <Footer/>
        </div>
    </BrowserRouter>
);

export default appRouter;
