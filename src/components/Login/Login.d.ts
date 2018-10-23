/// <reference types="react-redux" />
import * as React from "react";
import { IUser } from "../../entities/IUser";
interface ILoginProps {
    user: IUser | null;
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
