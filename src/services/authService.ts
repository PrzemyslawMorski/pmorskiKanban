import * as firebase from "firebase";
import {Observable, Observer} from "rxjs";
import {IErrorResponse, ILoginRequest, ILoginResponse, IRegisterRequest, IRegisterResponse} from "../dtos/auth";

export const registerUser = (request: IRegisterRequest): Observable<IRegisterResponse | IErrorResponse> => {
  return Observable.create((observer: Observer<IRegisterResponse | IErrorResponse>) => {
    firebase.auth().createUserWithEmailAndPassword(request.email, request.password)
      .then((response: firebase.auth.UserCredential) => {
        response!.user!.sendEmailVerification()
          .then(() => {
            response!.user!.updateProfile({
              displayName: request.name,
              photoURL: "", // TODO BACKEND TO SET PHOTO URL
            }).then(() => {
              const registerResponse: IRegisterResponse = {
                user: response!.user!,
              };

              observer.next(registerResponse);
            }).catch((error: firebase.auth.Error) => {
              const errorResponse: IErrorResponse = {
                error: "Your account was created but something went wrong when setting your username. " +
                  "You can log in but please contact our support staff.",
                errorCode: error.code,
              };
              observer.next(errorResponse);
            });
          })
          .catch((error: firebase.auth.Error) => {
            const errorResponse: IErrorResponse = {
              error: "Your account was created but something went wrong " +
                "when sending you an email confirmation email. " +
                "You can log in but please contact our support staff.",
              errorCode: error.code,
            };
            observer.next(errorResponse);
          });
      })
      .catch((error: firebase.auth.Error) => {
        const errorResponse: IErrorResponse = {
          error: error.message.toString(),
          errorCode: error.code,
        };
        observer.next(errorResponse);
      });
  });
};

export const loginUser = (request: ILoginRequest): Observable<ILoginResponse | IErrorResponse> => {
  return Observable.create((observer: Observer<ILoginResponse | IErrorResponse>) => {
    firebase.auth().signInWithEmailAndPassword(request.email, request.password)
      .then((response: firebase.auth.UserCredential) => {
        response!.user!.getIdToken()
          .then((token: string) => {
            const loginResponse: ILoginResponse = {
              accessToken: token,
              email: response!.user!.email!,
              uid: response!.user!.uid,
              username: response!.user!.displayName!,
            };
            observer.next(loginResponse);
          }).catch((error: firebase.auth.Error) => {
          const errorResponse: IErrorResponse = {
            error: error.message.toString(),
            errorCode: error.code,
          };
          observer.next(errorResponse);
        });
      }).catch((error: firebase.auth.Error) => {
      const errorResponse: IErrorResponse = {
        error: error.message.toString(),
        errorCode: error.code,
      };
      observer.next(errorResponse);
    });
  });
};
