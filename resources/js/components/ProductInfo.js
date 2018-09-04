import React from "react";
import { Link, withRouter } from 'react-router-dom';
import { Grid, Row, Col, ControlLabel, FormGroup, FormControl, Button, Glyphicon } from "react-bootstrap";
import { addToCart, removeFromCart } from "../actions/shoppingCart";
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import axios from "../api/axiosInstance";
import { productInfoAPI, unitsApi, currenciesApi } from "../api/apiURLs";
import LoadingScreen from "../components/LoadingScreen";
import InformationPanel from "../components/InformationPanel";
import { addToWishlist, removeFromWishlist } from "../actions/wishlist";
import { ADDED_TO_CART_SNACKBAR, ADDED_TO_WISHLIST_SNACKBAR } from "../api/strings";

class ProductInfo extends React.Component {

    state = {
      product: {
          store: {},
          currency: {}
      },
      unitsDimension: {},
      unitsWeight: {},
      currencies: {},
      quantity: 1,
      productId: undefined,
      autoHideDuration: 3000,
      snackbarOpen:false,
      isLoading: false,
      productNotFound: false,
      snackbarMessage: ""
    };

    loadProductDetails = (productId) => {
        this.setState(() => ({ productId, isLoading: true }));

        axios.get(productInfoAPI(productId)).then((response) => (
            this.setState({
                product: response.data,
                isLoading: false,
                productNotFound: false
            })
        )).catch((error) => (
            this.setState(() => ({
                isLoading: false,
                productNotFound: true
            }))
        ));
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id) {
            this.loadProductDetails(nextProps.match.params.id);
        }
    }

    componentDidMount() {
        // load the product details here
        this.loadProductDetails(this.props.match.params.id);

        this.fillUnits();
        this.fillCurrencies();
    }

    fillUnits() {
        // Make an object of unit abbreviations keyed to their IDs.
        axios.get(unitsApi).then((response) => {
            let unitsDimension = {},
                unitsWeight = {};

            for (let unit of response.data) {
                switch (unit.type.name) {
                    case 'dimension':
                        unitsDimension[unit.id] = unit.abbreviation;
                        break;
                    case 'weight':
                        unitsWeight[unit.id] = unit.abbreviation;
                        break;
                }
            }

            this.setState({ unitsDimension, unitsWeight });
        });
    }

    fillCurrencies() {
        // Make an object of currency abbreviations keyed to their IDs.
        axios.get(currenciesApi).then((response) => {
            let currencies = {};

            for (let currency of response.data) {
                currencies[currency.id] = currency.abbreviation;
            }

            this.setState({ currencies: currencies });
        });
    }

    addToCartOnClick = () => {
        // dispatching an action to redux store
        this.props.dispatch(addToCart({
            productId: this.state.product.id,
            name: this.state.product.name,
            quantity: this.state.quantity,
            price: this.state.product.price,
            currency: this.state.product.currency.abbreviation
        }));
        this.setState(() => ({
            snackbarOpen: true,
            snackbarMessage: ADDED_TO_CART_SNACKBAR
        }))
    };

    onQuantityChange = (e) => {
        let quantity = e.target.value;
        if (quantity.length < 3){
            this.setState(() => ({ quantity }));
        }
    };

    onQuantityBlur = () => {
        if(this.state.quantity.length === 0 || (this.state.quantity.length > 0 && parseInt(this.state.quantity) < 1)){
            this.setState(() => ({ quantity: 1 }))
        }
    };

    handleSnackbarRequestClose = () => {
        this.setState({
            snackbarOpen: false,
        });
    };

    static removeItemFromCart = (productId, props) => {
        props.dispatch(removeFromCart({ productId }));
    };

    handleUndoAction = () => {
        if(this.state.snackbarMessage === ADDED_TO_CART_SNACKBAR){
            ProductInfo.removeItemFromCart(this.state.productId, this.props);
        }
        else{
            this.props.dispatch(removeFromWishlist(this.state.productId));
        }
        this.handleSnackbarRequestClose();
    };

    handleAddToWishlist = () => {
        const product = {
            productName: this.state.product.name,
            productImage: this.state.product.image,
            sellerName: this.state.product.sellerName,
            quantity: this.state.quantity,
            price: this.state.product.price,
            productId: this.state.productId,
            prevPrice: this.state.product.originalPrice
        };
        this.props.dispatch(addToWishlist(product));
        this.setState(() => ({ snackbarOpen: true, snackbarMessage: ADDED_TO_WISHLIST_SNACKBAR }));
    };

    render() {

        if(this.state.isLoading){
            return <LoadingScreen/>
        }
        else if(this.state.productNotFound){
            return <InformationPanel
                    panelTitle={"Product Not available"}
                    informationHeading={"You are on the wrong page!"}
                    message={"Please click on the appropriate product link to view this product."}
                    />
        }

        return (
            <Grid>
                <Row>
                    <Col lg={12} md={12}>
                        <div className={"margin-div-five"}>
                            <h2>{this.state.product.name}</h2>
                            <div className={"product-info-seller-name"}>
                                <span>Sold by: </span>
                                <Link to={'/store/' + this.state.product.store.id}>{this.state.product.store.name}</Link>
                            </div>
                            <hr />
                        </div>
                    </Col>
                </Row>

                <br />

                <Row>
                    <Col md={8} sm={12}>
                        <div className={"product-info-left-margin"}>
                            <h2 className={"product-description-heading"}>Product Description:</h2>

                            <hr/>

                            <p className={"product-description"}>{this.state.product.description}</p>

                            <br/>

                            <h4>Product specifications</h4>

                            <p>
                                Width: {this.state.product.width} {this.state.unitsDimension[this.state.product.width_unit_id]}<br/>
                                Height: {this.state.product.height} {this.state.unitsDimension[this.state.product.height_unit_id]}<br/>
                                Length: {this.state.product.length} {this.state.unitsDimension[this.state.product.length_unit_id]}<br/>
                                Weight: {this.state.product.weight} {this.state.unitsWeight[this.state.product.weight_unit_id]}
                            </p>
                        </div>
                    </Col>

                    <Col md={4} sm={12}>
                        <div className={"product-info-price margin-t-m text-right"}>
                            <span className={"product-deal-price"}>{this.state.product.currency.abbreviation} {this.state.product.price}</span>
                        </div>

                        {this.props.authentication.isAuthenticated &&
                            <div>
                                <FormGroup controlId="formQuantitySelect" className={"quantity-select"}>
                                    <ControlLabel>Quantity</ControlLabel>
                                    <FormControl
                                        type="number"
                                        value={this.state.quantity}
                                        onChange={this.onQuantityChange}
                                        onBlur={this.onQuantityBlur}
                                    />
                                </FormGroup>

                                <Button
                                    bsStyle={"primary"}
                                    className={"add-to-cart-product"}
                                    onClick={this.addToCartOnClick}
                                >Add to Cart
                                </Button>
                            </div>
                        }
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

export default connect(mapStateToProps)(ProductInfo);
