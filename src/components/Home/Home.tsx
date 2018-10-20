import * as React from "react";
import {connect} from "react-redux";

class HomePage extends React.Component {
  public render(): JSX.Element {
    return (
      <div className={"w3-container w3-panel"}>
        <section className={"w3-container w3-panel"}>
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

export const Home = connect(
)(HomePage);
