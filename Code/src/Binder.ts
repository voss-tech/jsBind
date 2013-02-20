/// <reference path="BindingExpression.ts" />
/// <reference path="ForEachBinding.ts" />
/// <reference path="PropBinding.ts" />
/// <reference path="EventBinding.ts" />
/// <reference path="TemplateBinding.ts" />

/// <reference path="Expression.ts" />
/// <reference path="LiteralExpression.ts" />
/// <reference path="BinaryOperatorExpression.ts" />
/// <reference path="PreUnaryOperatorExpression.ts" />
/// <reference path="PostUnaryOperatorExpression.ts" />
/// <reference path="FunctionCallExpression.ts" />
/// <reference path="VariableReferenceExpression.ts" />
/// <reference path="DereferenceExpression.ts" />
/// <reference path="ConditionExpression.ts" />
/// <reference path="ArrayIndexExpression.ts" />
/// <reference path="ArrayExpression.ts" />
/// <reference path="KeywordExpression.ts" />

module jsBind {
    export class Binder {
        constructor(element: Node, dataContext: any, parentContext: any = null) {
            this.setup(element, dataContext, parentContext);
        }

        private setup(node: Node, dataContext: any, parentContext: any) {
            if (node instanceof HTMLElement) {
                var element = <HTMLElement> node;

                if (element.hasAttribute("data-jsBind")) {
                    var bindExpr = element.getAttribute("data-jsBind");

                    this.parseBindings(bindExpr, element, dataContext, parentContext);
                }
            }

            var nodes = node.childNodes;
            var nodesLen = nodes.length;
            for (var i = 0; i < nodesLen; i++) {
                this.setup(nodes[i], dataContext, parentContext);
            }
        }

        private expectToken(category: SymbolCategory, name: string): void {
            if (!(this._sym.category == category) && (this._sym.name == name)) {
                throw "Expected '" + name + "'.";
            }
        }

        private parseBindings(expr: string, element: HTMLElement, dataContext: any, parentContext: any): BindingExpression[]{
            var result: BindingExpression[] = [];

            // Intialise the tokeniser
            this._expr = expr;
            this._len = expr.length;
            this._pos = 0;

            this.nextChar();

            // Get the first token
            this.getToken();

            while (this._sym.category != SymbolCategory.eof) {

                if (this._sym.category != SymbolCategory.identifier) {
                    throw "Expected identifier";
                }

                // Parse the binding kind keyword
                switch (this._sym.name) {
                    case "prop": {
                        var tok = this.getToken();
                        this.expectToken(SymbolCategory.punctuation, ":");

                        tok = this.getToken();
                        if (tok.category != SymbolCategory.identifier) {
                            throw "Expected identifier";
                        }

                        var properties: string[] = [];
                        do {
                            properties.push(tok.name);

                            tok = this.getToken();

                            if ((tok.category == SymbolCategory.punctuation) && (tok.name == ".")) {
                                tok = this.getToken();
                            }
                        } while (tok.category == SymbolCategory.identifier);

                        this.expectToken(SymbolCategory.operator, "=");
                        this.getToken();

                        new PropBinding(element, new BindingExpression(properties, this.parseExpression()), dataContext, parentContext);
                        break;
                    }

                    case "forEach": {
                        this.getToken();

                        new ForEachBinding(element, new BindingExpression(null, this.parseExpression()), dataContext, parentContext);
                        break;
                    }

                    case "event": {
                        var tok = this.getToken();
                        this.expectToken(SymbolCategory.punctuation, ":")

                        tok = this.getToken();
                        if (tok.category != SymbolCategory.identifier) {
                            throw "Expected identifier";
                        }

                        var eventName = tok.name;
                        tok = this.getToken();
                        this.expectToken(SymbolCategory.operator, "=")

                        this.getToken();
                        new EventBinding(element, eventName, this.parseExpression(), dataContext, parentContext);
                        break;
                    }

                    case "template": {
                        var tok = this.getToken();
                        this.expectToken(SymbolCategory.punctuation, ":")

                        tok = this.getToken();
                        if (tok.category != SymbolCategory.identifier) {
                            throw "Expected identifier";
                        }

                        var templateSource = tok.name;
                        tok = this.getToken();
                        this.expectToken(SymbolCategory.operator, "=")

                        this.getToken();

                        new TemplateBinding(element, templateSource, new BindingExpression(null, this.parseExpression()), dataContext, parentContext);
                        break;
                    }

                    default: {
                        throw "Unexpected binding type '" + this._sym.name + "'.";
                    }
                }

                this.getToken();
            }

            return result;
        }

