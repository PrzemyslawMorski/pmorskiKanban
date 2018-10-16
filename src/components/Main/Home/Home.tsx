import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import * as mockValueActions from "../../../actions/mockValueActions";
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
        <section>
          <span>Welcome to PmorskiKanban!</span><br/><br/>
          <span>This website is designed to make your small project complete without hickups.</span><br/><br/>
          <span>Using the Kanban method you can schedule your work to maximise productivity.</span><br/><br/>
          <span>The Kanban method was designed for lean manufacturing </span>
          <span>and it's perfect for personal or small-team projects.</span><br/><br/>
          <span>PmorskiKanban allows for regular Kanban workflows using a drag&drop system</span>
          <span>and collaboration within a small team.</span>
          <span>You can comment tasks and upload attachments to these tasks.</span><br/><br/>
          <span>Tasks can be tagged, filtered and assigned to team-members.</span><br/><br/>
          <span>When someone mentions you in a comment you will be notified about it via email.</span><br/><br/>
          <span>PmorskiKanban also offers a permissions system - </span>
          <span>a method of dividing team-members based on their allowed actions</span>
          <span>(moving tasks, editing them, commenting on them etc.)</span>
        </section>
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
