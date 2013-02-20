/// <reference path="Expression.ts" />

module jsBind {
    export class VariableReferenceExpression extends Expression {
        private _name: string;

        constructor(name: string) {
            super();

            this._name = name;
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