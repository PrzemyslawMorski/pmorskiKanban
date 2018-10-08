import * as PropTypes from "prop-types";
import * as React from "react";
declare class MainPage extends React.Component {
    static propTypes: {
        history: PropTypes.Validator<object>;
        location: PropTypes.Validator<object>;
        match: PropTypes.Validator<object>;
    };
    render(): JSX.Element;
}
export declare const Main: import("react-redux").ConnectedComponentClass<typeof MainPage, Pick<{}, never>>;
export {};
