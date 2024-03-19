"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Token = /** @class */ (function () {
    function Token(type, text, position) {
        this.type = type;
        this.text = text;
        this.position = position;
    }
    return Token;
}());
exports.default = Token;
