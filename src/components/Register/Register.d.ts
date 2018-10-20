/// <reference types="react-redux" />
import * as firebase from "firebase";
import * as React from "react";
interface IRegisterProps {
    user: firebase.User | null;
}
export declare class RegisterPage extends React.Component<IRegisterProps, any> {
    render(): JSX.Element;
}
export declare const Register: React.ComponentClass<Pick<IRegisterProps, never>, React.ComponentState> & {
    WrappedComponent: React.ComponentType<IRegisterProps>;
};
export {};
