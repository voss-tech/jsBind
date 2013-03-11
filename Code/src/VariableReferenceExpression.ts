/// <reference path="IExpression.ts" />

module jsBind {
    export class VariableReferenceExpression implements IExpression {
        private _name: string;

        constructor(name: string) {
            this._name = name;
        }

        public dispose() {
        }

        public eval(changeFunc: any, d: any, p: any, e: any): any {
            switch (this._name) {
                case "$d":
                    return d;

                case "$p":
                    return p;

                case "$e":
                    return e;
            }

            return null;
        }
    }
}