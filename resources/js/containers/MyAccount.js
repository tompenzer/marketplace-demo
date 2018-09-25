import React from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { Grid, Col, Row, Panel, Glyphicon } from "react-bootstrap";
import ScrollToTop from "react-scroll-up";
import { getUserInfo } from "../actions/users";
import LoadingScreen from "../components/LoadingScreen";
import { ROUTES } from "../api/strings";
import styleVariables from '../../sass/base/_variables.scss';

const fieldLabelStyle = {
    color: styleVariables.gray
};

class MyAccount extends React.Component{

    componentDidMount() {
        this.props.dispatch(getUserInfo());

        if (this.props.authentication.isAuthenticated === false) {
            this.props.history.push(ROUTES.auth.login);
        }
    }

    componentWillReceiveProps(nextProps) {
        // Require auth; redirect to login if the auth check comes back negative.
        if (this.props.authentication.isAuthenticated !== nextProps.authentication.isAuthenticated &&
            nextProps.authentication.isAuthenticated === false
        ) {
            this.props.history.push(ROUTES.auth.login);
        }
    }

    render() {
          if (this.props.users.usersRequested) {
              return <LoadingScreen/>
          }

          return (
              <Grid className="page-min-height">
                  <ScrollToTop showUnder={110}>
                      <div className="text-center">
                          <Glyphicon glyph="arrow-up"/>
                          <p>Back to Top</p>
                      </div>
                  </ScrollToTop>
                  <Row>
                      <Col lg={12} md={12}>
                          <Panel>
                              <Panel.Heading>
                                  <Panel.Title
                                      componentClass="h3"
                                      className="text-center">
                                      My Account
                                  </Panel.Title>
                              </Panel.Heading>
                              <Panel.Body>
                                  <Row>
                                      <Col lg={2} md={2}>
                                          <p style={fieldLabelStyle}>
                                              Full Name:
                                          </p>
                                      </Col>
                                      <Col lg={10} md={10}>
                                          <p className="text-l">
                                              {this.props.users.user.name}
                                          </p>
                                      </Col>
                                  </Row>

                                  <Row>
                                      <Col lg={2} md={2}>
                                          <p style={fieldLabelStyle}>Email: </p>
                                      </Col>
                                      <Col lg={10} md={10}>
                                          <p className="text-l">
                                              {this.props.users.user.email}
                                          </p>
                                      </Col>
                                  </Row>
                              </Panel.Body>
                          </Panel>
                      </Col>
                  </Row>
              </Grid>
          )
    }
}

const mapStateToProps = state => ({
    authentication: state.authentication,
    users: state.users
});

export default connect(mapStateToProps)(withRouter(MyAccount));
