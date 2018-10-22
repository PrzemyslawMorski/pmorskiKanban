import * as React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {IUser} from "../../entities/IUser";
import {IState} from "../../store/storeStateInterface";
import {ChangeNameForm} from "./ChangeNameForm";
import {ChangePasswordForm} from "./ChangePasswordForm";
import {DeleteAccountComponent} from "./DeleteAccount";

interface IProfileProps {
  user: IUser | null;
}

export class ProfilePage extends React.Component<IProfileProps, any> {
  public render(): JSX.Element {
    if (this.props.user === null) {
      return <Redirect to="/"/>;
    }

    return (
      <div className={"w3-container w3-panel w3-padding-large w3-center"}>
        <div className={"w3-container w3-border w3-border-gray w3-margin"}>
          <h3>Profile</h3>
          <p>You can change your profile data here.</p>
          <p><b>Note that when signing in with a third party provider you can't change your user data here.</b></p>
        </div>

        <div>
          <div className={"w3-third w3-mobile"}>
            <ChangeNameForm user={this.props.user} isExternalProviderAccount={false}/>
          </div>
          <div className={"w3-third w3-mobile"}>
            <ChangePasswordForm isExternalProviderAccount={false}/>
          </div>
          <div className={"w3-third w3-mobile"}>
            <DeleteAccountComponent email={this.props.user.email} isExternalProviderAccount={false}/>
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
