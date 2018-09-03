import React from "react";
import { Link, withRouter } from 'react-router-dom';
import { Button } from "react-bootstrap";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

/**
 * Generate a product list from an array of products.
 *
 * Required props include `products`, `unitsDimension`, `unitsWeight`, and
 * `currencies`. Also, either each item in the products array is required to
 * have a `store` key set to a store details object (as in the response to the
 * `/products` endpoint), or you need to pass a `store` prop to this component
 * with a store name and id set. If you pass a `userHasAuth` property set to
 * `true`, product edit buttons will be rendered.
 *
 * @param {object} props The properties send to the React component.
 */
const ProductList = (props) => (
    <Paper>
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
                                <Link to={'product/' + item.id}>{item.name}</Link>
                            </TableCell>
                            <TableCell>
                                <Link to={'store/' + (props.store ? props.store.id : item.store.id)}>{(props.store ? props.store.name : item.store.name)}</Link>
                            </TableCell>
                            <TableCell numeric>{item.price + ' ' + props.currencies[item.currency_id]}</TableCell>
                            <TableCell numeric>{`${item.width} ${props.unitsDimension[item.width_unit_id]}, ${item.height} ${props.unitsDimension[item.height_unit_id]}, ${item.length} ${props.unitsDimension[item.length_unit_id]}`}</TableCell>
                            <TableCell numeric>{item.weight + ' ' + props.unitsWeight[item.weight_unit_id]}</TableCell>
                            <TableCell numeric>
                                <Button
                                    bsStyle={"primary"}
                                    className={"add-to-cart-product margin-b-s"}
                                    onClick={() => props.handleAddToCart(Object.assign({}, item, { currency: props.currencies[item.currency_id] }))}
                                >Add to Cart
                                </Button>
                                {props.userHasAuth &&
                                <Button
                                    bsStyle={"info"}
                                    className={"edit-store-product margin-l-m"}
                                    onClick={() => (props.history.push(`/store/${props.store ? props.store.id : item.store.id}/product/${item.id}/edit`))}
                                >Edit Product
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
