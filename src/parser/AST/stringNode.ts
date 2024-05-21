import Token from "../../token/token";
import ExpressionNode from "./expressionNode";

export default class StringNode extends ExpressionNode {
    string: Token;

    constructor(string: Token) {
        super();
        this.string = string;
    }
}