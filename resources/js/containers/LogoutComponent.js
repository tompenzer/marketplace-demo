import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { logOut } from "../actions/authentication";
import { ROUTES } from "../api/strings";

class LogoutComponent extends React.Component{

    state = {
        logoutMessage: "Please wait while we safely log you out..."
    };

    componentDidMount() {
        if (this.props.authentication.isAuthenticated) {
            this.props.dispatch(logOut());
        }

        this.props.history.push(ROUTES.root);
    }

    render() {
        return (
            <div className="page-min-height padding-2xl" ref="logout-div">
                <h3>{this.state.logoutMessage}</h3>
            </div>
        )
    }
}

const mapStateToProps = state => ({ authentication: state.authentication });

export default connect(mapStateToProps)(withRouter(LogoutComponent));
