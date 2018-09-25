import React from 'react';
import {
    Navbar,
    FormControl,
    FormGroup,
    Nav,
    NavItem,
    MenuItem,
    Button,
    Glyphicon,
    Badge,
    DropdownButton,
    InputGroup
} from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Popover, { PopoverAnimationVertical } from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItemMUI from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { ROUTES } from "../api/strings";
import ShoppingCart from '../containers/ShoppingCart';
import styleVariables from '../../sass/base/_variables.scss';

const glyphIconStyle = {
    fontSize: styleVariables.textSizeXl
};

const cartBadgeStyle = {
    backgroundColor: styleVariables.black,
    fontSize: '10px',
    left: '1px',
    padding: '3px 5px',
    top: '-10px'
};

const navBarFormStyle = {
    marginBottom: 6,
    marginTop: 6
}

class Header extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            location: {},
            searchMenuItems: [{
                label: 'Products',
                placeholder: 'Search products',
                path: ROUTES.products.index
            }, {
                label: 'Stores',
                placeholder: 'Search stores',
                path: ROUTES.stores.index
            }],
            searchMenuItemsActive: [0, 1],
            searchMenuItemSelected: 0,
            searchFieldPlaceholder: '',
            searchFieldText: '',
            shoppingCartOpen: false,
            userMenuItems: [],
            accountMenuOpen: false,
            accountMenuTarget: null
        };

        // Listen for history updates to update the active state of nav items.
        this.props.history.listen(location => {
            this.setState({ location });
        });
    }

    componentDidMount() {
        this.setUserMenuOptions(this.props.authentication.isAuthenticated || false);

        this.searchMenuSelectHelper(this.state.searchMenuItemSelected);

        this.setState({ location: this.props.location });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.authentication.isAuthenticated !== nextProps.authentication.isAuthenticated) {
            this.setUserMenuOptions(nextProps.authentication.isAuthenticated);
        }
    }

    searchMenuSelectHelper = itemId => {
        this.setState({
            searchFieldPlaceholder: this.state.searchMenuItems[itemId].placeholder,
            searchMenuItemsActive: [...this.state.searchMenuItems.keys()]
                .filter(id => id != itemId),
            searchMenuItemSelected: itemId
        });
    };

    setUserMenuOptions = authenticated => {
        let options = [{
            label: 'Log In',
            path: ROUTES.auth.login
        }, {
            label: 'Register',
            path: ROUTES.auth.register
        }];

        if (authenticated) {
            options = [{
                label: 'My account',
                path: ROUTES.users.show
            }, {
                label: 'My Orders',
                path: ROUTES.orders.index
            },
            'divider', {
                label: 'Log out',
                path: ROUTES.auth.logout
            }];
        }

        this.setState({ userMenuItems: options });
    };

    handleSearchFieldChange = e => {
        const searchFieldText = e.target.value;

        if (searchFieldText.length < 255) {
            this.setState({ searchFieldText });
        }
    };

    handleSearchFormSubmit = e => {
        e.preventDefault();

        const path = this.state.searchMenuItems[this.state.searchMenuItemSelected].path;
        let searchQuery = '';

        // Product and store search routes are the index route + '/' + {search term}.
        if (this.state.searchFieldText) {
            searchQuery = '/' + this.state.searchFieldText;
        }

        this.props.history.push(path + searchQuery);
    };

    handleUserAccountClick = e => {
        // This prevents ghost click.
        e.preventDefault();

        this.setState({
            accountMenuOpen: true,
            accountMenuTarget: e.target
        });
    };

    handleUserAccountClose = () => {
        this.setState({
            accountMenuOpen: false,
            accountMenuTarget: null
        });
    };

    handleUserAccountMenuOptionClick = url => {
        this.handleUserAccountClose();
        this.props.history.push(url);
    };

    shoppingCartModalShow = () => {
        this.setState({ shoppingCartOpen: true });
    };

    shoppingCartModalHide = () => {
        this.setState({ shoppingCartOpen: false });
    };

    render() {
        let shoppingCartTotal = 0;

        if (this.props.shoppingCart) {
            shoppingCartTotal = this.props.shoppingCart
                .reduce((accumulator, item) => {
                    return accumulator + parseInt(item.quantity);
                }, 0);
        }

        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to={ROUTES.root}>Marketplace</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem
                            componentClass={Link}
                            title="Products"
                            href={ROUTES.products.index}
                            to={ROUTES.products.index}
                            active={this.state.location.pathname &&
                                (this.state.location.pathname === ROUTES.products.index ||
                                 this.state.location.pathname === ROUTES.root)}
                        >
                          Products
                        </NavItem>
                        <NavItem
                            componentClass={Link}
                            title="Stores"
                            href={ROUTES.stores.index}
                            to={ROUTES.stores.index}
                            active={this.state.location.pathname &&
                                this.state.location.pathname === ROUTES.stores.index}
                        >
                          Stores
                        </NavItem>
                    </Nav>
                    <Navbar.Form pullRight style={navBarFormStyle}>
                        <form onSubmit={this.handleSearchFormSubmit}>
                            <FormGroup>
                                <InputGroup>
                                <FormControl type="text"
                                     placeholder={this.state.searchFieldPlaceholder}
                                     value={this.state.searchFieldText}
                                     onChange={this.handleSearchFieldChange}
                                     inputRef={ref => { this.input = ref; }}
                                />
                                <DropdownButton
                                    componentClass={InputGroup.Button}
                                    id="input-dropdown-addon"
                                    title={this.state.searchMenuItems[this.state.searchMenuItemSelected].label}
                                >
                                    {this.state.searchMenuItemsActive.map(itemId => (
                                        <MenuItem
                                            key={'searchMenuItem' + itemId}
                                            onSelect={() => this.searchMenuSelectHelper(itemId)}>
                                            {this.state.searchMenuItems[itemId].label}
                                        </MenuItem>
                                    ))}
                                </DropdownButton>
                                </InputGroup>
                                <Button className="margin-l-xs" type="submit">
                                    <Glyphicon glyph="search"/>
                                </Button>
                            </FormGroup>
                            <Button
                                className="margin-l-s"
                                onClick={this.shoppingCartModalShow}
                                bsStyle="link">
                                <Glyphicon
                                    glyph="shopping-cart"
                                    style={glyphIconStyle}/>
                                {shoppingCartTotal > 0 &&
                                <Badge style={cartBadgeStyle}>
                                    {shoppingCartTotal}
                                </Badge>
                                }
                            </Button>
                            <Button
                                onClick={this.handleUserAccountClick}
                                bsStyle="link">
                                <Glyphicon glyph="user" style={glyphIconStyle}/>
                            </Button>
                            <Popover
                                open={this.state.accountMenuOpen}
                                anchorEl={this.state.accountMenuTarget}
                                onClose={this.handleUserAccountClose}
                                anchorOrigin={{
                                    horizontal: 'center',
                                    vertical: 'top'
                                }}
                                transformOrigin={{
                                    horizontal: 'center',
                                    vertical: 'top'
                                }}>
                                <MenuList open={this.state.accountMenuOpen}>
                                    {this.state.userMenuItems.map((item, key) => {
                                        if (item === 'divider') {
                                            return <Divider key={key}/>
                                        }

                                        return (
                                            <MenuItemMUI
                                                key={key}
                                                onClick={() => this.handleUserAccountMenuOptionClick(item.path)}>
                                                {item.label}
                                            </MenuItemMUI>
                                        )
                                    })}
                                </MenuList>
                            </Popover>
                        </form>
                    </Navbar.Form>
                    <ShoppingCart
                        handleClose={this.shoppingCartModalHide}
                        show={this.state.shoppingCartOpen}/>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

const mapStateToProps = state => ({
    shoppingCart: state.shoppingCart,
    authentication: state.authentication
});

export default connect(mapStateToProps)(withRouter(Header));
