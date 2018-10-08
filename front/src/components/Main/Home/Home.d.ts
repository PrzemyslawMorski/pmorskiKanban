import * as React from "react";
interface IHomePageProps {
    appName: string;
    loadMockValue: () => void;
}
declare class HomePage extends React.Component<IHomePageProps, {}> {
    constructor(props: IHomePageProps, context: any);
    render(): JSX.Element;
}
export declare const Home: import("react-redux").ConnectedComponentClass<typeof HomePage, Pick<IHomePageProps, never>>;
export {};
