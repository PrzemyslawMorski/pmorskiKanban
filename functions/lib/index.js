"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const buildGravatarURL_1 = require("./buildGravatarURL");
exports.getGravatarUrl = functions.https.onCall((email) => {
    return buildGravatarURL_1.buildGravatarUrl(email);
});
//# sourceMappingURL=index.js.map