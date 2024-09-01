import { Observable, Observer } from "rxjs";
import { ICreateAttachmentResponse } from "../dtos/responses";

export const uploadFile = (
  file: File,
  attachmentId: string
): Observable<{ data: ICreateAttachmentResponse }> => {
  return Observable.create(
    (observer: Observer<{ data: ICreateAttachmentResponse }>) => {
      const storage = firebase.storage().ref();
      const metadata = {
        contentType: file.type,
      };

      const uploadTask = storage
        .child("attachments/" + attachmentId + "." + file.name)
        .put(file, metadata);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: any) => {
          // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              break;
          }
        },
        (error) => {
          observer.error(error);
          observer.complete();
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL: string) => {
              const response = {
                data: { attachmentId, url: downloadURL },
              };
              observer.next(response);
              observer.complete();
            })
            .catch((err) => {
              observer.error(err);
              observer.complete();
            });
        }
      );
    }
  );
};
