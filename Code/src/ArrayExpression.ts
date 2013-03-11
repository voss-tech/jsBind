/// <reference path="IExpression.ts" />

module jsBind {

    export class ArrayExpression implements IExpression {
        private _args: IExpression[];
        private _argsValues: any[] = [];
        private _changeFunc: (x:any) => void;

        constructor(args: IExpression[]) {
            this._args = args;
        }

        public dispose(): void {
            this._args.forEach((v, i, a) => { v.dispose() });
        }

        public eval(changeFunc: (x:any) => void, d: any, p: any, e: any): any {
            var argsChange = [];

            if (changeFunc != null) {
                this._changeFunc = changeFunc;
                
                var args = this._args;
                var argsLen = this._args.length;
                for (var i = 0; i < argsLen; i++) {
                    // i is modified outside the closure so we pull it in with ii
                    var ii = i;
                    argsChange.push((v) => this.handleArgChange(ii, v));
                }
            }

            // Evaluate the arguments
            var args = this._args;
            var argsLen = args.length;
            for (var i = 0; i < argsLen; i++) {
                this._argsValues.push(args[i].eval(argsChange[i], d, p, e));
            }

            return this.doEval();
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