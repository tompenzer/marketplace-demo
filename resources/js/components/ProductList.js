import React from "react";
import { Link, withRouter } from 'react-router-dom';
import { Button } from "react-bootstrap";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { ROUTES } from "../api/strings";

const getProductEditPath = (props, product) => {
    const storeId = props.store ? props.store.id : product.store.id,
        productEditRouteStore = ROUTES.products.update.split(':storeId'),
        productEditRouteProduct = productEditRouteStore[1].split(':productId');

    return productEditRouteStore[0] +
        storeId +
        productEditRouteProduct[0] +
        product.id +
        productEditRouteProduct[1];
}

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
                    <TableCell>Sold by</TableCell>
                    <TableCell numeric>Price</TableCell>
                    <TableCell numeric>Dimensions (w, h, l)</TableCell>
                    <TableCell numeric>Weight</TableCell>
                    <TableCell numeric>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.products.map(item => {
                    return (
                        <TableRow key={item.id}>
                            <TableCell component="th" scope="row">
                                <Link to={ROUTES.products.show.split(':')[0] + item.id}>{item.name}</Link>
                            </TableCell>
                            <TableCell>
                                <Link to={ROUTES.stores.show.split(':')[0] + (props.store ? props.store.id : item.store.id)}>{(props.store ? props.store.name : item.store.name)}</Link>
                            </TableCell>
                            <TableCell numeric>{Number.parseFloat(item.price).toFixed(2) + ' ' + item.currency.abbreviation}</TableCell>
                            <TableCell numeric>{`${item.width} ${item.width_unit.abbreviation}, ${item.height} ${item.height_unit.abbreviation}, ${item.length} ${item.length_unit.abbreviation}`}</TableCell>
                            <TableCell numeric>{Number.parseFloat(item.weight).toFixed(2) + ' ' + item.weight_unit.abbreviation}</TableCell>
                            <TableCell numeric>
                                <Button
                                    bsStyle={"primary"}
                                    className={"add-to-cart-product margin-b-s"}
                                    onClick={() => props.handleAddToCart(item)}
                                >Add to Cart
                                </Button>
                                {props.userHasAuth &&
                                <Button
                                    bsStyle={"info"}
                                    className={"edit-store-product margin-l-m"}
                                    onClick={() => props.history.push(getProductEditPath(props, item))}
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

export default ProductList;
