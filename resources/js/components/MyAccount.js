import React from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { Grid, Col, Row, Panel, Glyphicon } from "react-bootstrap";
import axios, { getAuthHeaders } from '../api/axiosInstance';
import { getUserAPI } from "../api/apiURLs";
import ScrollToTop from "react-scroll-up";
import LoadingScreen from "../components/LoadingScreen";
import styleVariables from '../../sass/base/_variables.scss';

const fieldLabelStyle = {
    color: styleVariables.gray
};

class MyAccount extends React.Component{
    state = {
        isLoading: false,
        user: {}
    };

    componentDidMount() {
        // load the data here
        if (this.props.authentication.isAuthenticated) {
            this.setState(() => ({isAuthenticated: true}));

            axios.get(getUserAPI, getAuthHeaders())
                .then((response) => {
                    const user = response.data;
                    this.setState(() => ({ user, isLoading: false }));
                })
                .catch((error) => {
                    console.log(error.response);
                    this.props.history.push("/");
                })
        } else {
            this.props.history.push("/login");
        }
    }

    render() {
          if (this.state.isLoading) {
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
                                  <Panel.Title componentClass="h3" className="text-center">My Account</Panel.Title>
                              </Panel.Heading>
                              <Panel.Body>
                                  <Row>
                                      <Col lg={2} md={2}>
                                          <p style={fieldLabelStyle}>Full Name: </p>
                                      </Col>
                                      <Col lg={10} md={10}>
                                          <p className="text-l">{this.state.user.name}</p>
                                      </Col>
                                  </Row>

                                  <Row>
                                      <Col lg={2} md={2}>
                                          <p style={fieldLabelStyle}>Email: </p>
                                      </Col>
                                      <Col lg={10} md={10}>
                                          <p className="text-l">{this.state.user.email}</p>
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

const mapStateToProps = (state) => {
    return {
        authentication: state.authentication
    };
};

export default connect(mapStateToProps)(withRouter(MyAccount));
