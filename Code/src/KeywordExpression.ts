/// <reference path="Expression.ts" />

module jsBind {
    export class KeywordExpression extends Expression {
        private _keyword: any;
        private _keywordValue: any;

        constructor(keyword: string) {
            super();

            this._keyword = keyword;

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

        public eval(changeFunc: any, d: any, p: any, e: any): any {
            return this._keyword;
        }
    }
}