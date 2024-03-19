import Token from "../../token/token";
import ExpressionNode from "./expressionNode";

export default class UnaryOperationNode {
    operator: Token;
    operand: ExpressionNode;

    constructor(operator: Token, operand: ExpressionNode) {
        this.operator = operator;
        this.operand = operand;
    }
}