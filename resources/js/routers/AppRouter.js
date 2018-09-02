import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomePage from '../components/HomePage';
import Category from '../components/CategoryBase';
import SubCategory from '../components/SubCategory';
import SearchResultsComponent from '../components/SearchResultsComponent';
import ProductInfo from '../components/ProductInfo';
import StoreInfo from '../components/StoreInfo';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Checkout from "../components/Checkout";
import Order from "../components/Order";
import LoginComponent from "../components/LoginComponent";
import RegistrationComponent from "../components/RegistrationComponent";
import LogoutComponent from "../components/LogoutComponent";
import MyAccount from "../components/MyAccount";
import OrderDetail from "../components/OrderDetail";
import MyOrders from "../components/MyOrders";
import NotFoundPage from "../components/NotFoundPage";
import About from "../components/About";
import People from "../components/People";
import Contact from "../components/Contact";
import Products from "../components/Products";
import Stores from "../components/Stores";
import StoreAdd from "../components/StoreAdd";
import ProductAdd from "../components/ProductAdd";

const appRouter = () => (
    <BrowserRouter>
        <div>
            <Header/>
            <Switch>
                <Route path="/" exact={true} component={Products} />
                <Route path="/products" exact={true} component={Products} />
                <Route path="/products/:q" exact={true} component={Products} />
                <Route path="/product/:id" exact={true} component={ProductInfo} />
                <Route path="/stores" exact={true} component={Stores} />
                <Route path="/stores/:q" exact={true} component={Products} />
                <Route path="/store/add" exact={true} component={StoreAdd} />
                <Route path="/store/:storeId/products/add" exact={true} component={ProductAdd} />
                <Route path="/store/:id" exact={true} component={StoreInfo} />
                <Route path="/checkout" exact={true} component={Checkout} />
                <Route path="/order" exact={true} component={Order}/>
                <Route path="/login" exact={true} component={LoginComponent}/>
                <Route path="/register" exact={true} component={RegistrationComponent}/>
                <Route path="/logout" exact={true} component={LogoutComponent}/>
                <Route path="/myaccount" exact={true} component={MyAccount}/>
                <Route path="/myorders" exact={true} component={MyOrders}/>
                <Route path="/order/:id" exact={true} component={OrderDetail} />
                <Route path="/about" exact={true} component={About}/>
                <Route path="/people" exact={true} component={People}/>
                <Route path="/contact" exact={true} component={Contact}/>
                <Route component={NotFoundPage} />
            </Switch>
            <Footer/>
        </div>
    </BrowserRouter>
);

export default appRouter;
