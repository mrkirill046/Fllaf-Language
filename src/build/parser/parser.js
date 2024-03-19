"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tokenType_1 = require("../token/tokenType");
var statementsNode_1 = __importDefault(require("./AST/statementsNode"));
var numberNode_1 = __importDefault(require("./AST/numberNode"));
var variableNode_1 = __importDefault(require("./AST/variableNode"));
var binaryOperationNode_1 = __importDefault(require("./AST/binaryOperationNode"));
var unaryOperationNode_1 = __importDefault(require("./AST/unaryOperationNode"));
var Parser = /** @class */ (function () {
    function Parser(tokens) {
        this.position = 0;
        this.scope = {};
        this.tokens = tokens;
    }
    Parser.prototype.match = function () {
        var expected = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            expected[_i] = arguments[_i];
        }
        if (this.position < this.tokens.length) {
            var currentToken_1 = this.tokens[this.position];
            if (expected.find(function (type) { return type.name === currentToken_1.type.name; })) {
                this.position += 1;
                return currentToken_1;
            }
        }
        return null;
    };
    Parser.prototype.require = function () {
        var expected = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            expected[_i] = arguments[_i];
        }
        var token = this.match.apply(this, expected);
        if (!token) {
            throw new Error("\u041D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 ".concat(this.position, " \u043E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F ").concat(expected[0].name));
        }
        return token;
    };
    Parser.prototype.parseVariableOrNumber = function () {
        var number = this.match(tokenType_1.tokenTypeList.NUMBER);
        var variable = this.match(tokenType_1.tokenTypeList.VARIABLE);
        if (number != null) {
            return new numberNode_1.default(number);
        }
        if (variable != null) {
            return new variableNode_1.default(variable);
        }
        throw new Error("\u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u0430\u044F \u0438\u043B\u0438 \u0447\u0438\u0441\u043B\u043E \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 ".concat(this.position));
    };
    Parser.prototype.parsePrint = function () {
        var operatorLog = this.match(tokenType_1.tokenTypeList.LOG);
        if (operatorLog != null) {
            this.require(tokenType_1.tokenTypeList.LEFT_PARENTHES);
            var expr = this.parseFormula();
            this.require(tokenType_1.tokenTypeList.RIGHT_PARENTHES);
            return new unaryOperationNode_1.default(operatorLog, expr);
        }
        throw new Error("\u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u0443\u043D\u0430\u0440\u043D\u044B\u0439 \u043E\u043F\u0435\u0440\u0430\u0442\u043E\u0440 \"log\" \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 ".concat(this.position));
    };
    Parser.prototype.parseParentheses = function () {
        if (this.match(tokenType_1.tokenTypeList.LEFT_PARENTHES) != null) {
            var node = this.parseFormula();
            this.require(tokenType_1.tokenTypeList.RIGHT_PARENTHES);
            return node;
        }
        else {
            return this.parseVariableOrNumber();
        }
    };
    Parser.prototype.parseFormula = function () {
        var leftNode = this.parseParentheses();
        var operator = this.match(tokenType_1.tokenTypeList.MINUS, tokenType_1.tokenTypeList.PLUS);
        while (operator != null) {
            var rightNode = this.parseParentheses();
            leftNode = new binaryOperationNode_1.default(operator, leftNode, rightNode);
            operator = this.match(tokenType_1.tokenTypeList.MINUS, tokenType_1.tokenTypeList.PLUS);
        }
        return leftNode;
    };
    Parser.prototype.parseExpression = function () {
        if (this.match(tokenType_1.tokenTypeList.VARIABLE) == null) {
            var printNode = this.parsePrint();
            return printNode;
        }
        this.position -= 1;
        var variableNode = this.parseVariableOrNumber();
        var assignOperator = this.match(tokenType_1.tokenTypeList.ASSIGN);
        if (assignOperator != null) {
            var rightFormulaNode = this.parseFormula();
            var binaryNode = new binaryOperationNode_1.default(assignOperator, variableNode, rightFormulaNode);
            return binaryNode;
        }
        throw new Error("\u041F\u043E\u0441\u043B\u0435 \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0439 \u043E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u043E\u043F\u0435\u0440\u0430\u0442\u043E\u0440 \u043F\u0440\u0438\u0441\u0432\u043E\u0435\u043D\u0438\u044F \u043D\u0430 \u043F\u043E\u0437\u0438\u0446\u0438\u0438 ".concat(this.position));
    };
    Parser.prototype.parseCode = function () {
        var root = new statementsNode_1.default();
        while (this.position < this.tokens.length) {
            var codeStringNode = this.parseExpression();
            this.require(tokenType_1.tokenTypeList.SEMICOLON);
            root.addNode(codeStringNode);
        }
        return root;
    };
    Parser.prototype.run = function (node) {
        var _this = this;
        if (node instanceof numberNode_1.default) {
            return parseInt(node.number.text);
        }
        if (node instanceof unaryOperationNode_1.default) {
            switch (node.operator.type.name) {
                case tokenType_1.tokenTypeList.LOG.name:
                    console.log(this.run(node.operand));
                    return;
            }
        }
        if (node instanceof binaryOperationNode_1.default) {
            switch (node.operator.type.name) {
                case tokenType_1.tokenTypeList.PLUS.name:
                    return this.run(node.leftNode) + this.run(node.rightNode);
                case tokenType_1.tokenTypeList.MINUS.name:
                    return this.run(node.leftNode) - this.run(node.rightNode);
                case tokenType_1.tokenTypeList.ASSIGN.name:
                    var result = this.run(node.rightNode);
                    var variableNode = node.leftNode;
                    this.scope[variableNode.variable.text] = result;
                    return result;
            }
        }
        if (node instanceof variableNode_1.default) {
            if (this.scope[node.variable.text]) {
                return this.scope[node.variable.text];
            }
            else {
                throw new Error("\u041F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u0430\u044F \u0441 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435\u043C ".concat(node.variable.text, " \u043D\u0435 \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D\u0430"));
            }
        }
        if (node instanceof statementsNode_1.default) {
            node.codeStrings.forEach(function (codeString) {
                _this.run(codeString);
            });
            return;
        }
        throw new Error("\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430!!!");
    };
    return Parser;
}());
exports.default = Parser;
