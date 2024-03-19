"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = __importDefault(require("../token/token"));
var tokenType_1 = require("../token/tokenType");
var Lexer = /** @class */ (function () {
    function Lexer(code) {
        this.position = 0;
        this.tokenList = [];
        this.code = code;
    }
    Lexer.prototype.lexerAnalyze = function () {
        while (this.nextToken()) { }
        this.tokenList = this.tokenList.filter(function (token) { return token.type.name !== tokenType_1.tokenTypeList.SPACE.name; });
        return this.tokenList;
    };
    Lexer.prototype.nextToken = function () {
        if (this.position >= this.code.length) {
            return false;
        }
        var tokenTypeValues = Object.values(tokenType_1.tokenTypeList);
        for (var i = 0; i < tokenTypeValues.length; i++) {
            var tokenType = tokenTypeValues[i];
            var regex = new RegExp('^' + tokenType.regex);
            var result = this.code.substr(this.position).match(regex);
            if (result && result[0]) {
                var token = new token_1.default(tokenType, result[0], this.position);
                this.position += result[0].length;
                this.tokenList.push(token);
                return true;
            }
        }
        throw new Error("\u041D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 ".concat(this.position, " \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D\u0430 \u043E\u0448\u0438\u0431\u043A\u0430!"));
    };
    return Lexer;
}());
exports.default = Lexer;
