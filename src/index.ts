#! /usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import Lexer from './lexer/lexer';
import Parser from './parser/parser';

function startInterpreter(code: string) {
    const lexer = new Lexer(code);
    lexer.lexerAnalyze();
    const parser = new Parser(lexer.tokenList);
    const rootNode = parser.parseCode();
    parser.run(rootNode);
}

const filename = process.argv[2];
let code: string;
const version = "1.0.0";

if (filename) {
    if (filename === '-V' || filename === '--version' || filename === '-v') {
        console.log(`Fllaf version ${version}`);
        process.exit(0);
    }

    const fileWithExtension = filename.endsWith('.fllaf') ? filename : `${filename}.fllaf`;

    if (!fs.existsSync(fileWithExtension)) {
        console.log(`File ${fileWithExtension} not found`);
        process.exit(1);
    }

    code = fs.readFileSync(path.resolve(fileWithExtension), 'utf-8');
    startInterpreter(code);
} else {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const getInput = () => {
        rl.question('>>> ', (input) => {
            if (input !== "exit") {
                code = input;
                startInterpreter(code);

                // запрашиваем следующую команду
                getInput();
            } else {
                rl.close();
            }
        });
    }

    getInput();

    rl.on('close', () => {
        process.exit(0);
    });
}