import { Observable, Observer } from "rxjs";
import { ISearchUsersResponse } from "../dtos/responses";
import { ISearchUsersRequest } from "../dtos/requests";

export const searchUsersByEmail = (
  request: ISearchUsersRequest
): Observable<ISearchUsersResponse> => {
  return Observable.create((observer: Observer<ISearchUsersResponse>) => {
    firebase
      .functions()
      .httpsCallable("searchUsersByEmail")(request)
      .then((response) => {
        observer.next(response.data as ISearchUsersResponse);
        observer.complete();
      })
      .catch((err) => {
        observer.error(err);
        observer.complete();
      });
  });
};
