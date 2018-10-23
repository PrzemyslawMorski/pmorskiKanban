"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const buildGravatarURL_1 = require("./buildGravatarURL");
const admin = require("firebase-admin");
exports.getGravatarUrl = functions.https.onCall((email) => {
    return buildGravatarURL_1.buildGravatarUrl(email);
});
exports.getBoardMiniatures = functions.https.onCall((uid) => {
    const boardsCollection = admin.firestore().collection("boards");
    const field = "ownerId";
    const operator = "==";
    return boardsCollection.where(field, operator, uid);
});
//# sourceMappingURL=index.js.map