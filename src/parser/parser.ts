import Token from '../token/token';
import TokenType, { tokenTypeList } from '../token/tokenType';
import ExpressionNode from './AST/expressionNode';
import StatementsNode from './AST/statementsNode';
import NumberNode from './AST/numberNode';
import VariableNode from './AST/variableNode';
import BinaryOperationNode from './AST/binaryOperationNode';
import UnaryOperationNode from './AST/unaryOperationNode';

export default class Parser {
    tokens: Token[];
    position: number = 0;
    scope: any = {};

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    match(...expected: TokenType[]): Token | null {
        if (this.position < this.tokens.length) {
            const currentToken = this.tokens[this.position];

            if (expected.find(type => type.name === currentToken.type.name)) {
                this.position += 1;
                return currentToken;
            }
        }

        return null;
    }

    require(...expected: TokenType[]): Token {
        const token = this.match(...expected);

        if (!token) {
            throw new Error(`At position: ${this.position} expected ${expected[0].name}`);
        }

        return token;
    }

    parseVariableOrNumber(): ExpressionNode {
        const number = this.match(tokenTypeList.NUMBER);
        const variable = this.match(tokenTypeList.VARIABLE);

        if (number != null) {
            return new NumberNode(number);
        }

        if (variable != null) {
            return new VariableNode(variable);
        }

        throw new Error(`A variable or number is expected at position: ${this.position}`)
    }

    parsePrint(): ExpressionNode {
        const operatorLog = this.match(tokenTypeList.LOG);
        
        if (operatorLog != null) {
            this.require(tokenTypeList.LEFT_PARENTHES);
            const expr = this.parseFormula();  
            this.require(tokenTypeList.RIGHT_PARENTHES);

            return new UnaryOperationNode(operatorLog, expr);
        }

        throw new Error(`The unary operator "log" is expected at position: ${this.position}`);
    }

    parseParentheses(): ExpressionNode {
        if (this.match(tokenTypeList.LEFT_PARENTHES) != null) {
            const node = this.parseFormula();
            this.require(tokenTypeList.RIGHT_PARENTHES);

            return node;
        } else {
            return this.parseVariableOrNumber();
        }
    }

    parseFormula(): ExpressionNode {
        let leftNode = this.parseParentheses();
        let operator= this.match(tokenTypeList.MINUS, tokenTypeList.PLUS);

        while (operator != null) {
            const rightNode = this.parseParentheses();

            leftNode = new BinaryOperationNode(operator, leftNode, rightNode);
            operator = this.match(tokenTypeList.MINUS, tokenTypeList.PLUS);
        }

        return leftNode;
    }

    parseExpression(): ExpressionNode {
        if (this.match(tokenTypeList.VARIABLE) == null) {
            const printNode = this.parsePrint();
            return printNode;
        }

        this.position -= 1;
        let variableNode = this.parseVariableOrNumber();
        const assignOperator = this.match(tokenTypeList.ASSIGN);

        if (assignOperator != null) {
            const rightFormulaNode = this.parseFormula();
            const binaryNode = new BinaryOperationNode(assignOperator, variableNode, rightFormulaNode);

            return binaryNode;
        }

        throw new Error(`After the variable, an assignment operator is expected at position: ${this.position}`)
    }

    parseCode(): ExpressionNode {
        const root = new StatementsNode();

        while (this.position < this.tokens.length) {
            const codeStringNode = this.parseExpression();
            this.require(tokenTypeList.SEMICOLON);
            root.addNode(codeStringNode);
        }

        return root;
    }

    run(node: ExpressionNode): any {
        if (node instanceof NumberNode) {
            return parseInt(node.number.text);
        }

        if (node instanceof UnaryOperationNode) {
            switch (node.operator.type.name) {
                case tokenTypeList.LOG.name:
                    console.log(this.run(node.operand));
                    return;
            }
        }

        if (node instanceof BinaryOperationNode) {
            switch (node.operator.type.name) {
                case tokenTypeList.PLUS.name:
                    return this.run(node.leftNode) + this.run(node.rightNode);
                case tokenTypeList.MINUS.name:
                    return this.run(node.leftNode) - this.run(node.rightNode);
                case tokenTypeList.ASSIGN.name:
                    const result = this.run(node.rightNode);
                    const variableNode = <VariableNode>node.leftNode;

                    this.scope[variableNode.variable.text] = result;
                    return result;
            }
        }

        if (node instanceof VariableNode) {
            if (this.scope[node.variable.text]) {
                return this.scope[node.variable.text];
            } else {
                throw new Error(`A variable named ${node.variable.text} not detected`);
            }
        }

        if (node instanceof StatementsNode) {
            node.codeStrings.forEach(codeString => {
                this.run(codeString);
            });

            return;
        }

        throw new Error(`Unknown Error!!!`);
    }
}