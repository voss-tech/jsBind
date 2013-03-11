/// <reference path="tsUnit.ts" />
/// <reference path="../src/ObservableValue.ts" />

module jsBind {

    export class ObservableValueTests {

        public testGet(c: tsUnit.TestContext): void {
            var ob = new ObservableValue("Hello World");
            c.areIdentical("Hello World", ob.get());
        }

        public testSet(c: tsUnit.TestContext): void {
            var ob = new ObservableValue("Hello World");

            ob.set("Hi There");
            c.areIdentical("Hi There", ob.get());
        }

        public testObserverNotified(c: tsUnit.TestContext): void {
            var ob = new ObservableValue("Hello World");

            var notifiedValue: string = null;
            ob.addObserver((x) => {notifiedValue = x});

            c.isNull(notifiedValue);

            ob.set("Hi There");
            c.areIdentical("get", notifiedValue);
        }

        public testSetSameValueObserverNotNotified(c: tsUnit.TestContext): void {
            var ob = new ObservableValue("Hello World");

            var notifiedValue: string = null;
            ob.addObserver((x) => {notifiedValue = x});

            c.isNull(notifiedValue);

            ob.set("Hello World");
            c.isNull(notifiedValue);
        }

        public testObserverRemoved(c: tsUnit.TestContext): void {
            var ob = new ObservableValue("Hello World");

            var notifiedValue: string = null;

			var del = (x) => {notifiedValue = x};

            ob.addObserver(del);

            c.isNull(notifiedValue);

            ob.set("Hi There");
            c.areIdentical("get", notifiedValue);

            ob.removeObserver(del);
            notifiedValue = null;

            ob.set("Hello");
            c.isNull(notifiedValue);
        }
    }
}