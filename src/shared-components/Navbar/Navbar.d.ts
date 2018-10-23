/// <reference types="react-redux" />
import * as React from "react";
import { IUser } from "../../entities/IUser";
interface INavbarProps {
    user: IUser | null;
}
export declare const Navbar: React.ComponentClass<Pick<INavbarProps, never>, React.ComponentState> & {
    WrappedComponent: React.ComponentType<INavbarProps>;
};
export {};
