#! /usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var lexer_1 = __importDefault(require("./lexer/lexer"));
var parser_1 = __importDefault(require("./parser/parser"));
var filename = process.argv[2];
if (!filename) {
    console.log('Пожалуйста, укажите имя файла');
    process.exit(1);
}
var fileWithExtension = filename.endsWith('.fllaf') ? filename : "".concat(filename, ".fllaf");
if (!fs.existsSync(fileWithExtension)) {
    console.log("\u0424\u0430\u0439\u043B ".concat(fileWithExtension, " \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D"));
    process.exit(1);
}
var code = fs.readFileSync(path.resolve(fileWithExtension), 'utf-8');
var lexer = new lexer_1.default(code);
lexer.lexerAnalyze();
var parser = new parser_1.default(lexer.tokenList);
var rootNode = parser.parseCode();
parser.run(rootNode);
