const genFormItem = (input, type, placeholder, rules) => {
    return {
        elementType: input,
        elementConfig: {
            type: type,
            placeholder: placeholder
        },
        value: "",
        valid: false,
        touched: false,
        ...rules
    };
};

export default genFormItem;