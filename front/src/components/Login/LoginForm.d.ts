import * as React from "react";
declare class LoginFormComponent extends React.Component {
    state: {
        email: string;
        password: string;
        emailError: boolean;
        passwordError: boolean;
    };
    constructor(props: any, context: any);
    render(): JSX.Element;
    private handleEmailChange;
    private handlePasswordChange;
    private handleSubmit;
    private emailHelperText;
    private emailIntent;
    private passwordHelperText;
    private passwordIntent;
}
export declare const LoginForm: import("react-redux").ConnectedComponentClass<typeof LoginFormComponent, Pick<any, string | number | symbol>>;
export {};
