import React from 'react';
import {
    Button,
    Grid,
    Row,
    Col,
    ControlLabel,
    FormGroup,
    FormControl,
    Panel
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { loadProductDetails, saveProduct } from "../actions/products";
import { checkStoreAuth } from "../actions/stores";
import { getCurrencies, getUnits } from "../actions/utilities";
import { ROUTES } from "../api/strings";
import LoadingScreen from "../components/LoadingScreen";

const s = "success";

class ProductAdd extends React.Component {

    state = {
        storeId: null,
        productId: null,
        productNotFound: null,
        productNameValidation: null,
        productName: '',
        descriptionValidation: null,
        description: '',
        widthValidation: null,
        width: '',
        widthUnitId: '1',
        heightValidation: null,
        height: '',
        heightUnitId: '1',
        lengthValidation: null,
        length: '',
        lengthUnitId: '1',
        weightValidation: null,
        weight: '',
        weightUnitId: '6',
        priceValidation: null,
        price: '',
        currencyId: '1'
    };

    // Require auth to create a product - redirect to login if unauthorized.
    componentDidMount() {
        // Require auth to add/edit stores.
        if (this.props.authentication.isAuthenticated === false) {
            this.props.history.push(ROUTES.auth.login);
        }

        // If passed a storeId prop, and it's an integer (as opposed to the word
        // "add" from the shared create route), pre-fill the data and we'll do a
        // store update rather than adding a new store.
        if (this.props.match &&
            this.props.match.params.storeId &&
            parseInt(this.props.match.params.storeId) == this.props.match.params.storeId
        ) {
            this.setState({ storeId: this.props.match.params.storeId });
            this.props.dispatch(checkStoreAuth(this.props.match.params.storeId));
        }

        // If passed a product prop, pre-fill the data and we'll do a product
        // update rather than adding a new product.
        if (this.props.match &&
            this.props.match.params.productId &&
            parseInt(this.props.match.params.productId) == this.props.match.params.productId
        ) {
            this.setState({ productId: this.props.match.params.productId });
            this.props.dispatch(loadProductDetails(this.props.match.params.productId));
        }

        this.props.dispatch(getCurrencies());
        this.props.dispatch(getUnits());
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.storeId !== nextProps.match.params.storeId &&
            parseInt(nextProps.match.params.storeId) == nextProps.match.params.storeId
        ) {
            this.setState({ storeId: nextProps.match.params.storeId });
            this.props.dispatch(checkStoreAuth(nextProps.match.params.storeId));
        }

        if (this.props.match.params.productId !== nextProps.match.params.productId &&
            parseInt(nextProps.match.params.productId) == nextProps.match.params.productId
        ) {
            this.setState({ productId: nextProps.match.params.productId });
            this.props.dispatch(loadProductDetails(nextProps.match.params.productId));
        }

        if (nextProps.products.productDetails.id &&
            this.props.products.productDetails !== nextProps.products.productDetails
        ) {
            this.updateProductInfo(nextProps.products.productDetails);
        }

        // If a product has been created/updated, redirect to it.
        if (this.props.products.productCreated !== nextProps.products.productCreated &&
            parseInt(nextProps.products.productCreated) == nextProps.products.productCreated
        ) {
            this.props.history.push(
                ROUTES.products.show
                    .replace(':id', nextProps.products.productCreated)
            );
        }

        // Require auth; redirect to login if the auth check comes back negative.
        if (this.props.authentication.isAuthenticated !== nextProps.authentication.isAuthenticated &&
            nextProps.authentication.isAuthenticated === false
        ) {
            this.props.history.push(ROUTES.auth.login);
        }

        // Require store auth; redirect to login if the store auth check comes
        // back negative.
        if (this.props.stores.storeAuth !== nextProps.stores.storeAuth &&
            nextProps.stores.storeAuth === false
        ) {
            this.props.history.push(ROUTES.auth.login);
        }
    }

    updateProductInfo = product => {
        this.setState({
            productId: product.id,
            productName: product.name,
            productNameValidation: s,
            description: product.description,
            descriptionValidation: s,
            width: product.width,
            widthValidation: s,
            widthUnitId: product.width_unit_id,
            height: product.height,
            heightValidation: s,
            heightUnitId: product.height_unit_id,
            length: product.length,
            lengthValidation: s,
            lengthUnitId: product.length_unit_id,
            weight: product.weight,
            weightValidation: s,
            weightUnitId: product.weight_unit_id,
            price: product.price,
            priceValidation: s,
            currencyId: product.currency_id,
        });
    };

    handleNameChange = e => {
        const productName = e.target.value;
        let status = 'error';

        if (productName.length > 0 && productName.length < 255) {
            status = s;
        }

        this.setState({ productName, productNameValidation: status });
    };

    handleDescriptionChange = e => {
        const description = e.target.value;
        let status = 'error';

        if (description.length > 0) {
            status = s;
        }

        this.setState({ description, descriptionValidation: status });
    };

    handleWidthChange = e => {
        const width = e.target.value;
        let status = 'error';

        if (width.length > 0 && parseFloat(width) == width) {
            status = s;
        }

        this.setState({ width, widthValidation: status });
    };

    handleWidthUnitChange = e => {
        const widthUnitId = e.target.value;

        if (this.props.utilities.units.dimension[widthUnitId]) {
            this.setState({ widthUnitId });
        }
    };

    handleHeightChange = e => {
        const height = e.target.value;
        let status = 'error';

        if (parseFloat(height) == height) {
            status = s;
        }

        this.setState({ height, heightValidation: status });
    };

    handleHeightUnitChange = e => {
        const heightUnitId = e.target.value;

        if (this.props.utilities.units.dimension[heightUnitId]) {
            this.setState({ heightUnitId });
        }
    };

    handleLengthChange = e => {
        const length = e.target.value;
        let status = 'error';

        if (parseFloat(length) == length) {
            status = s;
        }

        this.setState({ length, lengthValidation: status });
    };

    handleLengthUnitChange = e => {
        const lengthUnitId = e.target.value;

        if (this.props.utilities.units.dimension[lengthUnitId]) {
            this.setState({ lengthUnitId });
        }
    };

    handleWeightChange = e => {
        const weight = e.target.value;
        let status = 'error';

        if (parseFloat(weight) == weight) {
            status = s;
        }

        this.setState({ weight, weightValidation: status });
    };

    handleWeightUnitChange = e => {
        const weightUnitId = e.target.value;

        if (this.props.utilities.units.weight[weightUnitId]) {
            this.setState({ weightUnitId });
        }
    };

    handlePriceChange = e => {
        const price = e.target.value;
        let status = 'error';

        if (parseFloat(price) == price) {
            status = s;
        }

        this.setState({ price, priceValidation: status });
    };

    handleCurrencyChange = e => {
        const currencyId = e.target.value;

        if (this.props.utilities.currencies[currencyId]) {
            this.setState({ currencyId });
        }
    };

    handleSubmit = e => {
        e.preventDefault();

        const product = {
            store_id: this.state.storeId,
            name: this.state.productName,
            description: this.state.description,
            width: this.state.width,
            width_unit_id: this.state.widthUnitId,
            height: this.state.height,
            height_unit_id: this.state.heightUnitId,
            length: this.state.length,
            length_unit_id: this.state.lengthUnitId,
            weight: this.state.weight,
            weight_unit_id: this.state.weightUnitId,
            price: this.state.price,
            currency_id: this.state.currencyId
        };

        if (parseInt(this.state.productId) == this.state.productId) {
            product.id = this.state.productId;
        }

        this.props.dispatch(saveProduct(product));
    };

    dimensionUnitOptions = keyId => {
        return Object.keys(this.props.utilities.units.dimension)
            .map(key => (
                <option
                    key={keyId + '-' + key}
                    value={key}>
                    {this.props.utilities.units.dimension[key]}
                </option>
            ));
    }

    render() {
        if (this.props.products.productsRequested ||
            this.props.utilities.unitsRequested ||
            this.props.utilities.currenciesRequested ||
            ! this.props.utilities.units.dimension ||
            ! this.props.utilities.currencies[1]
        ) {
            return <LoadingScreen/>
        }

        if (this.props.products.productCreateErrors.length) {
            errors = (
                <Panel bsStyle="danger">
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">
                            Error adding product
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <ul>
                            {this.props.products.productCreateErrors.map(item => (
                                item.map((error, k) => (
                                    <li key={k}>{error}</li>
                                ))
                            ))}
                        </ul>
                    </Panel.Body>
                </Panel>
            );
        }

        let addOrEdit = 'Add',
            errors = '';

        if (this.state.productId) {
            addOrEdit = 'Edit';
        }

        return (
            <Grid>
                <Row>
                    <Col mdOffset={2} lgOffset={2} lg={7} md={7}>
                        <h3 className="text-center">{addOrEdit} a product</h3>
                        {errors}
                        <form onSubmit={this.handleSubmit}>

                            <FormGroup
                                controlId="formProductName"
                                validationState={this.state.productNameValidation}
                            >
                                <ControlLabel>Product name</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.productName}
                                    placeholder="Product name"
                                    onChange={this.handleNameChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>

                            <FormGroup
                                controlId="formDescription"
                                validationState={this.state.descriptionValidation}
                            >
                                <ControlLabel>Product description</ControlLabel>
                                <FormControl
                                    componentClass="textarea"
                                    value={this.state.description}
                                    placeholder="A description of the product."
                                    onChange={this.handleDescriptionChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>

                            <Row>
                                <Col sm={8} md={8}>
                                    <FormGroup
                                        controlId="formWidth"
                                        validationState={this.state.widthValidation}
                                    >
                                        <ControlLabel>Product width</ControlLabel>
                                        <FormControl
                                            type="number"
                                            step={0.01}
                                            value={this.state.width}
                                            placeholder="The width of the item"
                                            onChange={this.handleWidthChange}
                                        />
                                        <FormControl.Feedback />
                                    </FormGroup>
                                </Col>
                                <Col sm={4} md={4}>
                                    <FormGroup controlId="formWidthUnit">
                                        <ControlLabel>Width units</ControlLabel>
                                        <FormControl
                                            componentClass="select"
                                            onChange={this.handleWidthUnitChange}
                                        >
                                            {this.dimensionUnitOptions('width')}
                                        </FormControl>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={8} md={8}>
                                    <FormGroup
                                        controlId="formHeight"
                                        validationState={this.state.heightValidation}
                                    >
                                        <ControlLabel>Product height</ControlLabel>
                                        <FormControl
                                            type="number"
                                            step={0.01}
                                            value={this.state.height}
                                            placeholder="The height of the item"
                                            onChange={this.handleHeightChange}
                                        />
                                        <FormControl.Feedback />
                                    </FormGroup>
                                </Col>
                                <Col sm={4} md={4}>
                                    <FormGroup controlId="formHeightUnit">
                                        <ControlLabel>Height units</ControlLabel>
                                        <FormControl
                                            componentClass="select"
                                            onChange={this.handleHeightUnitChange}
                                        >
                                            {this.dimensionUnitOptions('height')}
                                        </FormControl>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={8} md={8}>
                                    <FormGroup
                                        controlId="formLength"
                                        validationState={this.state.lengthValidation}
                                    >
                                        <ControlLabel>Product length</ControlLabel>
                                        <FormControl
                                            type="number"
                                            step={0.01}
                                            value={this.state.length}
                                            placeholder="The length of the item"
                                            onChange={this.handleLengthChange}
                                        />
                                        <FormControl.Feedback />
                                    </FormGroup>
                                </Col>
                                <Col sm={4} md={4}>
                                    <FormGroup controlId="formLengthUnit">
                                        <ControlLabel>Length units</ControlLabel>
                                        <FormControl
                                            componentClass="select"
                                            onChange={this.handleLengthUnitChange}
                                        >
                                            {this.dimensionUnitOptions('length')}
                                        </FormControl>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={8} md={8}>
                                    <FormGroup
                                        controlId="formWeight"
                                        validationState={this.state.weightValidation}
                                    >
                                        <ControlLabel>Product weight</ControlLabel>
                                        <FormControl
                                            type="number"
                                            step={0.01}
                                            value={this.state.weight}
                                            placeholder="The weight of the item"
                                            onChange={this.handleWeightChange}
                                        />
                                        <FormControl.Feedback />
                                    </FormGroup>
                                </Col>
                                <Col sm={4} md={4}>
                                    <FormGroup controlId="formWeightUnit">
                                        <ControlLabel>Weight units</ControlLabel>
                                        <FormControl
                                            componentClass="select"
                                            onChange={this.handleWeightUnitChange}
                                        >
                                            {Object.keys(this.props.utilities.units.weight)
                                                .map(key => (
                                                    <option
                                                        key={'weight-' + key}
                                                        value={key}>
                                                        {this.props.utilities.units.weight[key]}
                                                    </option>
                                                ))}
                                        </FormControl>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={8} md={8}>
                                    <FormGroup
                                        controlId="formPrice"
                                        validationState={this.state.priceValidation}
                                    >
                                        <ControlLabel>Product price</ControlLabel>
                                        <FormControl
                                            type="number"
                                            step={0.01}
                                            value={this.state.price}
                                            placeholder="The price of the item"
                                            onChange={this.handlePriceChange}
                                        />
                                        <FormControl.Feedback />
                                    </FormGroup>
                                </Col>
                                <Col sm={4} md={4}>
                                    <FormGroup controlId="formPriceUnit">
                                        <ControlLabel>Currency</ControlLabel>
                                        <FormControl
                                            componentClass="select"
                                            onChange={this.handleCurrencyChange}
                                        >
                                            {Object.keys(this.props.utilities.currencies)
                                                .map(key => (
                                                    <option
                                                        key={'curr-' + key}
                                                        value={key}>
                                                        {this.props.utilities.currencies[key]}
                                                    </option>
                                                ))}
                                        </FormControl>
                                    </FormGroup>
                                </Col>
                            </Row>

                            {this.state.productNameValidation === s &&
                            this.state.descriptionValidation === s &&
                            this.state.widthValidation === s &&
                            this.state.heightValidation === s &&
                            this.state.lengthValidation === s &&
                            this.state.weightValidation === s &&
                            this.state.priceValidation === s &&
                            <Button type="submit" bsStyle="primary">
                                {addOrEdit} product
                            </Button>
                            }
                        </form>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    authentication: state.authentication,
    products: state.products,
    stores: state.stores,
    utilities: state.utilities
});

export default connect(mapStateToProps)(ProductAdd);
