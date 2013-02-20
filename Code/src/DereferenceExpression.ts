/// <reference path="Expression.ts" />

module jsBind {

    export class DereferenceExpression extends Expression {
        private _target: Expression;
        private _name: string;
        private _currentObj: any = null;

        private _value: any;
        private _changeFunc: any;

        constructor(target: Expression, name: string) {
            super();

            this._target = target;
            this._name = name;
        }

        private handleChange(v: any): void {
            if (this._value != v) {
                this._value = v;

                this._changeFunc(this.doEval());
            }
        }

        public eval(changeFunc: any, d: any, p: any, e: any): any {
            var change = null;

            if (changeFunc != null) {
                this._changeFunc = changeFunc;

                change = (v) => this.handleChange(v);
            }

            this._value = this._target.eval(change, d, p, e);

            return this.doEval();
        }

        private doEval(): any {
            // Get the object that we are going to call the method on.
            var obj = this._value;

            if ((this._changeFunc != null) && (this._currentObj != obj)) {
                if ((this._currentObj != null) && (this._currentObj.removeObserver)) {
                    this._currentObj.removeObserver((p) => this.handleObjChange(p));
                }

                this._currentObj = obj;

                if (this._currentObj.addObserver) {
                    this._currentObj.addObserver((p) => this.handleObjChange(p));
                }
            }

            // Return a function that will do the invoke when called with the argument values.
            var member = obj[this._name];
            
            if (member == undefined) {
                throw "Unable to find a member called '" + this._name + "'.";
            }

            if (typeof (member) == "function") {
                // For a function we return a function that will do the invoke when called with the argument
                // values.  This is neccessary because the parent expression will supply the arguments.
                return (args) => { return member.apply(obj, args); }
            } else {
                // For a variable we return the variables value
                return member;
            };
        }

        private handleObjChange(memberName: string) {
            if (this._name == memberName) {
                this._changeFunc(this.doEval());
            }
        }

    }
}