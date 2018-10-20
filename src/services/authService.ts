import * as firebase from "firebase";
import {Observable, Observer} from "rxjs";
import {IErrorResponse, ILoginRequest, ILoginResponse, IRegisterRequest, IRegisterResponse} from "../dtos/auth";

export const registerUser = (request: IRegisterRequest): Observable<IRegisterResponse> => {
  return Observable.create((observer: Observer<IRegisterResponse>) => {
    firebase.auth().createUserWithEmailAndPassword(request.email, request.password)
      .then((response: firebase.auth.UserCredential) => {
        response!.user!.sendEmailVerification()
          .then(() => {
            response!.user!.updateProfile({
              displayName: request.name,
              photoURL: "", // TODO BACKEND TO SET PHOTO URL
            }).then(() => {
              observer.complete();
            }).catch((error: firebase.auth.Error) => {
              const errorResponse: IErrorResponse = {
                error: "Your account was created but something went wrong when setting your username. " +
                  "You can log in but please contact our support staff.",
                errorCode: error.code,
              };
              observer.error(errorResponse);
            });
          })
          .catch((error: firebase.auth.Error) => {
            const errorResponse: IErrorResponse = {
              error: "Your account was created but something went wrong " +
                "when sending you an email confirmation email. " +
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

export const loginUser = (request: ILoginRequest): Observable<ILoginResponse> => {
  return Observable.create((observer: Observer<ILoginResponse | IErrorResponse>) => {
    firebase.auth().signInWithEmailAndPassword(request.email, request.password)
      .then((response: firebase.auth.UserCredential) => {
        if (!response!.user!.emailVerified) {
          const errorResponse: IErrorResponse = {
            error: "Please verify your email.",
            errorCode: "auth/email-not-verified",
          };
          observer.error(errorResponse);
        } else {
          response!.user!.getIdToken()
            .then((token: string) => {
              const loginResponse: ILoginResponse = {
                accessToken: token,
                email: response!.user!.email!,
                photoURL: response!.user!.photoURL!,
                uid: response!.user!.uid,
                username: response!.user!.displayName!,
              };
              observer.next(loginResponse);
            })
            .catch((error: firebase.auth.Error) => {
              const errorResponse: IErrorResponse = {
                error: error.message.toString(),
                errorCode: error.code,
              };
              observer.error(errorResponse);
            });
        }
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

export const forgotPassword = (email: string): Observable<null | IErrorResponse> => {
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

export const logoutUser = (): Observable<null | IErrorResponse> => {
  return Observable.create((observer: Observer<null | IErrorResponse>) => {
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
