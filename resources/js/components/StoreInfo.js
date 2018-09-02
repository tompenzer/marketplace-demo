import React from "react";
import {Grid, Row, Col, ControlLabel, FormGroup, FormControl, Button, Glyphicon} from "react-bootstrap";
import {image} from "./image";
import {addToCart, removeFromCart} from "../actions/shoppingCart";
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import axios from "../api/axiosInstance";
import { storeInfoApi, storeAuthApi } from "../api/apiURLs";
import LoadingScreen from "../components/LoadingScreen";
import InformationPanel from "../components/InformationPanel";
import { addToWishlist, removeFromWishlist } from "../actions/wishlist";
import { ADDED_TO_CART_SNACKBAR, ADDED_TO_WISHLIST_SNACKBAR, ACCESS_TOKEN } from "../api/strings";
import Products from '../components/Products';

class StoreInfo extends React.Component {

    state = {
      store: {},
      prevPrice: null,
      quantity: 1,
      storeId: undefined,
      autoHideDuration: 3000,
      snackbarOpen:false,
      isLoading: false,
      storeNotFound: false,
      snackbarMessage: "",
      userHasAuth: false
    };

    loadStoreDetails = (storeId) => {
        this.setState(() => ({ storeId, isLoading: true }));

        axios.get(storeInfoApi(storeId)).then((response) => (this.setState(
            {
                store: response.data,
                isLoading: false,
                storeNotFound: false
            }
        ))).catch((error) => (
            this.setState(() => ({
                isLoading: false,
                storeNotFound: true
            }))
        ));

        // Check if logged in user has authorization to edit store.
        const access_token = window.localStorage.getItem(ACCESS_TOKEN);
        const headers = { Accept: "application/json", Authorization: `Bearer ${access_token}` };
        axios.get(storeAuthApi(storeId), { headers }).then((response) => {
            this.setState({ userHasAuth: response.data } )
        });
    };

    componentWillReceiveProps(nextProps){
        if (this.props.match.params.id !== nextProps.match.params.id) {
            this.loadStoreDetails(nextProps.match.params.id);
        }
    }

    componentDidMount(){
        // load the store details here
        this.loadStoreDetails(this.props.match.params.id);
    }

    render(){
        let addProduct;

        if (this.state.userHasAuth) {
            addProduct = (
                <Button
                    bsStyle={"primary"}
                    className={"add-store-product"}
                    onClick={() => (this.props.history.push(`/store/${this.state.store.id}/products/add`))}
                >
                    Add store product
                </Button>
            )
        }

        if (this.state.isLoading) {
            return <LoadingScreen/>
        } else if (this.state.storeNotFound) {
            return <InformationPanel
                    panelTitle={"Store Not available"}
                    informationHeading={"The requested store was not found."}
                    message={"Something went wrong; not sure how you got here, but that wasn't supposed to happen..."}
                    />
        }

        return (
            <Grid>
                <Row>
                    <Col lg={12} md={12}>
                        <div className={"store-info-left-margin"}>
                            <h2>{this.state.store.name}</h2>
                            <div className={"store-info-seller-name"}>
                                <span>{this.state.store.sellerName}</span>
                            </div>
                            <hr />
                        </div>
                    </Col>
                </Row>

                <br />

                <Row>
                    <Col lg={12} md={12}>
                        <div className={"store-info-left-margin"}>
                            <h3 className={"store-description-heading"}>Store Description:</h3>
                            <hr/>
                            <p className={"store-description"}>{this.state.store.description}</p>
                        </div>
                    </Col>
                </Row>

                <br />

                <Row>
                    <Col lg={12} md={12}>
                        <h3 className={"store-description-heading"}>Our products:</h3>
                        {addProduct}

                    </Col>
                </Row>

                <div>
                    <Snackbar
                        open={this.state.snackbarOpen}
                        message={this.state.snackbarMessage}
                        action="undo"
                        autoHideDuration={this.state.autoHideDuration}
                        onActionClick={this.handleUndoAction}
                        onRequestClose={this.handleSnackbarRequestClose}
                    />
                </div>
            </Grid>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        authentication: state.authentication
    };
};

export default connect(mapStateToProps)(StoreInfo);
