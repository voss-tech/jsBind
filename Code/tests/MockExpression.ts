/// <reference path="../src/IExpression.ts" />

module jsBind {
    export class MockExpression implements IExpression {
        private _changeFunc: any;
        private _value: any;
        public isDisposed: bool = false;
        public wasEvaluated: bool = false;

        constructor(value: any) {
            this._value = value;
        }

        public dispose(): void {
            this.isDisposed = true;
        }

        public eval(changeFunc: any, d: any, p: any, e: any): any {
            this._changeFunc = changeFunc;
            this.wasEvaluated = true;
            return this._value;
        }

        public raiseChange(newValue: any) {
            this._changeFunc(newValue);
        }
    }
}