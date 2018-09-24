import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { ROUTES } from "../api/strings";
import LoginComponent from "../containers/LoginComponent";
import RegistrationComponent from "../containers/RegistrationComponent";
import LogoutComponent from "../containers/LogoutComponent";
import Header from '../containers/Header';
import Footer from '../components/Footer';
import Products from "../containers/Products";
import ProductInfo from '../containers/ProductInfo';
import ProductAdd from "../containers/ProductAdd";
import Stores from "../containers/Stores";
import StoreInfo from '../containers/StoreInfo';
import StoreAdd from "../containers/StoreAdd";
import MyAccount from "../containers/MyAccount";
import MyOrders from "../components/MyOrders";
import Checkout from "../containers/Checkout";
import Order from "../components/Order";
import OrderDetail from "../containers/OrderDetail";
import About from "../components/About";
import NotFoundPage from "../components/NotFoundPage";

const appRouter = () => (
    <BrowserRouter>
        <div>
            <Header/>
            <Switch>
                <Route path={ROUTES.root} exact={true} component={Products} />
                <Route path={ROUTES.auth.login} exact={true} component={LoginComponent}/>
                <Route path={ROUTES.auth.register} exact={true} component={RegistrationComponent}/>
                <Route path={ROUTES.auth.logout} exact={true} component={LogoutComponent}/>
                <Route path={ROUTES.products.index} exact={true} component={Products} />
                <Route path={ROUTES.products.search} exact={true} component={Products} />
                <Route path={ROUTES.products.show} exact={true} component={ProductInfo} />
                <Route path={ROUTES.products.store} exact={true} component={ProductAdd} />
                <Route path={ROUTES.products.update} exact={true} component={ProductAdd} />
                <Route path={ROUTES.stores.index} exact={true} component={Stores} />
                <Route path={ROUTES.stores.search} exact={true} component={Stores} />
                <Route path={ROUTES.stores.store} exact={true} component={StoreAdd} />
                <Route path={ROUTES.stores.update} exact={true} component={StoreAdd} />
                <Route path={ROUTES.stores.show} exact={true} component={StoreInfo} />
                <Route path={ROUTES.orders.checkout} exact={true} component={Checkout} />
                <Route path={ROUTES.orders.confirmation} exact={true} component={Order}/>
                <Route path={ROUTES.orders.index} exact={true} component={MyOrders}/>
                <Route path={ROUTES.orders.show} exact={true} component={OrderDetail} />
                <Route path={ROUTES.users.show} exact={true} component={MyAccount}/>
                <Route path={ROUTES.about} exact={true} component={About}/>
                <Route component={NotFoundPage} />
            </Switch>
            <Footer/>
        </div>
    </BrowserRouter>
);

export default appRouter;
