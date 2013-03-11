/// <reference path="tsUnit.ts" />
/// <reference path="MockExpression.ts" />
/// <reference path="MockObservable.ts" />
/// <reference path="../src/FunctionCallExpression.ts" />

module jsBind {

    export class FunctionCallExpressionTests {

        public testEval(c: tsUnit.TestContext): void {
            var mockIdentifier = new MockExpression(() => {return 42;});

            var expr = new FunctionCallExpression(mockIdentifier, []);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(42, result);
        }

        public testEvalWithArg(c: tsUnit.TestContext): void {
            var mockIdentifier = new MockExpression((x) => {return x;});
            var mockArg = new MockExpression(42);

            var expr = new FunctionCallExpression(mockIdentifier, [mockArg]);
            var result = expr.eval((x) => {}, null, null, null);

            c.areEqual(42, result);
        }

        public testDisposeWithArg(c: tsUnit.TestContext): void {
            var mockIdentifier = new MockExpression((x) => {return x;});
            var mockArg = new MockExpression(42);

            var expr = new FunctionCallExpression(mockIdentifier, [mockArg]);
            
            expr.dispose();

            c.isTrue(mockIdentifier.isDisposed);
            c.isTrue(mockArg.isDisposed);
        }

        public testChangeArg(c: tsUnit.TestContext): void {
            var mockIdentifier = new MockExpression((x) => {return x;});
            var mockArg = new MockExpression(42);

            var expr = new FunctionCallExpression(mockIdentifier, [mockArg]);
            var changeRaised = false;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true; newResult = x}, null, null, null);
            c.areEqual(42, result);

            mockArg.raiseChange(24);

            c.areEqual(24, newResult);
        }

        // In practice this cant actually happen.  Its implemented anyway for completeness.
        public testChangeIdentifier(c: tsUnit.TestContext): void {
            var mockIdentifier = new MockExpression((x) => {return 0;});
            var mockArg = new MockExpression(42);

            var expr = new FunctionCallExpression(mockIdentifier, [mockArg]);
            var changeRaised = false;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true; newResult = x}, null, null, null);
            c.areIdentical(0, result);

            mockIdentifier.raiseChange((x) => {return x;});

            c.areEqual(42, newResult);
        }
    }
}
