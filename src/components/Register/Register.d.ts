/// <reference types="react-redux" />
import * as React from "react";
import { IUser } from "../../entities/IUser";
interface IRegisterProps {
    user: IUser | null;
}
export declare class RegisterPage extends React.Component<IRegisterProps, any> {
    render(): JSX.Element;
}
export declare const Register: React.ComponentClass<Pick<IRegisterProps, never>, React.ComponentState> & {
    WrappedComponent: React.ComponentType<IRegisterProps>;
};
export {};
