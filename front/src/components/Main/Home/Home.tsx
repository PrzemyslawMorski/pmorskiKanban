import * as React from "react";
import * as mockValueActions from "../../../actions/mockValueActions";

import {Classes, Intent, Spinner} from "@blueprintjs/core";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {IState} from "../../../store/storeStateInterface";

interface IHomePageProps {
  appName: string;
  loadMockValue: () => void;
}

class HomePage extends React.Component<IHomePageProps, {}> {
  constructor(props: IHomePageProps, context: any) {
    super(props, context);
    props.loadMockValue();
  }

  public render(): JSX.Element {
    return (
      <div>
        Loading... <Spinner className={Classes.SMALL} intent={Intent.PRIMARY}/>
      </div>
    );
  }
}

function mapStateToProps(state: IState) {
  return {
    appName: state.appName,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    loadMockValue: bindActionCreators(mockValueActions.loadMockValue, dispatch),
  };
}

export const Home = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);
