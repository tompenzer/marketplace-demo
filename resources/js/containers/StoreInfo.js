import React from "react";
import { Grid, Row, Col, Button } from "react-bootstrap";
import { checkStoreAuth, loadStoreDetails } from "../actions/stores";
import { connect } from 'react-redux';
import { ROUTES } from "../api/strings";
import LoadingScreen from "../components/LoadingScreen";
import InformationPanel from "../components/InformationPanel";
import ProductList from '../components/ProductList';
import CartActions from '../components/CartActions';

class StoreInfo extends React.Component {

    state = {
      cartProduct: {}
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.storeId !== nextProps.match.params.storeId) {
            this.props.dispatch(checkStoreAuth(nextProps.match.params.storeId));
            this.props.dispatch(loadStoreDetails(nextProps.match.params.storeId));
        }
    }

    componentDidMount() {
        this.props.dispatch(checkStoreAuth(this.props.match.params.storeId));
        this.props.dispatch(loadStoreDetails(this.props.match.params.storeId));
    }

    // Pass the product added to cart from the ProductList to its sibling
    // component CartActions.
    handleAddToCart = product => {
        this.setState({ cartProduct: product });
    };

    handleUnAddedToCart = () => {
        this.setState({ cartProduct: {} });
    }

    render() {
        if (this.props.stores.storesRequested) {
            return <LoadingScreen/>
        }

        if (this.props.stores.storesError) {
            return <InformationPanel
                panelTitle="Store Not available"
                informationHeading="The requested store was not found."
                message="Something went wrong; not sure how you got here, but that wasn't supposed to happen..."
                />
        }

        let editStore,
            addProduct;

        if (this.props.stores.storeAuth) {
            editStore = (
                <Button
                    bsStyle="info"
                    className="edit-store margin-b-s"
                    onClick={() => (
                        this.props.history.push(
                            ROUTES.stores.update
                                .replace(':storeId', this.props.stores.storeDetails.id)))}>
                    Edit store
                </Button>
            )
            addProduct = (
                <Button
                    bsStyle={"primary"}
                    className={"add-store-product margin-b-s"}
                    onClick={() => (
                        this.props.history.push(
                            ROUTES.products.store
                                .replace(':storeId', this.props.stores.storeDetails.id)))}>
                    Add store product
                </Button>
            )
        }

        return (
            <Grid>
                <Row>
                    <Col lg={12} md={12}>
                        <div className="store-info-left-margin">
                            <h2 className="d-flex">
                                {this.props.stores.storeDetails.name}
                                <span className="margin-l-a">{editStore}</span>
                            </h2>
                            <div className="store-info-seller-name">
                                <span>
                                    {this.props.stores.storeDetails.sellerName}
                                </span>
                            </div>
                            <hr />
                        </div>
                    </Col>
                </Row>

                <br />

                <Row>
                    <Col lg={12} md={12}>
                        <div className={"store-info-left-margin"}>
                            <h3 className={"store-description-heading"}>
                                Store Description:
                            </h3>
                            <hr/>
                            <p className={"store-description"}>
                                {this.props.stores.storeDetails.description}
                            </p>
                        </div>
                    </Col>
                </Row>

                <br />

                <Row>
                    <Col lg={12} md={12}>
                        <h3 className={"store-description-heading"}>
                            Our products:
                        </h3>
                        {addProduct}
                        {this.props.stores.storeDetails.products &&
                        <ProductList
                            products={this.props.stores.storeDetails.products}
                            store={this.props.stores.storeDetails}
                            handleAddToCart={this.handleAddToCart}
                            userHasAuth={this.props.stores.storeAuth}
                            history={this.props.history}/>
                        }
                    </Col>
                </Row>

                <CartActions
                    product={this.state.cartProduct}
                    onUndone={this.handleUnAddedToCart}
                    dispatch={this.props.dispatch}/>
            </Grid>

        )
    }
}

const mapStateToProps = state => ({ stores: state.stores });

export default connect(mapStateToProps)(StoreInfo);
