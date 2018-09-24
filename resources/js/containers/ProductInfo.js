import React from "react";
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    Grid,
    Row,
    Col,
    ControlLabel,
    FormGroup,
    FormControl,
    Button
} from "react-bootstrap";
import { loadProductDetails } from "../actions/products";
import { ROUTES } from "../api/strings";
import CartActions from '../components/CartActions';
import InformationPanel from "../components/InformationPanel";
import LoadingScreen from "../components/LoadingScreen";

class ProductInfo extends React.Component {

    state = {
      quantity: 1,
      cartProduct: {}
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id &&
            parseInt(nextProps.match.params.id) == nextProps.match.params.id
        ) {
            this.props.dispatch(loadProductDetails(nextProps.match.params.id));
        }
    }

    componentDidMount() {
        this.props.dispatch(loadProductDetails(this.props.match.params.id));
    }

    handleAddToCart = () => {
        this.setState({
            cartProduct: {
                ...this.props.products.productDetails,
                quantity: this.state.quantity
            }
        });
    }

    handleUnAddedToCart = () => {
        this.setState({ cartProduct: {} });
    }

    onQuantityChange = (e) => {
        let quantity = e.target.value;
        if (quantity < 1000){
            this.setState({ quantity });
        }
    };

    onQuantityBlur = () => {
        if (this.state.quantity.length === 0 ||
            (this.state.quantity.length > 0 && parseInt(this.state.quantity) < 1)
        ) {
            this.setState({ quantity: 1 });
        }
    };

    render() {
        if (this.props.products.productsRequested) {
            return <LoadingScreen/>
        }

        if (this.props.products.productsError) {
            return <InformationPanel
                    panelTitle="Product Not available"
                    informationHeading="You are on the wrong page!"
                    message="Please click on the appropriate product link to view this product."
                    />
        }

        return (
            <Grid>
                <Row>
                    <Col lg={12} md={12}>
                        <div>
                            <h2>{this.props.products.productDetails.name}</h2>
                            <div className="text-gray">
                                <span>Sold by: </span>
                                {this.props.products.productDetails.store &&
                                <Link to={
                                    ROUTES.stores.show
                                        .replace(':storeId', this.props.products.productDetails.store.id)}>
                                    {this.props.products.productDetails.store.name}
                                </Link>}
                            </div>
                            <hr />
                        </div>
                    </Col>
                </Row>

                <br />

                <Row>
                    <Col md={8} sm={12}>
                        <div className={"product-info-left-margin"}>
                            <h2 className="text-2xl">Product Description:</h2>

                            <hr/>

                            <p className="text-xl">
                                {this.props.products.productDetails.description}
                            </p>

                            <br/>

                            <h4>Product specifications</h4>

                            <p>
                                Width: {this.props.products.productDetails.width} {
                                    this.props.products.productDetails.width_unit ?
                                        this.props.products.productDetails.width_unit.abbreviation :
                                        ''}<br/>
                                Height: {this.props.products.productDetails.height} {
                                    this.props.products.productDetails.height_unit ?
                                        this.props.products.productDetails.height_unit.abbreviation :
                                        ''}<br/>
                                Length: {this.props.products.productDetails.length} {
                                    this.props.products.productDetails.length_unit ?
                                        this.props.products.productDetails.length_unit.abbreviation :
                                        ''}<br/>
                                Weight: {this.props.products.productDetails.weight} {
                                    this.props.products.productDetails.weight_unit ?
                                        this.props.products.productDetails.weight_unit.abbreviation :
                                        ''}
                            </p>
                        </div>
                    </Col>

                    <Col md={4} sm={12}>
                        <div className="product-info-price margin-t-m text-right">
                            <span className="text-green text-2xl">
                                {(this.props.products.productDetails.currency ?
                                    this.props.products.productDetails.currency.abbreviation + ' ' :
                                    '') + this.props.products.productDetails.price}
                            </span>
                        </div>

                        <div>
                            <FormGroup
                                controlId="formQuantitySelect"
                                className="quantity-select">
                                <ControlLabel>Quantity</ControlLabel>
                                <FormControl
                                    type="number"
                                    value={this.state.quantity}
                                    onChange={this.onQuantityChange}
                                    onBlur={this.onQuantityBlur}
                                />
                            </FormGroup>

                            <Button
                                bsStyle="primary"
                                className="add-to-cart-product"
                                onClick={this.handleAddToCart}
                            >
                                Add to Cart
                            </Button>
                        </div>
                    </Col>
                </Row>

                <CartActions
                    product={this.state.cartProduct}
                    onUndone={this.handleUnAddedToCart}
                    dispatch={this.props.dispatch}
                />
            </Grid>

        )
    }
}

const mapStateToProps = state => ({
    products: state.products
});

export default connect(mapStateToProps)(ProductInfo);
