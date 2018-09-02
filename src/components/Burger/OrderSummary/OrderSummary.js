import React, { Component } from "react";
import Auxi from "../../../hoc/Auxi";
import Button from '../../UI/Button/Button'

export default class OrderSummary extends Component {
  // This could be a stateless component
  // componentWillUpdate () {
  //   console.log('[OrderSummary] WillUpdate')
  // }

  render () {
    const ingredientSummary = Object.keys(this.props.ingredients).map(key => {
      return (
        <li key={key}>
          <span style={{ textTransform: "capitalize" }}>{key}</span>: {this.props.ingredients[key]}
        </li>
      );
    });

    return (
      <Auxi>
        <h3>Your Order</h3>
        <p>A delicious burger with the following ingredients:</p>
        <ul>
          {ingredientSummary}
        </ul>
        <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
        <p>Continue to Checkout?</p>
        <Button btnType="Danger" clicked={this.props.purchaseCanceled}>CANCEL</Button>
        <Button btnType="Success" clicked={this.props.purchaseContinued}>CONTINUE</Button>
      </Auxi>
    );
  };
}