/// <reference types="react-redux" />
import * as React from "react";
import { IUser } from "../../entities/User";
interface ILoginFormProps {
    onLoggedIn: (user: IUser) => void;
}
export declare const LoginForm: React.ComponentClass<Pick<ILoginFormProps, never>, React.ComponentState> & {
    WrappedComponent: React.ComponentType<ILoginFormProps>;
};
export {};
