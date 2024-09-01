import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { hideAlert } from "../../actions/alertActions";
import { IAlert } from "../../entities/IAlert";
import { IState } from "../../store/storeStateInterface";

interface IAlertProps {
  alert: IAlert | null;
  hideAlert: () => void;
}

class AlertComponent extends React.Component<IAlertProps> {
  private closeAlertTimeoutId: number = 0;

  constructor(props: IAlertProps) {
    super(props);
    this.closeAlert = this.closeAlert.bind(this);
  }

  public render() {
    if (this.props.alert !== null) {
      this.closeAlertTimeoutId = window.setTimeout(
        () => this.closeAlert(),
        this.props.alert!.duration
      );

      const alertClassName: string =
        "w3-panel w3-display-topmiddle w3-display-container w3-card-4 w3-round-large " +
        this.props.alert.color;

      return (
        <div className={alertClassName} style={{ width: "60%" }}>
          <span
            onClick={this.closeAlert}
            className="w3-button w3-display-topright"
          >
            &times;
          </span>
          <p>{this.props.alert.text}</p>
        </div>
      );
    } else {
      return null;
    }
  }

  private closeAlert() {
    clearTimeout(this.closeAlertTimeoutId);
    this.props.hideAlert();
  }
}

const mapStateToProps = (state: IState) => ({
  alert: state.alert,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hideAlert: () => dispatch(hideAlert()),
});

export const Alert = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertComponent);
