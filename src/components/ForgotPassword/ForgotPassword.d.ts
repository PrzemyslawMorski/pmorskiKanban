/// <reference types="react-redux" />
import * as React from "react";
import { IUser } from "../../entities/IUser";
interface IForgotPasswordProps {
    user: IUser | null;
}
export declare class ForgotPasswordPage extends React.Component<IForgotPasswordProps, any> {
    render(): JSX.Element;
}
export declare const ForgotPassword: React.ComponentClass<Pick<IForgotPasswordProps, never>, React.ComponentState> & {
    WrappedComponent: React.ComponentType<IForgotPasswordProps>;
};
export {};
