import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { IUser } from "../../entities/IUser";
import { IState } from "../../store/storeStateInterface";
import { ChangeNameForm } from "./ChangeNameForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { DeleteAccountForm } from "./DeleteAccount";

interface IProfileProps {
  user: IUser | null;
}

export class ProfilePage extends React.Component<IProfileProps, any> {
  public render(): JSX.Element {
    if (this.props.user === null) {
      return <Redirect to="/" />;
    }

    return (
      <div
        className={"w3-container w3-panel w3-padding-large w3-center"}
        style={{ flex: "1", overflow: "auto" }}
      >
        <div
          className={
            "w3-container w3-border w3-border-black w3-margin w3-round-large"
          }
        >
          <h3>Profile</h3>
          <p>You can change your profile data here.</p>
        </div>

        <div>
          <div className={"w3-third w3-mobile"}>
            <ChangeNameForm user={this.props.user} />
          </div>
          <div className={"w3-third w3-mobile"}>
            <ChangePasswordForm />
          </div>
          <div className={"w3-third w3-mobile"}>
            <DeleteAccountForm email={this.props.user.email} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export const Profile = connect(mapStateToProps)(ProfilePage);
