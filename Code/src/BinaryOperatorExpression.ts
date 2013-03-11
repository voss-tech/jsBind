///<reference path="IExpression.ts"/>

module jsBind {
    export class BinaryOperatorExpression implements IExpression {
        private _lhs: IExpression;
        private _rhs: IExpression;
        private _op: string;
        
        private _lhsValue: any;
        private _rhsValue: any;
        private _changeFunc: any;

        constructor(lhs: IExpression, op: string, rhs: IExpression) {
            this._lhs = lhs;
            this._op = op;
            this._rhs = rhs;
        }

        public dispose(): void {
            this._lhs.dispose();
            this._rhs.dispose();
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
            this._rhsValue = this._rhs.eval(rhsChange, d, p, e);

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

                case "===":
                    return lhsValue === rhsValue;

                case "!=":
                    return lhsValue != rhsValue;

                case "!==":
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