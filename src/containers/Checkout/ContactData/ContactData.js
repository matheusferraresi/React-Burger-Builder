import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./ContactData.css";
import axios from "../../../axios-orders";
import Input from "../../../components/UI/Input/Input";
import { connect } from "react-redux";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";
import { genFormItem, checkValidity } from "../../../utils/utility";

class ContactData extends Component {
    state = {
        orderForm: {
            name: genFormItem("input", "text", "Your Name", {
                validation: { required: true }
            }),
            street: genFormItem("input", "text", "Street", {
                validation: { required: true }
            }),
            zipCode: genFormItem("input", "text", "Zip Code", {
                validation: { required: true, minLength: 6, maxLength: 8 }
            }),
            country: genFormItem("input", "text", "Country", {
                validation: { required: true }
            }),
            email: genFormItem("input", "email", "your@email.com", {
                validation: { required: true }
            }),
            deliveryMethod: {
                elementType: "select",
                elementConfig: {
                    type: "select",
                    options: [
                        { value: "fastest", displayValue: "Fastest" },
                        { value: "cheapest", displayValue: "Cheapest" }
                    ]
                },
                valid: true,
                value: "fastest",
                validation: {}
            }
        }
    };

    orderHandler = event => {
        event.preventDefault();

        let formData = {};
        for (let inputIdentifier in this.state.orderForm) {
            formData[inputIdentifier] = this.state.orderForm[
                inputIdentifier
            ].value;
        }

        const order = {
            ingredients: this.props.ingredients,
            totalPrice: this.props.totalPrice,
            orderData: formData,
            userId: this.props.userId
        };

        this.props.onOrderBurger(order, this.props.token);
    };

    inputChangedHandler = (event, inputIdentifier) => {
        const updateOrderForm = {
            ...this.state.orderForm
        };

        const updatedFormElement = {
            ...updateOrderForm[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = checkValidity(
            updatedFormElement.value,
            updatedFormElement.validation
        );
        updatedFormElement.touched = true;
        updateOrderForm[inputIdentifier] = updatedFormElement;
        this.setState({ orderForm: updateOrderForm });
    };

    render() {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form action="" onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={event =>
                            this.inputChangedHandler(event, formElement.id)
                        }
                    />
                ))}
                <Button btnType="Success">ORDER</Button>
            </form>
        );
        if (this.props.loading) {
            form = <Spinner />;
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) =>
            dispatch(actions.purchaseBurger(orderData, token))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withErrorHandler(ContactData, axios));
