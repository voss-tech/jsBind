/// <reference path="IBinding.ts" />
/// <reference path="ForEachBinding.ts" />
/// <reference path="PropBinding.ts" />
/// <reference path="EventBinding.ts" />
/// <reference path="TemplateBinding.ts" />

/// <reference path="IExpression.ts" />
/// <reference path="LiteralExpression.ts" />
/// <reference path="BinaryOperatorExpression.ts" />
/// <reference path="PreUnaryOperatorExpression.ts" />
/// <reference path="FunctionCallExpression.ts" />
/// <reference path="VariableReferenceExpression.ts" />
/// <reference path="DereferenceExpression.ts" />
/// <reference path="ConditionExpression.ts" />
/// <reference path="ArrayIndexExpression.ts" />
/// <reference path="ArrayExpression.ts" />
/// <reference path="KeywordExpression.ts" />

module jsBind {
    export class Binder {
        private _bindings: IBinding[] = [];

        constructor(element: Node, dataContext: any, parentContext: any = null) {
            this.setup(element, dataContext, parentContext);
        }

        public dispose(): void {
            var bindings = this._bindings;
            var len = bindings.length;
            for (var i = 0; i < len; i++) {
                bindings[i].dispose();
            }
            delete this._bindings;
        }

        private setup(node: Node, dataContext: any, parentContext: any) {
            var childNodesBound = false;

        if (node instanceof HTMLElement) {
                var element = <HTMLElement> node;

                if (element.hasAttribute("data-jsBind")) {
                    var bindExpr = element.getAttribute("data-jsBind");

                    childNodesBound = this.parseBindings(bindExpr, element, dataContext, parentContext);
                }
            }

            if (!childNodesBound) {
                var nodes = node.childNodes;
                var nodesLen = nodes.length;
                for (var i = 0; i < nodesLen; i++) {
                    this.setup(nodes[i], dataContext, parentContext);
                }
            }
        }

        private expectToken(category: SymbolCategory, name: string): Symbol {
            if (!(this._sym.category == category) && (this._sym.name == name)) {
                throw "Expected '" + name + "' at position " + this._pos + " while parsing '" + this._expr + "'.";
            }

            return this.getToken();
        }

        private matchIdentifier(): string {
            if (this._sym.category != SymbolCategory.identifier) {
                throw "Expected identifier at position " + this._pos + " while parsing '" + this._expr + "'.";
            }

            var name = this._sym.name;

            this.getToken();

            return name;
        }

