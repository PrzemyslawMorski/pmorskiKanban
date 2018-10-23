import * as React from "react";
import {connect} from "react-redux";
import {IBoardMiniature} from "../../entities/IBoard";

interface IBoardsPageProps {
  boards: IBoardMiniature[];
}

class BoardsPage extends React.Component<IBoardsPageProps> {
  public render(): JSX.Element {
    return (
      <div className={"w3-container w3-panel"}>
        Your boards
      </div>
    );
  }
}

export const Boards = connect()(BoardsPage);