        private parseBindingExpression(expr: string): Expression {
            // Intialise the tokeniser
            this._expr = expr;
            this._len = expr.length;
            this._pos = 0;

            this.nextChar();

            // Get the first token
            this.getToken();

            return this.parseExpression();
        }

//#region Tokeniser
        private _expr: string;
        private _ch: string;    // The latest char read
        private _len: number;
        private _pos: number = 0;

        private nextChar(): string {
            // Handle end of input
            if (this._pos >= this._len) {
                this._ch = "\x00";
            } else {
                this._ch = this._expr[this._pos];
            }
            this._pos++;
            return this._ch;
        }

        private isWhiteSpace(c: string): bool {
            return c == " " || c == "\t" || c == "\r" || c == "\n";
        }

        private isHexDigit(c: string): bool {
            return ((c >= '0') && (c <= '9')) || ((c >= 'a') && (c <= 'f')) || ((c >= 'A') && (c <= 'F'));
        }

        private isDecimalDigit(c: string): bool {
            return (c >= '0') && (c <= '9');
        }

        private isOctalDigit(c: string): bool {
            return (c >= '0') && (c <= '7');
        }

        private isLetter(c: string): bool {
            return (c >= 'a') && (c <= 'z') || (c >= 'A') && (c <= 'Z');
        }

        private operators = ["++",
            "--",
            "+",
            "-",
            "!",
            "~",
            "&",
            "|",
            "^",
            "*",
            "/",
            "%",
            ">>",
            "<<",
            ">>>",
            "<",
            ">",
            "<=",
            ">=",
            "==",
            "===",
            "!=",
            "!==",
            "?",
            "=",
            "+=",
            "-=",
            "/=",
            "*=",
            "%=",
            ">>=",
            "<<=",
            ">>>=",
            "|=",
            "^=",
            "&=",
            "&&",
            "||"
        ];

        private isOperator(c: string): bool {
            return this.operators.indexOf(c) != -1;
        }

        private parseOperatorToken(): Symbol {
            var str = "";
            var c = this._ch;
            do {
                str += c;
                c = this.nextChar();
            } while (this.isOperator(str + c));

            return new Symbol(str, SymbolCategory.operator);
        }

        private isPunctuation(c: string): bool {
            return "[]{ } (),;:".indexOf(c) != -1;
        }

        private keywords: string[] = ["true", "false", "null", "undefined"];

        private isKeyword(c: string): bool {
            return this.keywords.indexOf(c) != -1;
        }

        private parseNumber() {
            var c = this._ch;

            var num = "";

            if (c === '0') {
                // Parse Octal or Hex
                num += c;
                c = this.nextChar();
                if ((c == 'x') || (c == 'X')) {
                    // Hex
                    do {
                        num += c;
                        c = this.nextChar();
                    } while (this.isHexDigit(c));

                    return new Symbol(parseInt(num, 8), SymbolCategory.literalNumber);
                } else if (this.isOctalDigit(c)) {
                    do {
                        num += c;
                        c = this.nextChar();
                    } while (this.isOctalDigit(c));

                    return new Symbol(parseInt(num, 16), SymbolCategory.literalNumber);
                }
            }

            var isFloat = false;
            if (c !== '.') {
                // Parse digits up until a decimal place
                do {
                    num += c;
                    c = this.nextChar();
                } while (this.isDecimalDigit(c));
            }

            // Parse digits after a decimal place
            if (c === '.') {
                isFloat = true;

                do {
                    num += c;
                    c = this.nextChar();
                } while (this.isDecimalDigit(c));
            }

            // Handle scientific notation
            if (c === 'e' || c === 'E') {
                isFloat = true;
                num += c;
                c = this.nextChar();
                if (c === '+' || c === '-' || this.isDecimalDigit(c)) {
                    do {
                        num += c;
                        c = this.nextChar();
                    } while (this.isDecimalDigit(c));
                } else {
                    throw "Unexpected character after the exponent sign while parsing number.";
                }
            }

            if (num == ".") {
                return new Symbol(".", SymbolCategory.punctuation);
            } else if (isFloat) {
                return new Symbol(parseFloat(num), SymbolCategory.literalNumber);
            } else {
                return new Symbol(parseInt(num, 10), SymbolCategory.literalNumber);
            }
        }


