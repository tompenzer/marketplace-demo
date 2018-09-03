import React from "react";
import {Grid, Col, Row, ListGroup, ListGroupItem} from "react-bootstrap";
import LoadingOrderAnimation from 'react-loading-order-with-animation';

const About = () => (
    <Grid className={"minimum-height about-div"}>
        <Row>
            <h4>Marketplace demo project with React, Redux and PHP Laravel</h4>
            <hr/>
            <Col lg={12} md={12}>
                <a
                    href={"https://github.com/tompenzer/marketplace-demo"}
                    target="_blank">
                    Project Github link
                </a>
                <br/>
                <br/>
                <LoadingOrderAnimation animation="fade-in"
                                       move="from-top-to-bottom"
                                       distance={30}
                                       speed={1000}
                                       wait={300}>
                    <div>
                        <p className={"sixzero-weight"}>Libraries and Technologies used :</p>
                        <Row>
                            <Col lg={6} md={6}>
                                <ListGroup>
                                    <ListGroupItem>Redux</ListGroupItem>
                                    <ListGroupItem>React-router</ListGroupItem>
                                    <ListGroupItem>React-Bootstrap</ListGroupItem>
                                    <ListGroupItem>Material UI</ListGroupItem>
                                    <ListGroupItem>Axios</ListGroupItem>
                                    <ListGroupItem>Redux Thunk</ListGroupItem>
                                </ListGroup>
                            </Col>

                            <Col lg={6} md={6}>
                                <ListGroup>
                                    <ListGroupItem>PHP Laravel 5.7</ListGroupItem>
                                    <ListGroupItem>Laravel Passport</ListGroupItem>
                                    <ListGroupItem>SASS with SASS loader</ListGroupItem>
                                    <ListGroupItem>Webpack</ListGroupItem>
                                    <ListGroupItem>Babel</ListGroupItem>
                                    <ListGroupItem>Faker</ListGroupItem>
                                </ListGroup>
                            </Col>
                        </Row>
                    </div>
                </LoadingOrderAnimation>

                <LoadingOrderAnimation animation="fade-in"
                                       move="from-top-to-bottom"
                                       distance={30}
                                       speed={1000}
                                       wait={1000}>
                    <div>
                        <p className={"sixzero-weight"}>Data storage & environment management:</p>
                        <Row>
                            <Col lg={6} md={6}>
                                <ListGroup>
                                    <ListGroupItem>MySQL</ListGroupItem>
                                    <ListGroupItem>Redis</ListGroupItem>
                                </ListGroup>
                            </Col>

                            <Col lg={6} md={6}>
                                <ListGroup>
                                    <ListGroupItem>Docker</ListGroupItem>
                                    <ListGroupItem>Composer & NPM</ListGroupItem>
                                </ListGroup>
                            </Col>
                        </Row>
                    </div>
                </LoadingOrderAnimation>
            </Col>
        </Row>
    </Grid>
);

export default About;
