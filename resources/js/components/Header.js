import React from 'react';
import { Navbar, FormControl, FormGroup, Nav, NavItem, MenuItem, Button, Glyphicon, DropdownButton, InputGroup } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import ShoppingCart from '../components/ShoppingCart';
import { connect } from 'react-redux';
import Popover, {PopoverAnimationVertical} from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItemMUI from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

class Header extends React.Component{

    state = {
        isOpenElectronics: false,
        isOpenBook: false,
        isOpenHome: false,
        placeholder: 'Search products',
        searchMenuItems: [ 'Products', 'Stores' ],
        searchMenuItemsActive: [ 'Products', 'Stores' ],
        dropDownSelected: 'Products',
        searchBoxText: '',
        shoppingCartOpen: false,
        menuItemMUI: [ 'Log In', 'Register' ],
        open: false
    };

    categoryStateChangeHelper = (category) => {
        this.setState(() => ({
            placeholder: 'Search ' + category.toLowerCase(),
            searchMenuItemsActive: this.state.searchMenuItems.filter((v) => (v !== category)),
            dropDownSelected: category
        }));
    };

    changeMenuMUIOptionsAuthenticated = () => {
        this.setState(() => ({ menuItemMUI: [ 'My account', 'My Orders', 'Divider', 'Log out' ] }));
    };

    changeMenuMUIOptionsUnauthenticated = () => {
        this.setState(() => ({menuItemMUI: ['Log In', 'Register']}));
    };

    componentWillReceiveProps(nextProps){
        if (this.props.authentication.isAuthenticated !== nextProps.authentication.isAuthenticated) {
            if (nextProps.authentication.isAuthenticated) {
                this.changeMenuMUIOptionsAuthenticated();
            } else {
                this.changeMenuMUIOptionsUnauthenticated();
            }
        }
    }

    componentDidMount(){
        if(this.props.authentication.isAuthenticated){
            this.changeMenuMUIOptionsAuthenticated();
        }
        else{
            this.changeMenuMUIOptionsUnauthenticated();
        }

        this.categoryStateChangeHelper(this.state.dropDownSelected);
    }

    categoryClickHandler = (routeName) => {
        this.props.history.push(routeName);
    };

    onSearchFormSubmit = (e) => {
        e.preventDefault();
        let searchQuery = '';

        if (this.state.searchBoxText) {
            searchQuery = '/' + this.state.searchBoxText;
        }

        this.props.history.push('/' + this.state.dropDownSelected.toLowerCase() + searchQuery);
    };

    menuOptionsClick = (menuItemName) => {
        this.setState(() => ({open: false}));
        const url = "/".concat(menuItemName.split(" ").join("").toLowerCase());
        this.props.history.push(url);
    };

    searchBoxChange = (e) => {
        let searchBoxText = e.target.value;
        if(searchBoxText.length < 25){
            this.setState(() => ({searchBoxText}));
        }
    };

    searchCategoryChange = (selectedCategory) => {
        this.categoryStateChangeHelper(selectedCategory);
    };

    shoppingCartModalShow = () => {
        this.setState(() => ({shoppingCartOpen: true}));
    };

    shoppingCartModalHide = () => {
        this.setState(() => ({shoppingCartOpen: false}));
    };

    handleUserAccountClick = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    handleUserAccountClose = () => {
        this.setState({
            open: false,
        });
    };

    render(){
        let shoppingCartTotal = this.props.shoppingCart ? this.props.shoppingCart.reduce((accumulator, item) => {
            return accumulator + item.quantity;
        }, 0) : 0;
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">Marketplace</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem
                            title="Products"
                            onClick={() => this.categoryClickHandler("/products")}
                        >
                          Products
                        </NavItem>
                        <NavItem
                            title="Stores"
                            onClick={() => this.categoryClickHandler("/stores")}
                        >
                          Stores
                        </NavItem>
                    </Nav>
                    <Navbar.Form pullRight>
                        <form onSubmit={this.onSearchFormSubmit}>
                            <FormGroup>
                                <InputGroup>
                                <FormControl type="text"
                                             placeholder={this.state.placeholder}
                                             value={this.state.searchBoxText}
                                             onChange={this.searchBoxChange}
                                             inputRef={ref => { this.input = ref; }}
                                />
                                <DropdownButton
                                    componentClass={InputGroup.Button}
                                    id="input-dropdown-addon"
                                    title={this.state.dropDownSelected}
                                >
                                    {
                                        this.state.searchMenuItemsActive.map((menuItem) => (
                                            <MenuItem key={menuItem}
                                                      onSelect={() => this.searchCategoryChange(menuItem)}>{menuItem}</MenuItem>
                                        ))
                                    }
                                </DropdownButton>
                                </InputGroup>
                                <Button className="margin-l-xs" type="submit"><Glyphicon glyph={"search"}/></Button>
                                <Button className="margin-l-s" onClick={this.shoppingCartModalShow} bsStyle={"link"}>
                                    <Glyphicon glyph={"shopping-cart"} className={"cart-symbol-size"}/>
                                    {shoppingCartTotal > 0 &&
                                        <span className="badge custom-cart-badge">
                                            {shoppingCartTotal}
                                        </span>
                                    }
                                </Button>
                                <div className={"inline-div-display"}>
                                    <Button
                                        onClick={this.handleUserAccountClick}
                                        bsStyle={"link"}
                                    ><Glyphicon glyph={"user"} className={"cart-symbol-size"}/></Button>
                                    <Popover
                                        open={this.state.open}
                                        anchorEl={this.state.anchorEl}
                                        onClose={this.handleUserAccountClose}
                                        anchorOrigin={{horizontal: 'center', vertical: 'top'}}
                                        transformOrigin={{horizontal: 'center', vertical: 'top'}}
                                    >
                                        <MenuList open={this.state.open}>
                                            {this.state.menuItemMUI.map((item, key) => {
                                                if(item === "Divider"){
                                                    return <Divider className={"menuDivider"} key={key}/>
                                                }
                                                return <MenuItemMUI key={key} onClick={() => this.menuOptionsClick(item)}>{item}</MenuItemMUI>
                                            })}
                                        </MenuList>
                                    </Popover>
                                </div>
                            </FormGroup>
                        </form>
                    </Navbar.Form>
                    <ShoppingCart handleClose={this.shoppingCartModalHide} show={this.state.shoppingCartOpen}/>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        shoppingCart: state.shoppingCart,
        authentication: state.authentication
    };
};

export default connect(mapStateToProps)(withRouter(Header));
