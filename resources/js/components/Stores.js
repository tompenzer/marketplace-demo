import React from "react";
import { Link, withRouter } from 'react-router-dom';
import {Grid, Row, Col, ControlLabel, FormGroup, FormControl, Button, Glyphicon} from "react-bootstrap";
import {image} from "./image";
import {addToCart, removeFromCart} from "../actions/shoppingCart";
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
import { storesApi } from "../api/apiURLs";
import LoadingScreen from "../components/LoadingScreen";
import InformationPanel from "../components/InformationPanel";
import {addToWishlist, removeFromWishlist} from "../actions/wishlist";
import {ADDED_TO_CART_SNACKBAR, ADDED_TO_WISHLIST_SNACKBAR} from "../api/strings";

class Stores extends React.Component {

    state = {
      stores: [],
      autoHideDuration: 3000,
      isLoading: false,
      storesNotFound: false,
      snackbarOpen: false,
      snackbarMessage: ''
    };

    loadStores(query) {
        this.setState(() => ({ isLoading: true }));

        let options = {};

        if (query) {
            options.params = { q: query };
        }

        // Fetch the stores.
        axios.get(storesApi, options).then((response) => (this.setState(
            {
                stores: response.data.data,
                isLoading: false,
                storesNotFound: false
            }
        ))).catch((error) => (
            this.setState(() => ({
                isLoading: false,
                storesNotFound: true
            }))
        ));
    }

    componentDidMount(){
        this.loadStores(this.props.match.params.q);
    }

    componentWillReceiveProps(nextProps){
        if(this.props.match.params.q !== nextProps.match.params.q){
            this.loadStores(nextProps.match.params.q);
        }
    }

    addToCartOnClick = (product) => {
        // dispatching an action to redux store
        this.props.dispatch(addToCart(product));
        this.setState(() => ({snackbarOpen: true, snackbarMessage: ADDED_TO_CART_SNACKBAR}))
    };

    handleSnackbarRequestClose = () => {
        this.setState({
            snackbarOpen: false,
        });
    };

    static removeItemFromCart = (productID, props) => {
        let productToRemove = {
            productID
        };
        props.dispatch(removeFromCart(productToRemove));
    };

    handleUndoAction = () => {
        if(this.state.snackbarMessage === ADDED_TO_CART_SNACKBAR){
            ProductInfo.removeItemFromCart(this.state.productID, this.props);
        }
        else{
            this.props.dispatch(removeFromWishlist(this.state.productID));
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
            productID: this.state.productID,
            prevPrice: this.state.product.originalPrice
        };
        this.props.dispatch(addToWishlist(product));
        this.setState(() => ({snackbarOpen: true, snackbarMessage: ADDED_TO_WISHLIST_SNACKBAR}));
    };

    render(){

        if(this.state.isLoading){
            return (
                <Grid>
                    <Row className="margin-b-m">
                        <Col md={12} sm={12}>
                            <h2 className="text-center">retrieving stores...</h2>
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

        else if(this.state.storesNotFound){
            return <InformationPanel
                    panelTitle={"There are no stores currently available"}
                    informationHeading={"Something went wrong."}
                    message={"We were unable to find any stores, which wasn't expected. Please try again later in the hopes it's been fixed."}
                    />
        }

        return (
            <Grid>
                <Row className="margin-b-m">
                    <Col md={12} sm={12}>
                        <h2 className="text-center">Choose from a selection of stores listed below</h2>
                    </Col>
                </Row>

                <Row>
                    <Col md={12} sm={12}>
                        <Paper>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Store name</TableCell>
                                        <TableCell>Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.stores.map(item => {
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell component="th" scope="row">{item.name}</TableCell>
                                                <TableCell>{item.description}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Col>
                </Row>

                <Snackbar
                    open={this.state.snackbarOpen}
                    message={this.state.snackbarMessage}
                    action="undo"
                    autoHideDuration={this.state.autoHideDuration}
                    onActionClick={this.handleUndoAction}
                    onRequestClose={this.handleSnackbarRequestClose}
                />
            </Grid>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authentication: state.authentication
    };
};

export default connect(mapStateToProps)(Stores);
