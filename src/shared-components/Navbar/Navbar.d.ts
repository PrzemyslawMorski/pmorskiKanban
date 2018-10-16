/// <reference types="react-redux" />
import * as React from "react";
import { IUser } from "../../entities/User";
interface INavbarComponentProps {
    user: IUser;
}
export declare const Navbar: React.ComponentClass<Pick<INavbarComponentProps, never>, React.ComponentState> & {
    WrappedComponent: React.ComponentType<INavbarComponentProps>;
};
export {};