        private parseString() {
            var start = this._pos;
            var endChar = this._ch;
            var str: string = "";

            var c = this.nextChar();
            while (c != '\x00' && c != endChar) {
                if (c == '\\') {
                    c = this.nextChar();
                }

                str += c;

                c = this.nextChar();
            }
            this.nextChar();

            return new Symbol(str, SymbolCategory.literalString);
        }

        private parseIdentifier() : string {
            var start = this._pos - 1;

            var c = this.nextChar();
            while (this.isLetter(c) || this.isDecimalDigit(c) || c == "_" || c == "$") {

                c = this.nextChar();
            }

            var identifier = this._expr.substring(start, this._pos - 1);

            return identifier;
        }

        private getToken(): Symbol {
            this._sym = this.parseToken();
            return this._sym;
        }

        private parseToken(): Symbol {
            var c = this._ch;

            // Skip whitespace
            while (this.isWhiteSpace(c)) {
                c = this.nextChar();
            }

            if (this.isDecimalDigit(c) || c == '.') {
                return this.parseNumber();
            } else if ((c == "\"") || (c == "'")) {
                return this.parseString();
            } else if (this.isLetter(c) || c == "_" || c == "$") {
                var idenifier = this.parseIdentifier();
                if (this.isKeyword(idenifier)) {
                    return new Symbol(idenifier, SymbolCategory.keyword);
                } else {
                    return new Symbol(idenifier, SymbolCategory.identifier);
                }
            } else if (c == "\x00") {
                return new Symbol("", SymbolCategory.eof);
            } else if (this.isOperator(c)) {
                return this.parseOperatorToken();
            } else if (this.isPunctuation(c)) {
                this.nextChar();
                return new Symbol(c, SymbolCategory.punctuation);
            }

            alert("unknown token '" + c + "'.");

            return null;
        }
//#endregion

//#region parser

        private isUnaryPrefix(op: string) {
            return ["typeof", "--", "++", "!", "~", "-", "+" ].indexOf(op) != -1;
        }

        private isUnaryPostfix(op: string) {
            return ["--", "++"].indexOf(op) != -1;
        }

        private static operatorPrecidences: { [key: string]: number; } = {
            "||": 1,
            "&&": 2,
            "|": 3,
            "^": 4,
            "&": 5,
            "==": 6, "===": 6, "!=": 6, "!==": 6,
            "<": 7, ">": 7, "<=": 7, ">=": 7, "in": 7, "instanceof": 7,
            ">>": 8, "<<": 8, ">>>": 8,
            "+": 9, "-": 9,
            "*":10, "/":10, "%":10
        };

        private getOperatorPrecidence(op: string): number {
            return Binder.operatorPrecidences[op];
        }

        private _sym: Symbol;

        // Expression = [ "-", "+", "*=", "+=", "/=", "*=" ] Term | Term ( "+" | "-" ) Term
        private parseExpression(): Expression {
            return this.parseBrackets(() => this.parseConditional());
        }

        private parseConditional(): Expression {
            var cond = this.parseOperators();

            if ((this._sym.category == SymbolCategory.operator) && (this._sym.name == "?")) {
                this.getToken();
                var trueExpr = this.parseExpression();

                this.expectToken(SymbolCategory.punctuation, ":");

                this.getToken();
                var falseExpr = this.parseExpression();

                return new ConditionExpression(cond, trueExpr, falseExpr);
            }

            return cond;
        }

        private parseOperators(): Expression {
            return this.parseOperator(this.parseUnaryOperators(), 0);
        }

