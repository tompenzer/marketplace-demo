import React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { loadProducts } from "../actions/products";
import { connect } from 'react-redux';
import CartActions from '../components/CartActions';
import InformationPanel from "../components/InformationPanel";
import LoadingScreen from "../components/LoadingScreen";
import ProductList from '../components/ProductList';

class Products extends React.Component {

    state = {
      query: '',
      cartProduct: {}
    };

    componentDidMount() {
        let query;

        if (this.props.match && this.props.match.params.q) {
            query = this.props.match.params.q;
        }

        this.props.dispatch(loadProducts(query));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.q !== nextProps.match.params.q) {
            this.props.dispatch(loadProducts(nextProps.match.params.q));
        }
    }

    handleAddToCart = product => {
        this.setState({ cartProduct: product });
    }

    handleUnAddedToCart = () => {
        this.setState({ cartProduct: {} });
    }

    render() {

        if (this.props.products.productsRequested) {
            return (
                <Grid>
                    <Row className="margin-b-m">
                        <Col md={12} sm={12}>
                            <h3 className="text-center">
                                fetching products...
                            </h3>
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
                    panelTitle="There are no products currently available"
                    informationHeading="Something went wrong."
                    message="We were unable to find any products, which wasn't expected. Please try again later in the hopes it's been fixed."
                    />
        }

        return (
            <Grid>
                <Row className="margin-b-m">
                    <Col md={12} sm={12}>
                        <h3 className="text-center">
                            Choose from a selection of products listed below
                        </h3>
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

export default connect(mapStateToProps)(Products);
