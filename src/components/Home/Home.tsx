import * as React from "react";

export class Home extends React.Component {
  public render(): JSX.Element {
    return (
      <div className={"w3-container w3-panel w3-center"}>
        <div className={"w3-container w3-border w3-border-gray"}>
          <h3>Welcome to PmorskiKanban!</h3>
        </div>

        <div className={"w3-container"}>
          <p>This website is designed to make your small project complete without hickups.</p>
          <p>Using the Kanban method you can schedule your work to maximise productivity.</p>
          <p>The Kanban method was designed for lean manufacturing
            and it's perfect for personal or small-team projects.</p>
        </div>

        <div className={"w3-container"}>
          <p>PmorskiKanban allows for regular Kanban workflows using a drag&drop system and collaboration within a small
            team.</p>
          <p>You can comment tasks and upload attachments to these tasks.</p>
          <p>Tasks can be tagged, filtered and assigned to team-members.</p>
          <p>When someone mentions you in a comment you will be notified about it via email.</p>
          <p>PmorskiKanban also offers a permissions system - a method of dividing team-members based on their allowed
            actions (moving tasks, editing them, commenting on them etc.)</p>
        </div>
      </div>
    );
  }
}
