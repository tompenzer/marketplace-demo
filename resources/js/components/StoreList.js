import React from "react";
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { ROUTES } from "../api/strings";

/**
 * Generate a store list from an array of stores.
 *
 * Required props include `stores`, an array of store objects, each with an `id`,
 * `name` and `description`.
 *
 * @param {object} props The properties send to the React component.
 */
const StoreList = props => (
    <Paper className="margin-b-xl">
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Store name</TableCell>
                    <TableCell>Description</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.stores.map(item => {
                    return (
                        <TableRow key={item.id}>
                            <TableCell component="th" scope="row">
                                <Link to={ROUTES.stores.show.split(':')[0] + item.id}>{item.name}</Link>
                            </TableCell>
                            <TableCell>{item.description}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </Paper>
);

export default StoreList;
