/// <reference path="tsUnit.ts" />
/// <reference path="MockExpression.ts" />
/// <reference path="MockObservable.ts" />
/// <reference path="../src/DereferenceExpression.ts" />

module jsBind {

    export class DereferenceExpressionTests {

        public testEvalVariable(c: tsUnit.TestContext): void {
            var mockTarget = new MockExpression("Hello World");

            var expr = new DereferenceExpression(mockTarget, "length");
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(11, result);
        }

        public testEvalMethod(c: tsUnit.TestContext): void {
            var mockTarget = new MockExpression("Hello World");

            var expr = new DereferenceExpression(mockTarget, "toUpperCase");
            var result = expr.eval((x) => {}, null, null, null);

            c.isTrue(typeof(result) == "function");

            c.areEqual("HELLO WORLD", result([]));
        }

        public testEvalObservableMethod(c: tsUnit.TestContext): void {
            var observable = new ObservableString("Hello World");
            var mockTarget = new MockExpression(observable);

            var expr = new DereferenceExpression(mockTarget, "get");
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical("Hello World", result([]));
        }

        public testDispose(c: tsUnit.TestContext): void {
            var mockObservable = new MockObservable();
            var mockTarget = new MockExpression(mockObservable);

            var expr = new DereferenceExpression(mockTarget, "get");
            expr.eval((x) => {}, null, null, null);

            c.areIdentical(1, mockObservable.delegates.length);

            expr.dispose();

            c.isTrue(mockTarget.isDisposed);
            c.areIdentical(0, mockObservable.delegates.length);
        }


        public testVariableTargetChange(c: tsUnit.TestContext): void {
            var mockTarget = new MockExpression("Hello World");

            var expr = new DereferenceExpression(mockTarget, "length");
            var changeRaised = false;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true; newResult = x}, null, null, null);

            c.areIdentical(11, result);
            c.isFalse(changeRaised);

            mockTarget.raiseChange("Hi There");
            c.isTrue(changeRaised);
            c.areIdentical(8, newResult);
        }

        public testMethodTargetChange(c: tsUnit.TestContext): void {
            var mockTarget = new MockExpression("Hello World");

            var expr = new DereferenceExpression(mockTarget, "toUpperCase");
            var changeRaised = false;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true; newResult = x}, null, null, null);

            c.areIdentical("HELLO WORLD", result([]));
            c.isFalse(changeRaised);

            mockTarget.raiseChange("Hi There");
            c.isTrue(changeRaised);
            c.areIdentical("HI THERE", newResult([]));
        }

        public testObservableMethodTargetChange(c: tsUnit.TestContext): void {
            var observable = new ObservableString("Hello World");
            var mockTarget = new MockExpression(observable);

            var expr = new DereferenceExpression(mockTarget, "get");
            var changeRaised = false;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true; newResult = x}, null, null, null);

            c.areIdentical("Hello World", result([]));
            c.isFalse(changeRaised);

            observable.set("Hi There");
            c.isTrue(changeRaised);
            c.areIdentical("Hi There", newResult([]));
        }

    }
}
