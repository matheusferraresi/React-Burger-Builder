import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./ContactData.css";
import axios from "../../../axios-orders";
import Input from "../../../components/UI/Input/Input";
import { connect } from "react-redux";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";

class ContactData extends Component {
    genFormItem(input, type, placeholder, rules) {
        let result = {
            elementType: input,
            elementConfig: {
                type: type,
                placeholder: placeholder
            },
            value: "",
            valid: true,
            ...rules
        };

        return result;
    }

    state = {
        orderForm: {
            name: this.genFormItem("input", "text", "Your Name", {
                validation: { required: true }
            }),
            street: this.genFormItem("input", "text", "Street", {
                validation: { required: true }
            }),
            zipCode: this.genFormItem("input", "text", "Zip Code", {
                validation: { required: true, minLength: 6, maxLength: 8 }
            }),
            country: this.genFormItem("input", "text", "Country", {
                validation: { required: true }
            }),
            email: this.genFormItem("input", "email", "your@email.com", {
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
                value: "fastest",
                validation: {}
            }
        },
        loading: false
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
            price: this.props.price,
            orderData: formData
        };

        this.props.onOrderBurger(order);
    };

    checkValidity(value, rules) {
        let isValid = true;

        if (!rules) {
            return true;
        }

        if (rules.required) {
            isValid = value.trim() !== "" && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.minLength && isValid;
        }

        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updateOrderForm = {
            ...this.state.orderForm
        };

        const updatedFormElement = {
            ...updateOrderForm[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(
            updatedFormElement.value,
            updatedFormElement.validation
        );
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
                        changed={event =>
                            this.inputChangedHandler(event, formElement.id)
                        }
                    />
                ))}
                <Button btnType="Success">ORDER</Button>
            </form>
        );
        if (this.state.loading) {
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
        ingredients: state.ingredients,
        totalPrice: state.totalPrice
    };
};

const mapDispatchToProps = dispatch => {
    onOrderBurger: orderData =>
        dispatch(actions.purchaseBurgerStart(orderData));
};

export default connect(mapStateToProps)(withErrorHandler(ContactData, axios));
