import React from 'react';
import { Row, Col, Grid, Panel, Glyphicon } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { ROUTES } from "../api/strings";

const iconStyle = {
    fontSize: '30px'
}

const InformationPanel = (props) => (
    <Grid className="page-min-height">
        <Row>
            <Col lg={12}>
                <Panel bsStyle="primary">
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">
                            {props.panelTitle}
                        </Panel.Title>
                    </Panel.Heading>

                    <Panel.Body>
                        <h4>{props.informationHeading}</h4>

                        <p>{props.message}</p>

                        <Glyphicon glyph="shopping-cart" style={iconStyle}/>

                        <Link to={ROUTES.root}>Continue Shopping</Link>
                    </Panel.Body>
                </Panel>
            </Col>
        </Row>
    </Grid>
);

export default InformationPanel;
