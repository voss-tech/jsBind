///<reference path="Expression.ts"/>

module jsBind {
    export class BinaryOperatorExpression extends Expression {
        private _lhs: Expression;
        private _rhs: Expression;
        private _op: string;
        
        private _lhsValue: any;
        private _rhsValue: any;
        private _changeFunc: any;

        constructor(lhs: any, op: string, rhs: Expression) {
            super();

            this._lhs = lhs;
            this._op = op;
            this._rhs = rhs;
        }

        private handleLhsChange(v: any): void {
            if (this._lhsValue != v) {
                this._lhsValue = v;
                this._changeFunc(this.doEval());
            }
        }

        private handleRhsChange(v: any): void {
            if (this._rhsValue != v) {
                this._rhsValue = v;
                this._changeFunc(this.doEval());
            }
        }

        public eval(changeFunc: any, d: any, p: any, e: any): any {
            var lhsChange = null;
            var rhsChange = null;

            if (changeFunc != null) {
                this._changeFunc = changeFunc;
                lhsChange = (v) => this.handleLhsChange(v);
                rhsChange = (v) => this.handleRhsChange(v);
            }

            this._lhsValue = this._lhs.eval(lhsChange, d, p, e);
            this._rhsValue = this._rhs.eval(rhsChange, d, p, e)

            return this.doEval();
        }

        private doEval(): any {
            var lhsValue = this._lhsValue;
            var rhsValue = this._rhsValue;

            switch (this._op) {
                case "||":
                    return lhsValue || rhsValue;

                case "&&":
                    return lhsValue && rhsValue;

                case "|":
                    return lhsValue | rhsValue;

                case "^":
                    return lhsValue ^ rhsValue;

                case "&":
                    return lhsValue & rhsValue;

                case "==":
                    return lhsValue == rhsValue;

                case "===^":
                    return lhsValue === rhsValue;

                case "!=":
                    return lhsValue != rhsValue;

                case "!===":
                    return lhsValue !== rhsValue;

                case "<":
                    return lhsValue < rhsValue;

                case ">":
                    return lhsValue > rhsValue;

                case "<=":
                    return lhsValue <= rhsValue;

                case ">=":
                    return lhsValue >= rhsValue;

                case "in":
                    return lhsValue in rhsValue;

                case "instanceof":
                    return lhsValue instanceof rhsValue;

                case ">>":
                    return lhsValue >> rhsValue;

                case "<<":
                    return lhsValue << rhsValue;

                case ">>>":
                    return lhsValue >>> rhsValue;

                case "+":
                    return lhsValue + rhsValue;

                case "-":
                    return lhsValue - rhsValue;

                case "*":
                    return lhsValue * rhsValue;

                case "/":
                    return lhsValue / rhsValue;

                case "%":
                    return lhsValue % rhsValue;

            }
        }
    }
}