import React from "react";
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Button } from "react-bootstrap";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ROUTES } from "../api/strings";

/**
 * Generate a product list from an array of products.
 *
 * Required props include `products`, and either each item in the products array
 * is required to have a `store` key set to a store details object (as in the
 * response to the `/products` endpoint), or you need to pass a `store` prop to
 * this component with a store name and id set. If you pass a `userHasAuth`
 * property set to `true`, product edit buttons will be rendered.
 *
 * @param {object} props The properties send to the React component.
 */
const ProductList = props => (
    <Paper className="margin-b-xl">
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Product name</TableCell>
                    {! props.store && <TableCell>Sold by</TableCell>}
                    <TableCell numeric>Price</TableCell>
                    <TableCell numeric>Dimensions (w, h, l)</TableCell>
                    <TableCell numeric>Weight</TableCell>
                    <TableCell numeric>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.products.map(item => {
                    const store = props.store ? props.store : item.store;

                    return (
                        <TableRow key={item.id}>
                            <TableCell component="th" scope="row">
                                <Link to={
                                    ROUTES.products.show
                                        .replace(':id', item.id)
                                }>{item.name}</Link>
                            </TableCell>
                            {! props.store && <TableCell>
                                <Link to={
                                    ROUTES.stores.show
                                        .replace(':storeId', store.id)
                                }>{store.name}</Link>
                            </TableCell>}
                            <TableCell numeric>{
                                item.currency.abbreviation + ' ' +
                                parseFloat(item.price).toFixed(2)
                            }</TableCell>
                            <TableCell numeric>{
                                item.width + ' ' +
                                item.width_unit.abbreviation + ', ' +
                                item.height + ' ' +
                                item.height_unit.abbreviation + ', ' +
                                item.length + ' ' +
                                item.length_unit.abbreviation
                            }</TableCell>
                            <TableCell numeric>{
                                parseFloat(item.weight).toFixed(2) +
                                ' ' + item.weight_unit.abbreviation
                            }</TableCell>
                            <TableCell numeric>
                                <Button
                                    bsStyle="primary"
                                    className="add-to-cart-product margin-s"
                                    onClick={() => props.handleAddToCart(item)}
                                >Add to Cart
                                </Button>
                                {props.userHasAuth &&
                                <Button
                                    bsStyle="info"
                                    className="edit-store-product margin-s"
                                    onClick={() => props.history.push(
                                        ROUTES.products.update
                                            .replace(':storeId', store.id)
                                            .replace(':productId', item.id)
                                        )}
                                >
                                    Edit Product
                                </Button>}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </Paper>
);

ProductList.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
            store: PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string
            }),
            id: PropTypes.number,
            name: PropTypes.string,
            currency: PropTypes.shape({
                abbreviation: PropTypes.string
            }),
            price: PropTypes.number,
            width: PropTypes.number,
            width_unit: PropTypes.shape({
                abbreviation: PropTypes.string
            }),
            height: PropTypes.number,
            height_unit: PropTypes.shape({
                abbreviation: PropTypes.string
            }),
            length: PropTypes.number,
            length_unit: PropTypes.shape({
                abbreviation: PropTypes.string
            }),
            weight: PropTypes.number,
            weight_unit: PropTypes.shape({
                abbreviation: PropTypes.string
            }),
            state: PropTypes.string,
            postal_code: PropTypes.string,
            country_id: PropTypes.number,
            phone: PropTypes.string
        })
    ).isRequired,
    handleAddToCart: PropTypes.func.isRequired,
    store: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    }),
    userHasAuth: PropTypes.bool,
    history: PropTypes.object
};

export default ProductList;
