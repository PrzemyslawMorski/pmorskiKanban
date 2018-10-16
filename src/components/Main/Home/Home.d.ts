/// <reference types="react-redux" />
import * as React from "react";
interface IHomePageProps {
    appName: string;
    loadMockValue: () => void;
}
export declare const Home: React.ComponentClass<Pick<IHomePageProps, never>, React.ComponentState> & {
    WrappedComponent: React.ComponentType<IHomePageProps>;
};
export {};
