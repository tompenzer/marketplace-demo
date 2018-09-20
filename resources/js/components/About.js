import React from "react";
import { Grid, Col, Row, ListGroup, ListGroupItem } from "react-bootstrap";
import LoadingOrderAnimation from 'react-loading-order-with-animation';
import { REPO_URL } from "../api/strings";

const About = () => (
    <Grid className="page-min-height">
        <Row>
            <h2 className="page-title">
                Marketplace demo project with React, Redux and PHP Laravel
            </h2>

            <hr/>

            <Col lg={12} md={12}>
                <a
                    href={REPO_URL}
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
                    <p className={"bold"}>Libraries and Technologies used :</p>
                    <Row>
                        <Col lg={6} md={6}>
                            <ListGroup>
                                <ListGroupItem>React</ListGroupItem>
                                <ListGroupItem>
                                    Redux with Redux Thunk
                                </ListGroupItem>
                                <ListGroupItem>React-Bootstrap</ListGroupItem>
                                <ListGroupItem>Material UI</ListGroupItem>
                                <ListGroupItem>Babel</ListGroupItem>
                            </ListGroup>
                        </Col>

                        <Col lg={6} md={6}>
                            <ListGroup>
                                <ListGroupItem>Modern PHP 7.2</ListGroupItem>
                                <ListGroupItem>Laravel 5.7</ListGroupItem>
                                <ListGroupItem>Passport OAuth2</ListGroupItem>
                                <ListGroupItem>
                                    Webpack, Yarn and NPM
                                </ListGroupItem>
                                <ListGroupItem>
                                    SASS with SASS loader
                                </ListGroupItem>
                            </ListGroup>
                        </Col>
                    </Row>
                </LoadingOrderAnimation>

                <LoadingOrderAnimation animation="fade-in"
                                       move="from-top-to-bottom"
                                       distance={30}
                                       speed={1000}
                                       wait={1000}>
                    <p className={"bold"}>
                        Data storage & environment management:
                    </p>
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
                </LoadingOrderAnimation>
            </Col>
        </Row>
    </Grid>
);

export default About;
