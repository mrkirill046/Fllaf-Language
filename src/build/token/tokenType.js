"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenTypeList = void 0;
var TokenType = /** @class */ (function () {
    function TokenType(name, regex) {
        this.name = name;
        this.regex = regex;
    }
    return TokenType;
}());
exports.default = TokenType;
exports.tokenTypeList = {
    'NUMBER': new TokenType('NUMBER', '[0-9]*'),
    'LOG': new TokenType('LOG', 'log'),
    'VARIABLE': new TokenType('VARIABLE', '[a-z]*[а-я]*'),
    'SEMICOLON': new TokenType('SEMICOLON', ';'),
    'SPACE': new TokenType('SPACE', '[ \\n\\t\\r ]'),
    'ASSIGN': new TokenType('ASSIGN', '='),
    'PLUS': new TokenType('PLUS', '\\+'),
    'MINUS': new TokenType('MINUS', '\\-'),
    'LEFT_PARENTHES': new TokenType('LEFT_PARENTHES', '\\('),
    'RIGHT_PARENTHES': new TokenType('RIGHT_PARENTHES', '\\)')
};
