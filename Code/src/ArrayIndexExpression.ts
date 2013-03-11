/// <reference path="IExpression.ts" />

module jsBind {

    export class ArrayIndexExpression implements IExpression {
        private _left: IExpression;
        private _index: IExpression;

        private _leftValue: any;
        private _indexValue: any;
        private _changeFunc: any;

        constructor(left: IExpression, index: IExpression) {
            this._left = left;
            this._index = index;
        }

        public dispose(): void {
            this._left.dispose();
            this._index.dispose();
        }

        private handleLeftChange(v: any): void {
            if (this._leftValue != v) {
                this._leftValue = v;

                this._changeFunc(this.doEval());
            }
        }

        private handleIndexChange(v: any): void {
            if (this._indexValue != v) {
                this._indexValue = v;

                this._changeFunc(this.doEval());
            }
        }

        public eval(changeFunc: any, d: any, p: any, e: any): any {

            var leftChange = null;
            var indexChange = null;

            if (changeFunc != null) {
                this._changeFunc = changeFunc;

                leftChange = (v) => this.handleLeftChange(v);
                indexChange = (v) => this.handleIndexChange(v);
            }

            this._leftValue = this._left.eval(leftChange, d, p, e);
            this._indexValue = this._index.eval(indexChange, d, p, e);

            return this.doEval();
        }

        private doEval(): any {
            return this._leftValue[this._indexValue];
        }
    }
}