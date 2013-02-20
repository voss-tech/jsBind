/// <reference path="Expression.ts" />

module jsBind {

    export class ArrayExpression extends Expression {
        private _args: Expression[];
        private _argsValues: any[] = [];
        private _changeFunc: any;

        constructor(args: Expression[]) {
            super();

            this._args = args;
        }

        public eval(changeFunc: any, d: any, p: any, e: any): any {
            var argsChange = [];

            if (changeFunc != null) {
                this._changeFunc = changeFunc;
                
                var args = this._args;
                var argsLen = this._args.length;
                for (var i = 0; i < argsLen; i++) {
                    // Todo - check what happens to the modified closure here.
                    argsChange.push((v) => this.handleArgChange(i, v));
                }
            }

            // Evaluate the arguments
            var args = this._args;
            var argsLen = args.length;
            for (var i = 0; i < argsLen; i++) {
                this._argsValues.push(args[i].eval(argsChange[i], d, p, e));
            }
        }

        private handleArgChange(i: number, v: any): void {
            if (this._argsValues[i] != v) {
                this._argsValues[i] = v;

                this._changeFunc(this.doEval());
            }
        }

        private doEval(): any {
            return this._argsValues;
        }
    }
}