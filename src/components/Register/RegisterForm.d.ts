/// <reference types="react-redux" />
import * as React from "react";
import { IUser } from "../../entities/IUser";
interface IRegisterFormProps {
    user: IUser | null;
    registered: (user: IUser) => void;
}
export declare const RegisterForm: React.ComponentClass<Pick<IRegisterFormProps, never>, React.ComponentState> & {
    WrappedComponent: React.ComponentType<IRegisterFormProps>;
};
export {};
