/// <reference path="IExpression.ts"/>

module jsBind {

    export class PreUnaryOperatorExpression implements IExpression {
        private _op: string;
        private _expr: IExpression;

        private _value: any;
        private _changeFunc: any;

        constructor(op: string, expr: IExpression) {
            this._op = op;
            this._expr = expr;
        }

        public dispose(): void {
            this._expr.dispose();
        }

        private handleChange(v: any): void {
            if (this._value != v) {
                this._value = v;
                this._changeFunc(this.doEval());
            }
        }

        public eval(changeFunc: any, d: any, p: any, e: any): any {
            var change = null;

            if (changeFunc != null) {
                this._changeFunc = changeFunc;
                change = (v) => this.handleChange(v);
            }

            this._value = this._expr.eval(change, d, p, e);

            return this.doEval();
        }

        private doEval(): any {
            switch (this._op) {
                case "typeof": 
                    return typeof (this._value);

                case "!":
                    return !this._value;

                case "~":
                    return ~this._value;

                case "-":
                    return -this._value;

                case "+":
                    return +this._value;

            }
        }
    }

}