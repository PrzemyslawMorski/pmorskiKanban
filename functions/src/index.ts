import * as functions from "firebase-functions";
import {buildGravatarUrl} from "./buildGravatarURL";

export const getGravatarUrl = functions.https.onCall((email: string) => {
  return buildGravatarUrl(email);
});
