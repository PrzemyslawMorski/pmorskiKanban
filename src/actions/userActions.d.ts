import * as firebase from "firebase";
export declare const userSignedIn: (user: firebase.User) => {
    type: "USER_SIGNED_IN";
    payload: firebase.User;
};
export declare const userSignedOut: () => {
    type: "USER_SIGNED_OUT";
};
