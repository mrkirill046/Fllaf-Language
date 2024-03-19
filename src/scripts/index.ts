#! /usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import Lexer from './lexer/lexer';
import Parser from './parser/parser';

const filename = process.argv[2];

if (!filename) {
    console.log('Пожалуйста, укажите имя файла');
    process.exit(1);
}

const fileWithExtension = filename.endsWith('.fllaf') ? filename : `${filename}.fllaf`;

if (!fs.existsSync(fileWithExtension)) {
    console.log(`Файл ${fileWithExtension} не найден`);
    process.exit(1);
}

const code = fs.readFileSync(path.resolve(fileWithExtension), 'utf-8');
const lexer = new Lexer(code);

lexer.lexerAnalyze();

const parser = new Parser(lexer.tokenList);
const rootNode = parser.parseCode();

parser.run(rootNode);