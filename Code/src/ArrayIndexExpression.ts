/// <reference path="Expression.ts" />

module jsBind {

    export class ArrayIndexExpression extends Expression {
        private _left: Expression;
        private _index: Expression;

        private _leftValue: any;
        private _indexValue: any;
        private _changeFunc: any;

        constructor(left: Expression, index: Expression) {
            super();

            this._left = left;
            this._index = index;
        }

        private handleLeftChange(v: any): void {
            this._leftValue = v;

            this._changeFunc(this.doEval());
        }

        private handleIndexChange(v: any): void {
            this._indexValue = v;

            this._changeFunc(this.doEval());
        }

        public eval(changeFunc: any, d: any, p: any, e: any): any {

            var leftChange = null;
            var indexChange = null;

            if (changeFunc != null) {
                this._changeFunc = changeFunc;

                leftChange = (v) => this.handleIndexChange(v);
                indexChange = (v) => this.handleIndexChange(v);
            }

            this._leftValue = this._left.eval(leftChange, d, p, e);
            this._indexValue = this._index.eval(indexChange, d, p, e);

            this.doEval();
        }

        private doEval(): any {
            return this._leftValue[this._indexValue];
        }
    }
}