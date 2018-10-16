/// <reference types="react-redux" />
import * as React from "react";
import { IUser } from "../../entities/User";
interface ILoginFormComponentProps {
    onLoggedIn: (user: IUser) => void;
}
export declare const LoginForm: React.ComponentClass<Pick<ILoginFormComponentProps, never>, React.ComponentState> & {
    WrappedComponent: React.ComponentType<ILoginFormComponentProps>;
};
export {};
