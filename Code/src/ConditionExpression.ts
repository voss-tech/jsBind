/// <reference path="IExpression.ts"/>

module jsBind {

    export class ConditionExpression implements IExpression {
        private _cond: IExpression;
        private _trueExpr: IExpression;
        private _falseExpr: IExpression;

        private _condValue: any;
        private _trueValue: any;
        private _falseValue: any;

        private _changeFunc: (x:any) => void;

        private _flag: bool = false;

        private _d: any;
        private _p: any;
        private _e: any;

        constructor(cond: IExpression, trueExpr: IExpression, falseExpr: IExpression) {
            this._cond = cond;
            this._trueExpr = trueExpr;
            this._falseExpr = falseExpr;
        }

        public dispose(): void {
            this._cond.dispose();
            this._trueExpr.dispose();
            this._falseExpr.dispose();
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

                if (this._condValue) {
                    this._changeFunc(this._trueValue);
                }
            }
        }

        private handleFalseChange(v: any): void {
            if (this._falseValue != v) {
                this._falseValue = v;

                if (!this._condValue) {
	            this._changeFunc(this._falseValue);
                }
            }
        }

        public eval(changeFunc: any, d: any, p: any, e: any): any {

            var condChange = null;
            var trueChange = null;
            var falseChange = null;

            if (changeFunc != null) {
                this._changeFunc = changeFunc;
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