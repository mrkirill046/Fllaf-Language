export default class TokenType {
    name: string;
    regex: string;

    constructor(name: string, regex: string) {
        this.name = name;
        this.regex = regex;
    }
}

export const tokenTypeList = {
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
}
