"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceText = void 0;
const replaceText = (template, replacements) => {
    return template.replace(/{{(.*?)}}/g, (match, p1) => replacements[p1] || match);
};
exports.replaceText = replaceText;
