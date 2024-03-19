import ExpressionNode from "./expressionNode";
import Token from '../../token/token';

export default class VariableNode extends ExpressionNode {
    variable: Token;

    constructor(variable: Token) {
        super();

        this.variable = variable;
    }
}