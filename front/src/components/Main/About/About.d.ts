import * as React from "react";
interface IAboutPageProps {
    appName: string;
}
declare class AboutPage extends React.Component<IAboutPageProps, {}> {
    render(): JSX.Element;
}
export declare const About: import("react-redux").ConnectedComponentClass<typeof AboutPage, Pick<IAboutPageProps, never>>;
export {};
