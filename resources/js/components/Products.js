import React from "react";
import { Link, withRouter } from 'react-router-dom';
import { Grid, Row, Col, ControlLabel, FormGroup, FormControl, Button, Glyphicon } from "react-bootstrap";
import { addToCart, removeFromCart } from "../actions/shoppingCart";
import { loadProducts } from "../actions/products";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import axios from "../api/axiosInstance";
import { productsApi } from "../api/apiURLs";
import LoadingScreen from "../components/LoadingScreen";
import InformationPanel from "../components/InformationPanel";
import { ADDED_TO_CART_SNACKBAR } from "../api/strings";
import ProductList from './ProductList';

class Products extends React.Component {

    state = {
      query: "",
      storeId: null,
      autoHideDuration: 3000,
      snackbarOpen: false,
      snackbarMessage: "",
      cartProductId: null
    };

    loadProducts(query) {
        this.setState(() => ({ isLoading: true }));

        let options = {};

        if (query) {
            options.params = { q: query };
        }

        // Fetch the products.
        axios.get(productsApi, options).then((response) => (this.setState(
            {
                products: response.data.data,
                isLoading: false,
                productsNotFound: false
            }
        ))).catch((error) => (
            this.setState({
                isLoading: false,
                productsNotFound: true
            })
        ));
    }

    componentDidMount() {
        let query;

        if (this.props.match && this.props.match.params.q) {
            query = this.props.match.params.q;
        }

        this.props.dispatch(loadProducts(query));
    }

    componentWillReceiveProps(nextProps){
        if (this.props.match.params.q !== nextProps.match.params.q) {
            this.props.dispatch(loadProducts(nextProps.match.params.q));
        }
    }

    handleAddToCart = (product) => {
        // dispatching an action to redux store
        this.props.dispatch(addToCart(product));

        this.setState({
            snackbarOpen: true,
            snackbarMessage: ADDED_TO_CART_SNACKBAR,
            cartProductId: product.productId
        });
    };

    handleSnackbarRequestClose = () => {
        this.setState({
            snackbarOpen: false,
            cartProductId: null
        });
    };

    handleUndoAction = () => {
        if (this.state.snackbarMessage === ADDED_TO_CART_SNACKBAR &&
            parseInt(this.state.cartProductId) == this.state.cartProductId
        ) {
            this.props.dispatch(removeFromCart({ productId: this.state.cartProductId }));
        }

        this.handleSnackbarRequestClose();
    };

    render() {

        if (this.props.products.productsRequested) {
            return (
                <Grid>
                    <Row className="margin-b-m">
                        <Col md={12} sm={12}>
                            <h3 className="text-center">fetching products...</h3>
                        </Col>
                    </Row>

                    <Row className="margin-b-m">
                        <Col md={12} sm={12}>
                            <LoadingScreen/>
                        </Col>
                    </Row>
                </Grid>
            )
        }

        if (this.props.products.productsError) {
            return <InformationPanel
                    panelTitle={"There are no products currently available"}
                    informationHeading={"Something went wrong."}
                    message={"We were unable to find any products, which wasn't expected. Please try again later in the hopes it's been fixed."}
                    />
        }

        return (
            <Grid>
                <Row className="margin-b-m">
                    <Col md={12} sm={12}>
                        <h3 className="text-center">Choose from a selection of products listed below</h3>
                    </Col>
                </Row>

                <Row>
                    <Col md={12} sm={12}>
                        <ProductList
                            products={this.props.products.products}
                            handleAddToCart={this.handleAddToCart}
                        />
                    </Col>
                </Row>

                <Snackbar
                    open={this.state.snackbarOpen}
                    message={this.state.snackbarMessage}
                    action="undo"
                    autoHideDuration={this.state.autoHideDuration}
                    onClick={this.handleUndoAction}
                    onClose={this.handleSnackbarRequestClose}
                />
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    products: state.products
});

export default connect(mapStateToProps)(Products);
