import Token from "../../token/token";

export default class NumberNode {
    number: Token;

    constructor(number: Token) {
        this.number = number;
    }
}