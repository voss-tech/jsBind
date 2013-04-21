/// <reference path="IExpression.ts" />

module jsBind {
    export class FunctionCallExpression implements IExpression {
        private _identifier: IExpression;
        private _args: IExpression[];

        private _identifierValue: any;
        private _argsValues: any[] = [];
        private _changeFunc: any;

        constructor(identifier: IExpression, args: IExpression[]) {
            this._identifier = identifier;
            this._args = args;
        }

        public dispose(): void {
            this._identifier.dispose();
            this._args.forEach((v, i, a) => { v.dispose() });
        }

        private handleIdentifierChange(v: any): void {
            if (this._identifierValue != v) {
                this._identifierValue = v;
                
                this._changeFunc(this.doEval());
            }
        }

        private handleArgChange(i: number, v: any): void {
            if (this._argsValues[i] != v) {
                this._argsValues[i] = v;

                this._changeFunc(this.doEval());
            }
        }

        public eval(changeFunc: any, d: any, p: any, e: any) {
            var identifierChange = null;
            var argsChange = [];

            if (changeFunc != null) {
                this._changeFunc = changeFunc;
                identifierChange = (v) => this.handleIdentifierChange(v);

                var args = this._args;
                var argsLen = this._args.length;
                for (var i = 0; i < argsLen; i++) {
                    var ii = i;
                    argsChange.push((v) => this.handleArgChange(ii, v));
                }
            }

            // Get the function
            this._identifierValue = this._identifier.eval(identifierChange, d, p, e);

            // Evaluate the arguments
            var args = this._args;
            var argsLen = args.length;
            for (var i = 0; i < argsLen; i++) {
                this._argsValues.push(args[i].eval(argsChange[i], d, p, e));
            }

            return this.doEval();
        }

        private doEval(): any {
            // Invoke the function
            return this._identifierValue(this._argsValues);
        }
    }
}