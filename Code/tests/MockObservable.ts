/// <reference path="../src/Observable.ts" />

module jsBind {
    export class MockObservable implements IObservable {
        private _value: any = null;

        public delegates: ChangeDelegate[] = [];

        public addObserver(delegate: ChangeDelegate): void {
            // Null delegates are ignored.
            if (delegate == null) {
                return;
            }

            this.delegates.push(delegate);
        }

        public removeObserver(delegate: ChangeDelegate): void {
            var index = this.delegates.indexOf(delegate);
            if (index > -1) {
                this.delegates.splice(index, 1);
            }
        }

        public get(): any {
            return this._value;
        }

        public set(value: any): void {
            this._value = value;

            this.notifyChanged("get");
        }

        public notifyChanged(memberName: string): void {
            var len = this.delegates.length;
            for (var i = 0; i < len; i++) {
                this.delegates[i](memberName);
            }
        }
    }
}