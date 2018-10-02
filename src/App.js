import React, { Component } from "react";
import { Route, withRouter, Redirect, Switch } from "react-router-dom";
import { connect } from "react-redux";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";

import Layout from "./components/Layout/Layout";
import Logout from "./containers/Auth/Logout/Logout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import * as actions from "./store/actions/index";

const asynCheckout = asyncComponent(() => {
    return import("./components/Layout/Layout")
})

const asyncOrders = asyncComponent(() => {
    return import("./containers/Orders/Orders")
})

const asyncAuth = asyncComponent(() => {
    return import("./containers/Auth/Auth")
})

class App extends Component {
    componentDidMount() {
        this.props.onTryAutoSignup();
    }

    render() {
        let routes = (
            <Switch>
                <Route path="/auth" component={asyncAuth} />
                <Route path="/" exact component={BurgerBuilder} />
                <Redirect to="/" />
            </Switch>
        );

        if (this.props.isAuthenticated) {
            routes = (
                <Switch>
                    <Route path="/checkout" component={asynCheckout} />
                    <Route path="/orders" component={asyncOrders} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/auth" component={asyncAuth} />
                    <Route path="/" exact component={BurgerBuilder} />
                    <Redirect to="/" />
                </Switch>
            );
        }

        return (
            <div>
                <Layout>{routes}</Layout>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState())
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App)
);
