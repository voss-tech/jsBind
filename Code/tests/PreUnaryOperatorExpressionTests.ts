/// <reference path="tsUnit.ts" />
/// <reference path="MockExpression.ts" />
/// <reference path="../src/PreUnaryOperatorExpression.ts" />

module jsBind {

    export class PreUnaryOperatorExpressionTests {

        public testEvalOpMinus(c: tsUnit.TestContext): void {
            var mockValue = new MockExpression(42);

            var expr = new PreUnaryOperatorExpression("-", mockValue);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(-42, result);
        }

        public testEvalOpPlusConv(c: tsUnit.TestContext): void {
            var mockValue = new MockExpression("42");

            var expr = new PreUnaryOperatorExpression("+", mockValue);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(42, result);
        }

        public testEvalOpMinusConf(c: tsUnit.TestContext): void {
            var mockValue = new MockExpression("42");

            var expr = new PreUnaryOperatorExpression("-", mockValue);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(-42, result);
        }

        public testEvalOpNegate(c: tsUnit.TestContext): void {
            var mockValue = new MockExpression(true);

            var expr = new PreUnaryOperatorExpression("!", mockValue);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(false, result);
        }

        public testEvalOpTwosComplement(c: tsUnit.TestContext): void {
            var mockValue = new MockExpression(42);

            var expr = new PreUnaryOperatorExpression("~", mockValue);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(~42, result);
        }
        
        public testEvalOpTypeOf(c: tsUnit.TestContext): void {
            var mockValue = new MockExpression(42);

            var expr = new PreUnaryOperatorExpression("typeof", mockValue);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(typeof(42), result);
        }

        public testDispose(c: tsUnit.TestContext): void {
            var mockValue = new MockExpression(42);

            var expr = new PreUnaryOperatorExpression("-", mockValue);

            expr.dispose();

            c.isTrue(mockValue.isDisposed);
        }

        public testChange(c: tsUnit.TestContext): void {
            var mockValue = new MockExpression(42);

            var expr = new PreUnaryOperatorExpression("-", mockValue);
            var changeRaised = false;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true; newResult = x}, null, null, null);

            c.areIdentical(-42, result);

            mockValue.raiseChange(24);

            c.isTrue(changeRaised);
            c.areIdentical(-24, newResult);
        }

        public testChangeToSameValue(c: tsUnit.TestContext): void {
            var mockValue = new MockExpression(42);

            var expr = new PreUnaryOperatorExpression("-", mockValue);
            var changeRaised = false;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true; newResult = x}, null, null, null);

            c.areIdentical(-42, result);

            mockValue.raiseChange(42);

            c.isFalse(changeRaised);
        }
    }
}