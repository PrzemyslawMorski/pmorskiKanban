/// <reference types="react-redux" />
import * as firebase from "firebase";
import * as React from "react";
interface IForgotPasswordProps {
    user: firebase.User | null;
}
export declare class ForgotPasswordPage extends React.Component<IForgotPasswordProps, any> {
    render(): JSX.Element;
}
export declare const ForgotPassword: React.ComponentClass<Pick<IForgotPasswordProps, never>, React.ComponentState> & {
    WrappedComponent: React.ComponentType<IForgotPasswordProps>;
};
export {};
