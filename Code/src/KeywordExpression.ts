/// <reference path="IExpression.ts" />

module jsBind {
    export class KeywordExpression implements IExpression {
        private _keywordValue: any;

        constructor(keyword: string) {
            switch (keyword) {
                case "true": {
                    this._keywordValue = true;
                    break;
                }
                case "false": {
                    this._keywordValue = false;
                    break;
                }
                case "null": {
                    this._keywordValue = null;
                    break;
                }
                case "undefined": {
                    this._keywordValue = undefined;
                    break;
                }
            }
        }

        public dispose(): void {
        }

        public eval(changeFunc: any, d: any, p: any, e: any): any {
            return this._keywordValue;
        }
    }
}