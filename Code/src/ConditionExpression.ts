/// <reference path="Expression.ts"/>

module jsBind {

    export class ConditionExpression extends Expression {
        private _cond: Expression;
        private _trueExpr: Expression;
        private _falseExpr: Expression;

        private _condValue: any;
        private _trueValue: any;
        private _falseValue: any;

        private _changeFunc: any;

        private _flag: bool = false;

        private _d: any;
        private _p: any;
        private _e: any;

        constructor(cond: Expression, trueExpr: Expression, falseExpr: Expression) {
            super();
            
            this._cond = cond;
            this._trueExpr = trueExpr;
            this._falseExpr = falseExpr;
        }

        private handleCondChange(v: any): void {
            if (this._condValue != v) {
                this._condValue = v;

                if (!this._flag) {
                    if (this._condValue) {
                        var trueChange = (v) => this.handleTrueChange(v);
                        this._trueValue = this._trueExpr.eval(trueChange, this._d, this._p, this._e);
                    } else {
                        var falseChange = (v) => this.handleFalseChange(v);
                        this._falseValue = this._falseExpr.eval(falseChange, this._d, this._p, this._e);
                    }
                    this._flag = true;
                }

                this._changeFunc(this.doEval());
            }
        }

        private handleTrueChange(v: any): void {
            if (this._trueValue != v) {
                this._trueValue = v;

                this._changeFunc(this.doEval());
            }
        }

        private handleFalseChange(v: any): void {
            if (this._falseValue != v) {
                this._falseValue = v;

                this._changeFunc(this.doEval());
            }
        }

        public eval(changeFunc: any, d: any, p: any, e: any): any {

            var condChange = null;
            var trueChange = null;
            var falseChange = null;

            if (changeFunc != null) {
                condChange = (v) => this.handleCondChange(v);
                trueChange = (v) => this.handleTrueChange(v);
                falseChange = (v) => this.handleFalseChange(v);
            }

            this._condValue = this._cond.eval(condChange, d, p, e);
            if (this._condValue) {
                this._trueValue = this._trueExpr.eval(trueChange, d, p, e);
            } else {
                this._falseValue = this._falseExpr.eval(falseChange, d, p, e);
            }

            return this.doEval();
        }

        private doEval(): any {
            if (this._condValue) {
                return this._trueValue;
            } else {
                return this._falseValue;
            }
        }
    }
}