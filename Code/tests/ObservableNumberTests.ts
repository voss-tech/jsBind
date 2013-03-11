/// <reference path="tsUnit.ts" />
/// <reference path="../src/ObservableNumber.ts" />

module jsBind {

    export class ObservableNumberTests {

        public testGet(c: tsUnit.TestContext): void {
            var ob = new ObservableNumber(42);
            c.areIdentical(42, ob.get());
        }

        public testSet(c: tsUnit.TestContext): void {
            var ob = new ObservableNumber(42);

            ob.set(24);
            c.areIdentical(24, ob.get());
        }

        public testObserverNotified(c: tsUnit.TestContext): void {
            var ob = new ObservableNumber(42);

            var notifiedValue: string = null;
            ob.addObserver((x) => {notifiedValue = x});

            c.isNull(notifiedValue);

            ob.set(24);
            c.areIdentical("get", notifiedValue);
        }

        public testSetSameValueObserverNotNotified(c: tsUnit.TestContext): void {
            var ob = new ObservableNumber(42);

            var notifiedValue: string = null;
            ob.addObserver((x) => {notifiedValue = x});

            c.isNull(notifiedValue);

            ob.set(42);
            c.isNull(notifiedValue);
        }

        public testObserverRemoved(c: tsUnit.TestContext): void {
            var ob = new ObservableNumber(42);

            var notifiedValue: string = null;

			var del = (x) => {notifiedValue = x};

            ob.addObserver(del);

            c.isNull(notifiedValue);

            ob.set(24);
            c.areIdentical("get", notifiedValue);

            ob.removeObserver(del);
            notifiedValue = null;

            ob.set(42);
            c.isNull(notifiedValue);
        }
    }
}