import { Observable, Observer } from "rxjs";
import { ILoginRequest, IRegisterRequest } from "../dtos/auth";
import { IErrorResponse } from "../dtos/error";
import { IUser } from "../entities/IUser";
import HttpsCallableResult = firebase.functions.HttpsCallableResult;
import { getAuth, UserCredential } from "firebase/auth";

export const registerUser = (request: IRegisterRequest): Observable<IUser> => {
  return Observable.create((observer: Observer<IUser>) => {
    getAuth()
      .createUserWithEmailAndPassword(request.email, request.password)
      .then((response: UserCredential) => {
        const getGravatarUrl = firebase
          .functions()
          .httpsCallable("getGravatarUrl");
        getGravatarUrl({ email: request.email })
          .then((gravatarUrl: HttpsCallableResult) => {
            response!
              .user!.updateProfile({
                displayName: request.name,
                photoURL: gravatarUrl.data as string,
              })
              .then(() => {
                const user: IUser = {
                  displayName: request.name,
                  email: request.email,
                  photoURL: gravatarUrl.data as string,
                  uid: response!.user!.uid,
                };
                observer.next(user);
                observer.complete();
              })
              .catch((error: Error) => {
                const errorResponse: IErrorResponse = {
                  code: error.code,
                  message:
                    "Your account was created but something went wrong when setting your username. " +
                    "You can log in but please contact our support staff.",
                };
                observer.error(errorResponse);
                observer.complete();
              });
          })
          .catch((error: Error) => {
            const errorResponse: IErrorResponse = {
              code: error.code,
              message: error.message,
            };
            observer.error(errorResponse);
            observer.complete();
          });
      });
  });
};

export const loginUser = (request: ILoginRequest): Observable<void> => {
  return Observable.create((observer: Observer<void>) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(request.email, request.password)
      .then(() => {
        observer.complete();
      })
      .catch((error: Error) => {
        const errorResponse: IErrorResponse = {
          code: error.code,
          message: error.message.toString(),
        };
        observer.error(errorResponse);
        observer.complete();
      });
  });
};

export const forgotPassword = (email: string): Observable<void> => {
  return Observable.create((observer: Observer<void>) => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => observer.complete())
      .catch((error: Error) => {
        const errorResponse: IErrorResponse = {
          code: error.code,
          message: error.message,
        };
        observer.error(errorResponse);
        observer.complete();
      });
  });
};

export const logoutUser = (): Observable<void> => {
  return Observable.create((observer: Observer<void>) => {
    firebase
      .auth()
      .signOut()
      .then(() => observer.complete())
      .catch((error: Error) => {
        const errorResponse: IErrorResponse = {
          code: error.code,
          message: error.message,
        };
        observer.error(errorResponse);
        observer.complete();
      });
  });
};

export const changeUserName = (newName: string): Observable<void> => {
  return Observable.create((observer: Observer<void>) => {
    const user = firebase.auth().currentUser;
    if (user !== null) {
      user
        .updateProfile({
          displayName: newName,
          photoURL: user.photoURL,
        })
        .then(() => {
          observer.complete();
        })
        .catch((error: Error) => {
          const errorResponse: IErrorResponse = {
            code: error.code,
            message: error.message,
          };
          observer.error(errorResponse);
          observer.complete();
        });
    } else {
      const errorResponse: IErrorResponse = {
        code: "permission-denied",
        message: "Please sign in to change your name.",
      };
      observer.error(errorResponse);
      observer.complete();
    }
  });
};

export const changePassword = (
  oldPassword: string,
  newPassword: string
): Observable<void> => {
  return Observable.create((observer: Observer<void>) => {
    firebase
      .auth()
      .currentUser!.reauthenticateAndRetrieveDataWithCredential(
        EmailAuthProvider.credential(
          firebase.auth().currentUser!.email!,
          oldPassword
        )
      )
      .then(() => {
        firebase
          .auth()
          .currentUser!.updatePassword(newPassword)
          .then(() => {
            observer.complete();
          })
          .catch((error: Error) => {
            const errorResponse: IErrorResponse = {
              code: error.code,
              message: error.message,
            };
            observer.error(errorResponse);
            observer.complete();
          });
      })
      .catch((error: Error) => {
        const errorResponse: IErrorResponse = {
          code: error.code,
          message: error.message,
        };
        observer.error(errorResponse);
        observer.complete();
      });
  });
};

export const deleteAccount = (currentPassword: string): Observable<void> => {
  return Observable.create((observer: Observer<void>) => {
    firebase
      .auth()
      .currentUser!.reauthenticateAndRetrieveDataWithCredential(
        EmailAuthProvider.credential(
          firebase.auth().currentUser!.email!,
          currentPassword
        )
      )
      .then(() => {
        firebase
          .auth()
          .currentUser!.delete()
          .then(() => {
            observer.complete();
          })
          .catch((error: Error) => {
            const errorResponse: IErrorResponse = {
              code: error.code,
              message: error.message,
            };
            observer.error(errorResponse);
            observer.complete();
          });
      })
      .catch((error: Error) => {
        const errorResponse: IErrorResponse = {
          code: error.code,
          message: error.message,
        };
        observer.error(errorResponse);
        observer.complete();
      });
  });
};
