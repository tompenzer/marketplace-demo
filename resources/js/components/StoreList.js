import React from "react";
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { ROUTES } from "../api/strings";
import styleVariables from '../../sass/base/_variables.scss';

/**
 * Generate a store list from an array of stores.
 *
 * Required props include `stores`, an array of store objects, each with an `id`,
 * `name` and `description`.
 *
 * @param {object} props The properties send to the React component.
 */
class StoreList extends React.Component {
    /**
     * We're setting a timer that clears itself after 500ms, and then upon touch
     * or mouse click end, we're only redirecting to the store page if the timer
     * is still active, so that long presses and text selection don't trigger a
     * navigation to the store page.
     *
     * @return {void} attaches a timer to the component.
     */
    handleStoreRowPress = e => {
        // Act only on touch and left clicks.
        if (! e.button || e.button === 0) {
            this.storeRowPressTimer = setTimeout(
                () => {
                    clearTimeout(this.storeRowPressTimer);
                    // Setting to 0 so we can check that it's been cleared.
                    this.storeRowPressTimer = 0;
                },
                500
            );
        } else {
            this.storeRowPressTimer = 0;
        }
    }

    handleStoreRowRelease = storeId => {
        if (this.storeRowPressTimer !== 0) {
            clearTimeout(this.storeRowPressTimer);
            this.storeRowPressTimer = 0;
            this.props.history.push(
                ROUTES.stores.show.replace(':storeId', storeId)
            );
        }
    }

    render() {
        return (
            <Paper className="margin-b-xl">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Store name</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.stores.map(item => (
                            <TableRow
                                key={item.id}
                                className="store-list-row"
                                onTouchStart={this.handleStoreRowPress}
                                onTouchEnd={
                                    () => this.handleStoreRowRelease(item.id)}
                                onMouseDown={this.handleStoreRowPress}
                                onMouseUp={
                                    () => this.handleStoreRowRelease(item.id)}>
                                <TableCell>
                                    <Link to={ROUTES.stores.show
                                        .replace(':storeId', item.id)}>
                                        {item.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{item.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
};

StoreList.propTypes = {
    stores: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            description: PropTypes.string
        })
    ).isRequired
};

export default withRouter(StoreList);
