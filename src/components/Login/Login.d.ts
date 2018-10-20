/// <reference types="react-redux" />
import * as firebase from "firebase";
import * as React from "react";
interface ILoginProps {
    user: firebase.User | null;
}
export declare class LoginPage extends React.Component<ILoginProps, any> {
    state: {
        loggedIn: boolean;
    };
    render(): JSX.Element;
}
export declare const Login: React.ComponentClass<Pick<ILoginProps, never>, React.ComponentState> & {
    WrappedComponent: React.ComponentType<ILoginProps>;
};
export {};
