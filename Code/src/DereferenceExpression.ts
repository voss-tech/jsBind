/// <reference path="IExpression.ts" />

module jsBind {

    export class DereferenceExpression implements IExpression {
        private _target: IExpression;
        private _name: string;
        private _currentObj: any = null;

        private _value: any;
        private _changeFunc: any;

        private _del;

        constructor(target: IExpression, name: string) {
            this._target = target;
            this._name = name;
        }

        public dispose(): void {
            this._target.dispose();

            if ((this._currentObj != null) && (this._currentObj.removeObserver)) {
                this._currentObj.removeObserver(this._del);
            }
        }

        private handleChange(v: any): void {
            if (this._value != v) {
                this._value = v;

                this._changeFunc(this.doEval());
            }
        }

        public eval(changeFunc: any, d: any, p: any, e: any): any {
            var change = null;

            this._del = (p) => this.handleObjChange(p);

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
                    this._currentObj.removeObserver(this._del);
                }

                this._currentObj = obj;

                if (this._currentObj.addObserver) {
                    this._currentObj.addObserver(this._del);
                }
            }

            var member = obj[this._name];

            if (typeof (member) === "function") {
                // For a function we return a function that will do the invoke when called with the argument
                // values.  This is necessary because the parent expression will supply the arguments.
                return (args) => { return member.apply(obj, args); }
            } else {
                // For a variable we return the variables value.  If the member is undefined assume its a variable
                // and return undefined as well. 
                return member;
            }
        }

        private handleObjChange(memberName: string) {
            if (this._name == memberName) {
                this._changeFunc(this.doEval());
            }
        }

    }
}