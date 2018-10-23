"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const buildGravatarURL_1 = require("./buildGravatarURL");
const admin = require("firebase-admin");
exports.getBoardMiniatures = functions.https.onCall((uid) => {
    console.log('getBoardsMiniatures');
    const boardsCollection = admin.firestore().collection("boards");
    const field = "ownerId";
    const operator = "==";
    const response = boardsCollection.where(field, operator, uid);
    console.log('getBoardsMiniatures' + response.toString());
    return response;
});
exports.getGravatarUrl = functions.https.onCall((email) => {
    return buildGravatarURL_1.buildGravatarUrl(email);
});
//# sourceMappingURL=index.js.map