/// <reference path="tsUnit.ts" />
/// <reference path="MockExpression.ts" />
/// <reference path="../src/ConditionExpression.ts" />

module jsBind {

    export class ConditionExpressionTests {

        public testEvalTrue(c: tsUnit.TestContext): void {
            var mockCond = new MockExpression(true);
            var mockTrue = new MockExpression(42);
            var mockFalse = new MockExpression(24);

            var expr = new ConditionExpression(mockCond, mockTrue, mockFalse);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(42, result);
        }

        public testEvalFalse(c: tsUnit.TestContext): void {
            var mockCond = new MockExpression(false);
            var mockTrue = new MockExpression(42);
            var mockFalse = new MockExpression(24);

            var expr = new ConditionExpression(mockCond, mockTrue, mockFalse);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(24, result);
        }
        
        public testEvalCondChange(c: tsUnit.TestContext): void {
            var mockCond = new MockExpression(false);
            var mockTrue = new MockExpression(42);
            var mockFalse = new MockExpression(24);

            var expr = new ConditionExpression(mockCond, mockTrue, mockFalse);

            var changeRaised: bool;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true, newResult = x}, null, null, null);

            c.areIdentical(24, result);

            mockCond.raiseChange(true);

            c.isTrue(changeRaised);
            c.areIdentical(42, newResult);
        }

        public testEvalTrueExprChange(c: tsUnit.TestContext): void {
            var mockCond = new MockExpression(true);
            var mockTrue = new MockExpression(42);
            var mockFalse = new MockExpression(24);

            var expr = new ConditionExpression(mockCond, mockTrue, mockFalse);

            var changeRaised: bool;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true, newResult = x}, null, null, null);

            c.areIdentical(42, result);

            mockTrue.raiseChange(6);

            c.isTrue(changeRaised);
            c.areIdentical(6, newResult);
        }

        public testEvalTrueExprChangeIgnoredWhenNotNeeded(c: tsUnit.TestContext): void {
            var mockCond = new MockExpression(true);
            var mockTrue = new MockExpression(42);
            var mockFalse = new MockExpression(24);

            var expr = new ConditionExpression(mockCond, mockTrue, mockFalse);

            var changeRaised: bool;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true, newResult = x}, null, null, null);
            c.areIdentical(42, result);

            // Switch the condition so that both sides are evaluated once.  This allows both change
            // handlers to be hooked for the test
            mockCond.raiseChange(false);

            c.isTrue(changeRaised);
            c.areIdentical(24, newResult);

            changeRaised = false;
            mockTrue.raiseChange(6);

            c.isFalse(changeRaised);
        }

        public testEvalFalseExprChange(c: tsUnit.TestContext): void {
            var mockCond = new MockExpression(false);
            var mockTrue = new MockExpression(42);
            var mockFalse = new MockExpression(24);

            var expr = new ConditionExpression(mockCond, mockTrue, mockFalse);

            var changeRaised: bool;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true, newResult = x}, null, null, null);

            c.areIdentical(24, result);

            mockFalse.raiseChange(6);

            c.isTrue(changeRaised);
            c.areIdentical(6, newResult);
        }

        public testEvalFalseExprChangeIgnoredWhenNotNeeded(c: tsUnit.TestContext): void {
            var mockCond = new MockExpression(false);
            var mockTrue = new MockExpression(42);
            var mockFalse = new MockExpression(24);

            var expr = new ConditionExpression(mockCond, mockTrue, mockFalse);

            var changeRaised: bool;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true, newResult = x}, null, null, null);
            c.areIdentical(24, result);

            // Switch the condition so that both sides are evaluated once.  This allows both change
            // handlers to be hooked for the test
            mockCond.raiseChange(true);
            
            c.isTrue(changeRaised);
            c.areIdentical(42, newResult);

            changeRaised = false;
            mockFalse.raiseChange(6);

            c.isFalse(changeRaised);
        }

        public testDispose(c: tsUnit.TestContext): void {
            var mockCond = new MockExpression(true);
            var mockTrue = new MockExpression(42);
            var mockFalse = new MockExpression(24);

            var expr = new ConditionExpression(mockCond, mockTrue, mockFalse);

            expr.dispose();

            c.isTrue(mockCond.isDisposed);
            c.isTrue(mockTrue.isDisposed);
            c.isTrue(mockFalse.isDisposed);
        }

    }
}
