import * as React from "react";
export declare class ForgotPasswordForm extends React.Component {
    state: {
        email: string;
        emailValid: boolean;
        formErrors: {
            email: string;
        };
        formValid: boolean;
        sentEmailResetMessage: boolean;
    };
    constructor(props: any, context: any);
    render(): JSX.Element;
    private handleUserInput;
    private validateField;
    private validateForm;
    private handleSubmit;
    private throttledHandleSubmit;
}
