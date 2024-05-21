import Token from "../token/token";
import { tokenTypeList } from '../token/tokenType';

export default class Lexer {
    code: string;
    position: number = 0;
    tokenList: Token[] = [];

    constructor(code: string) {
        this.code = code;
    }

    lexerAnalyze(): Token[] {
        while (this.nextToken()) {}
        this.tokenList = this.tokenList.filter(token => token.type.name !== tokenTypeList.SPACE.name);

        return this.tokenList;
    }

    nextToken(): boolean {
        if(this.position >= this.code.length) {
            return false;
        }

        const tokenTypeValues = Object.values(tokenTypeList);

        for (let i = 0; i < tokenTypeValues.length; i++) {
            const tokenType = tokenTypeValues[i];
            const regex = new RegExp('^' + tokenType.regex);
            const result = this.code.substr(this.position).match(regex);

            if (result && result[0]) {
                const token = new Token(tokenType, result[0], this.position);
                this.position += result[0].length;
                this.tokenList.push(token);

                return true;
            }
        }

        throw new Error(`At position: ${this.position} detected error!`);
    }
}