        private parseBindings(expr: string, element: HTMLElement, dataContext: any, parentContext: any): bool{
            // Initialise the tokeniser
            this._expr = expr;
            this._len = expr.length;
            this._pos = 0;

            this.nextChar();
            this.getToken();

            var template;
            var forEach;
            var propsAndEvents:IBinding[] = [];

            while (this._sym.category != SymbolCategory.eof) {

                var bindingType = this.matchIdentifier();

                // Parse the bindings by keyword
                switch (bindingType) {
                    case "prop": {
                        this.expectToken(SymbolCategory.punctuation, ":");

                        var propParts: string[] = [];
                        propParts.push(this.matchIdentifier());
                        while ((this._sym.category == SymbolCategory.punctuation) && (this._sym.name == ".")) {
                            this.getToken();

                            propParts.push(this.matchIdentifier());
                        }

                        this.expectToken(SymbolCategory.operator, "=");

                        var prop = new PropBinding(element, propParts, this.parseExpression(), dataContext, parentContext);
                        propsAndEvents.push(prop);
                        this._bindings.push(prop);
                        break;
                    }

                    case "forEach": {
                        this.expectToken(SymbolCategory.operator, "=");

                        forEach = new ForEachBinding(element, this.parseExpression(), dataContext, parentContext);

                        this._bindings.push(forEach);

                        break;
                    }

                    case "event": {
                        this.expectToken(SymbolCategory.punctuation, ":");

                        var eventName = this.matchIdentifier();

                        this.expectToken(SymbolCategory.operator, "=");

                        var event = new EventBinding(element, eventName, this.parseExpression(), dataContext, parentContext);
                        propsAndEvents.push(event);
                        this._bindings.push(event);
                        break;
                    }

                    case "template": {
                        this.expectToken(SymbolCategory.punctuation, ":");

                        var templateSource = this.matchIdentifier();

                        this.expectToken(SymbolCategory.operator, "=");

                        template = new TemplateBinding(element, templateSource, this.parseExpression(), dataContext, parentContext);

                        this._bindings.push(template);

                        break;
                    }

                    default: {
                        throw "Unexpected binding type '" + bindingType + "' while parsing '" + expr + "'.";
                    }
                }

                this.getToken();
            }

            if (template) {
                template.evaluate();
            }

            if (forEach) {
                forEach.evaluate();
            }

            propsAndEvents.forEach((v,i,a) => {v.evaluate()});

            return template || forEach;
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

        private operators = [
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
                    throw("Unexpected character '" + c + "' at position " + this._pos + " while parsing number in '" + this._expr + "'.");
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

            return this._expr.substring(start, this._pos - 1);
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
                var identifier = this.parseIdentifier();
                if (this.isKeyword(identifier)) {
                    return new Symbol(identifier, SymbolCategory.keyword);
                } else {
                    return new Symbol(identifier, SymbolCategory.identifier);
                }
            } else if (c == "\x00") {
                return new Symbol("", SymbolCategory.eof);
            } else if (this.isOperator(c)) {
                return this.parseOperatorToken();
            } else if (this.isPunctuation(c)) {
                this.nextChar();
                return new Symbol(c, SymbolCategory.punctuation);
            }

            throw("Unknown token '" + c + "' at position " + this._pos + " while parsing '" + this._expr + "'.");
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

        private parseExpression(): IExpression {
            var cond = this.parseOperators();

            if ((this._sym.category == SymbolCategory.operator) && (this._sym.name == "?")) {
                this.getToken();
                var trueExpr = this.parseExpression();

                this.expectToken(SymbolCategory.punctuation, ":");

                var falseExpr = this.parseExpression();

                return new ConditionExpression(cond, trueExpr, falseExpr);
            }

            return cond;
        }

        private parseOperators(): IExpression {
            return this.parseOperator(this.parseUnaryOperators(), 0);
        }

        private parseUnaryOperators(): IExpression {
            if ((this._sym.category == SymbolCategory.operator) && this.isUnaryPrefix(this._sym.name)) {
                var op = this._sym.name;
                this.getToken();

                return new PreUnaryOperatorExpression(op, this.parseUnaryOperators());
            }

            return this.parseAtom();
        }

        private parseOperator(left: IExpression, minPrecidence: number): IExpression {

            var op = this._sym.name;

            var prec = this.getOperatorPrecidence(op);
            if (prec > minPrecidence) {
                this.getToken();
                var right = this.parseOperator(this.parseUnaryOperators(), prec);

                return this.parseOperator(new BinaryOperatorExpression(left, op, right), minPrecidence);
            }

            return left;
        }

        private parseAtom(): IExpression {
            var name = this._sym.name;

            switch (this._sym.category) {
                case SymbolCategory.punctuation: {
                    if (name == "[") {
                        this.getToken();
                        return this.parseSubscripts(new ArrayExpression(this.parseExpressionList("]")));
                    } else if (name == "(") {
                        this.getToken();

                        var expr = this.parseExpression();
                        this.getToken();

                        return this.parseSubscripts(expr);
                    }
                    break;
                }

                case SymbolCategory.literalNumber: {
                    this.getToken();
                    return this.parseSubscripts(new LiteralExpression(name));
                }

                case SymbolCategory.literalString: {
                    this.getToken();
                    return this.parseSubscripts(new LiteralExpression(name));
                }

                case SymbolCategory.identifier: {
                    this.getToken();
                    return this.parseSubscripts(new VariableReferenceExpression(name));
                }

                case SymbolCategory.keyword: {
                    this.getToken();
                    return this.parseSubscripts(new KeywordExpression(name));
                }
            }

            throw "Unexpected symbol '" + name + "' while parsing " + this._expr;
        }

        private parseSubscripts(left: IExpression): IExpression {
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
                this.getToken();
                return this.parseSubscripts(new ArrayIndexExpression(left, expr));
            } else if (type == "(") {
                // Function call
                this.getToken();

                var args = this.parseExpressionList(")");

                return this.parseSubscripts(new FunctionCallExpression(left, args));
            }

            return left;
        }

        private parseExpressionList(endChar: string): IExpression[] {
            var args: IExpression[] = [];

            if (this._sym.name == endChar) {
               this.getToken();
               return args;
            }

            while (true) {
                args.push(this.parseExpression());

                // Consume the comma
                if (this._sym.name == ",") {
                    this._sym = this.getToken();
                } else {
                    this.expectToken(SymbolCategory.punctuation, endChar);

                    return args;
                }
            }
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