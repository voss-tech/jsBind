/// <reference path="tsUnit.ts" />
/// <reference path="../src/ObservableBool.ts" />

module jsBind {

    export class ObservableBoolTests {

        public testGet(c: tsUnit.TestContext): void {
            var ob = new ObservableBool(true);
            c.areIdentical(true, ob.get());
        }

        public testSet(c: tsUnit.TestContext): void {
            var ob = new ObservableBool(true);

            ob.set(false);
            c.areIdentical(false, ob.get());
        }

        public testObserverNotified(c: tsUnit.TestContext): void {
            var ob = new ObservableBool(true);

            var notifiedValue: string = null;
            ob.addObserver((x) => {notifiedValue = x});

            c.isNull(notifiedValue);

            ob.set(false);
            c.areIdentical("get", notifiedValue);
        }

        public testSetSameValueObserverNotNotified(c: tsUnit.TestContext): void {
            var ob = new ObservableBool(true);

            var notifiedValue: string = null;
            ob.addObserver((x) => {notifiedValue = x});

            c.isNull(notifiedValue);

            ob.set(true);
            c.isNull(notifiedValue);
        }

        public testObserverRemoved(c: tsUnit.TestContext): void {
            var ob = new ObservableBool(true);

            var notifiedValue: string = null;

			var del = (x) => {notifiedValue = x};

            ob.addObserver(del);

            c.isNull(notifiedValue);

            ob.set(false);
            c.areIdentical("get", notifiedValue);

            ob.removeObserver(del);
            notifiedValue = null;

            ob.set(true);
            c.isNull(notifiedValue);
        }
    }
}