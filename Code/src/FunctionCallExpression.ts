/// <reference path="Expression.ts" />

module jsBind {
    export class FunctionCallExpression extends Expression {
        private _identifier: Expression;
        private _args: Expression[];

        private _identifierValue: any;
        private _argsValues: any[] = [];
        private _changeFunc: any;

        constructor(identifier: Expression, args: Expression[]) {
            super();

            this._identifier = identifier;
            this._args = args;
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
                    // Todo - check what happens to the modified closure here.
                    argsChange.push((v) => this.handleArgChange(i, v));
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