        private parseUnaryOperators(): Expression {
            if ((this._sym.category == SymbolCategory.operator) && this.isUnaryPrefix(this._sym.name)) {
                var op = this._sym.name;
                this.getToken();

                return new PreUnaryOperatorExpression(op, this.parseUnaryOperators());
            }

            var atom = this.parseAtom();

            if ((this._sym.category == SymbolCategory.operator) && this.isUnaryPostfix(this._sym.name)) {
                var op = this._sym.name;
                this.getToken();

                return new PostUnaryOperatorExpression(op, atom);
            }

            return atom;
        }

        private parseOperator(left: Expression, minPrecidence: number): Expression {

            var op = this._sym.name;

            var prec = this.getOperatorPrecidence(op);
            if (prec > minPrecidence) {
                this.getToken();
                var right = this.parseOperator(this.parseUnaryOperators(), prec);

                return this.parseOperator(new BinaryOperatorExpression(left, op, right), minPrecidence);
            }

            return left;
        }

        private parseBrackets(expr: ()=>Expression) {

            /*if ((this._sym.category == SymbolCategory.other) && ((this._sym.name == "(") || (this._sym.name == "["))) {
                //this.getToken();
                var result = expr();

                this.expectToken(SymbolCategory.other, this._sym.name);
                this.getToken();
            } else {*/
                return expr();
            //}
        }

        private parseAtom(): Expression {
            return this.parseBrackets(() => this.parseBracketedAtom());
        }

        private parseArray(): Expression {
            return new ArrayExpression(this.parseExpressionList("]"));
        }

        private parseBracketedAtom(): Expression {

            if (this._sym.category == SymbolCategory.punctuation) {
                if (this._sym.name == "[") {
                    this.getToken();
                    return this.parseSubscripts(this.parseArray());
                } else if (this._sym.name == "(") {
                    this.getToken();
                    return this.parseSubscripts(this.parseExpression());
                }

                throw "Unexpected";
            } else if (this._sym.category == SymbolCategory.literalNumber) {
                var val = this._sym.name;
                this.getToken();

                return this.parseSubscripts(new LiteralExpression(val));
            } else if (this._sym.category == SymbolCategory.literalString) {
                var val = this._sym.name;
                this.getToken();

                return this.parseSubscripts(new LiteralExpression(val));
            } else if (this._sym.category == SymbolCategory.identifier) {
                var name = this._sym.name;
                this.getToken();
                return this.parseSubscripts(new VariableReferenceExpression(name));
            } else if (this._sym.category == SymbolCategory.keyword) {
                var name = this._sym.name;
                this.getToken();
                return this.parseSubscripts(new KeywordExpression(name));
            }

            throw "Unexpected";
        }

        private parseSubscripts(left: Expression) {
            var type = this._sym.name;

            if (type == ".") {
                // Dereference
                var sym = this.getToken();
                this.getToken();

                return this.parseSubscripts(new DereferenceExpression(left, sym.name));
            } else if (type == "[") {
                // Array index
                this.getToken();

                var expr = this.parseExpression();
                return this.parseSubscripts(new ArrayIndexExpression(left, expr));
            } else if (type == "(") {
                // Function call
                this.getToken();

                var args = this.parseExpressionList(")");

                return this.parseSubscripts(new FunctionCallExpression(left, args));
            }

            return left;
        }

        private parseExpressionList(endChar: string): Expression[] {
            var args: Expression[] = [];
            while (this._sym.name != endChar) {
                args.push(this.parseExpression());

                // Consume the comma
                if (this._sym.name == ",") {
                    this._sym = this.getToken();
                } else {
                    this.expectToken(SymbolCategory.punctuation, endChar);
                }
            }

            this.getToken();

            return args;
        }

//#endregion
    }

    export enum SymbolCategory {
        operator,
        literalString,
        literalNumber,
        identifier,
        keyword,
        eof,
        punctuation
    }

    export class Symbol {
        public name: any;
        public category: SymbolCategory;

        constructor(name: any, category: SymbolCategory) {
            this.name = name;
            this.category = category;
        }
    }
}