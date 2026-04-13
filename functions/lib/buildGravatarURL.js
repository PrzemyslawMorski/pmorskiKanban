"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGravatarUrl = void 0;
const md5Hasher = require("md5");
const buildGravatarUrl = (email) => `http://www.gravatar.com/avatar/${md5Hasher(email)}.jpg?s=80`;
exports.buildGravatarUrl = buildGravatarUrl;
//# sourceMappingURL=buildGravatarURL.js.map