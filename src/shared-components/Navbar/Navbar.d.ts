/// <reference types="react-redux" />
import * as firebase from "firebase";
import * as React from "react";
interface INavbarProps {
    user: firebase.User | null;
}
export declare const Navbar: React.ComponentClass<Pick<INavbarProps, never>, React.ComponentState> & {
    WrappedComponent: React.ComponentType<INavbarProps>;
};
export {};
