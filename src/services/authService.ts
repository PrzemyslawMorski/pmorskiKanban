import * as firebase from "firebase";
import {Observable, Observer} from "rxjs";
import {IErrorResponse, ILoginRequest, IRegisterRequest} from "../dtos/auth";
import HttpsCallableResult = firebase.functions.HttpsCallableResult;

export const registerUser = (request: IRegisterRequest): Observable<void> => {
  return Observable.create((observer: Observer<void>) => {
    firebase.auth().createUserWithEmailAndPassword(request.email, request.password)
      .then((response: firebase.auth.UserCredential) => {
        response!.user!.sendEmailVerification()
          .then(() => {
            const getGravatarUrl = firebase.functions().httpsCallable("getGravatarUrl");
            getGravatarUrl(request.email)
              .then((gravatarUrl: HttpsCallableResult) => {
                response!.user!.updateProfile({
                  displayName: request.name,
                  photoURL: gravatarUrl.data as string,
                })
                  .then(() => {
                    observer.complete();
                  })
                  .catch((error: firebase.auth.Error) => {
                    const errorResponse: IErrorResponse = {
                      error: "Your account was created but something went wrong when setting your username. " +
                        "You can log in but please contact our support staff.",
                      errorCode: error.code,
                    };
                    observer.error(errorResponse);
                  });
              });
          })
          .catch((error: firebase.auth.Error) => {
            const errorResponse: IErrorResponse = {
              error: "Your account was created but something went wrong " +
                "when sending you an email verification email. " +
                "You can log in but please contact our support staff.",
              errorCode: error.code,
            };
            observer.error(errorResponse);
          });
      })
      .catch((error: firebase.auth.Error) => {
        const errorResponse: IErrorResponse = {
          error: error.message.toString(),
          errorCode: error.code,
        };
        observer.error(errorResponse);
      });
  });
};

export const loginUser = (request: ILoginRequest): Observable<void> => {
  return Observable.create((observer: Observer<void>) => {
    firebase.auth().signInWithEmailAndPassword(request.email, request.password)
      .then((response: firebase.auth.UserCredential) => {
        if (response!.user!.emailVerified === false) {
          alert("Please verify your email.");
        }
        observer.complete();
      })
      .catch((error: firebase.auth.Error) => {
        const errorResponse: IErrorResponse = {
          error: error.message.toString(),
          errorCode: error.code,
        };
        observer.error(errorResponse);
      });
  });
};

export const forgotPassword = (email: string): Observable<void> => {
  return Observable.create((observer: Observer<null | IErrorResponse>) => {
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => observer.complete())
      .catch((error: firebase.auth.Error) => {
        const errorResponse: IErrorResponse = {
          error: error.message,
          errorCode: error.code,
        };
        observer.error(errorResponse);
      });
  });
};

export const logoutUser = (): Observable<void> => {
  return Observable.create((observer: Observer<void>) => {
    firebase.auth().signOut()
      .then(() => {
        observer.complete();
      })
      .catch((error: firebase.auth.Error) => {
        const errorResponse: IErrorResponse = {
          error: error.message,
          errorCode: error.code,
        };
        observer.error(errorResponse);
      });
  });
};

export const changeUserName = (newName: string): Observable<void> => {
  return Observable.create((observer: Observer<void>) => {
    const user = firebase.auth().currentUser;
    if (user !== null) {
      user.updateProfile({
        displayName: newName,
        photoURL: user.photoURL,
      })
        .then(() => {
          observer.complete();
        })
        .catch((error: firebase.auth.Error) => {
          const errorResponse: IErrorResponse = {
            error: error.message,
            errorCode: error.code,
          };
          observer.error(errorResponse);
        });
    } else {
      alert("Please sign in to change your name.");
      observer.complete();
    }
  });
};
