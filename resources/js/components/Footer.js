import React from 'react';
import { Navbar, Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styleVariables from '../../sass/base/_variables.scss';

const footerLinkStyle = {
    color: styleVariables.offBlack
};

const Footer = () => (
    <footer className="footer margin-t-m">
        <Navbar className="margin-b-0">
            <Grid>
                <Row>
                    <Col md={4} sm={12} className="text-center padding-s">
                        <Link style={footerLinkStyle} to="/account">My Account</Link>
                    </Col>

                    <Col md={4} sm={12} className="text-center padding-s">
                        <Link style={footerLinkStyle} to="/orders">My Orders</Link>
                    </Col>

                    <Col md={4} sm={12} className="text-center padding-s">
                        <Link style={footerLinkStyle} to="/about">About Project</Link>
                    </Col>
                </Row>

                <Row>
                    <Col lg={12}>
                        <div className={"text-center padding-s"}>
                            Copyright &copy; Tom Penzer {(new Date().getFullYear())}
                        </div>
                    </Col>
                </Row>
            </Grid>
        </Navbar>
    </footer>
);

export default Footer;
