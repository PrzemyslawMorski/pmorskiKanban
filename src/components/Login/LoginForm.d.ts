import * as React from "react";
export declare class LoginForm extends React.Component {
    state: {
        email: string;
        emailValid: boolean;
        formErrors: {
            email: string;
            password: string;
        };
        formValid: boolean;
        loggedInSuccessfully: boolean;
        password: string;
        passwordValid: boolean;
        rememberMe: boolean;
    };
    constructor(props: any, context: any);
    render(): JSX.Element;
    private handleUserInput;
    private validateField;
    private validateForm;
    private handleSubmit;
    private throttledHandleSubmit;
}
