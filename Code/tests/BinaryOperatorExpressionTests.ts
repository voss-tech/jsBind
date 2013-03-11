/// <reference path="tsUnit.ts" />
/// <reference path="MockExpression.ts" />
/// <reference path="../src/BinaryOperatorExpression.ts" />

module jsBind {

    export class BinaryOperatorExpressionTests {

        public testEvalOpBoolOr(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(true);
            var mockRhs = new MockExpression(false);

            var expr = new BinaryOperatorExpression(mockLhs, "||", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(true, result);
        }

        public testEvalOpBoolAnd(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(true);
            var mockRhs = new MockExpression(false);

            var expr = new BinaryOperatorExpression(mockLhs, "&&", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(false, result);
        }

        public testEvalOpBinOr(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(0x0f);
            var mockRhs = new MockExpression(0xf0);

            var expr = new BinaryOperatorExpression(mockLhs, "|", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(0xff, result);
        }

        public testEvalOpBinAnd(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(0x0f);
            var mockRhs = new MockExpression(0xf0);

            var expr = new BinaryOperatorExpression(mockLhs, "&", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(0x00, result);
        }

        public testEvalOpBinXOr(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(0x0f);
            var mockRhs = new MockExpression(0xff);

            var expr = new BinaryOperatorExpression(mockLhs, "^", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(0xf0, result);
        }

        public testEvalOpEqual(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(42);
            var mockRhs = new MockExpression(42);

            var expr = new BinaryOperatorExpression(mockLhs, "==", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(true, result);
        }

        public testEvalOpNotEqual(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(42);
            var mockRhs = new MockExpression(42);

            var expr = new BinaryOperatorExpression(mockLhs, "!=", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(false, result);
        }

        public testEvalOpExactNotEqual(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(42);
            var mockRhs = new MockExpression(42);

            var expr = new BinaryOperatorExpression(mockLhs, "!==", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(false, result);
        }

        public testEvalOpLessThan(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(24);
            var mockRhs = new MockExpression(42);

            var expr = new BinaryOperatorExpression(mockLhs, "<", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(true, result);
        }

        public testEvalOpGreaterThan(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(24);
            var mockRhs = new MockExpression(42);

            var expr = new BinaryOperatorExpression(mockLhs, ">", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(false, result);
        }

        public testEvalOpLessThanOrEqual(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(24);
            var mockRhs = new MockExpression(42);

            var expr = new BinaryOperatorExpression(mockLhs, "<=", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(true, result);
        }

        public testEvalOpGreaterThanOrEqual(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(24);
            var mockRhs = new MockExpression(42);

            var expr = new BinaryOperatorExpression(mockLhs, ">=", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(false, result);
        }

        public testEvalOpIn(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(2);
            var mockRhs = new MockExpression([1, 2, 3, 4]);

            var expr = new BinaryOperatorExpression(mockLhs, "in", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(true, result);
        }

        // Removed until I can come up with a way to implement instanceof operator
        /*public testEvalOpInstanceOf(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(new String("Hello World"));
            var mockRhs = new MockExpression(typeof(String));

            var expr = new BinaryOperatorExpression(mockLhs, "instanceof", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(true, result);
        }*/

        public testEvalOpShiftRight(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(0x10);
            var mockRhs = new MockExpression(2);

            var expr = new BinaryOperatorExpression(mockLhs, ">>", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(0x10 >> 2, result);
        }

        public testEvalOpShiftLeft(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(1);
            var mockRhs = new MockExpression(2);

            var expr = new BinaryOperatorExpression(mockLhs, "<<", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(1 << 2, result);
        }

        public testEvalOpShiftArithmeticRight(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(-32);
            var mockRhs = new MockExpression(2);

            var expr = new BinaryOperatorExpression(mockLhs, ">>>", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(-31 >>> 2, result);
        }

        public testEvalOpAdd(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(6);
            var mockRhs = new MockExpression(7);

            var expr = new BinaryOperatorExpression(mockLhs, "+", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(6 + 7, result);
        }

        public testEvalOpSubtract(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(6);
            var mockRhs = new MockExpression(7);

            var expr = new BinaryOperatorExpression(mockLhs, "-", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(6 - 7, result);
        }

        public testEvalOpMultiply(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(6);
            var mockRhs = new MockExpression(7);

            var expr = new BinaryOperatorExpression(mockLhs, "*", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(6 * 7, result);
        }

        public testEvalOpDivide(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(6);
            var mockRhs = new MockExpression(7);

            var expr = new BinaryOperatorExpression(mockLhs, "/", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(6 / 7, result);
        }

        public testEvalOpModulo(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(6);
            var mockRhs = new MockExpression(7);

            var expr = new BinaryOperatorExpression(mockLhs, "%", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(6 % 7, result);
        }

        public testDispose(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(1);
            var mockRhs = new MockExpression(2);

            var expr = new BinaryOperatorExpression(mockLhs, "+", mockRhs);
            var result = expr.eval((x) => {}, null, null, null);

            expr.dispose();

            c.isTrue(mockLhs.isDisposed);
            c.isTrue(mockRhs.isDisposed);
        }

        public testLhsChange(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(1);
            var mockRhs = new MockExpression(2);

            var expr = new BinaryOperatorExpression(mockLhs, "+", mockRhs);

            var changeRaised: bool;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true; newResult = x}, null, null, null);

            c.isFalse(changeRaised);
            c.areIdentical(3, result);

            mockLhs.raiseChange(2);

            c.isTrue(changeRaised);
            c.areIdentical(4, newResult);
        }

        public testLhsChangeIgnoredWhenSameValue(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(1);
            var mockRhs = new MockExpression(2);

            var expr = new BinaryOperatorExpression(mockLhs, "+", mockRhs);

            var changeRaised: bool;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true; newResult = x}, null, null, null);

            c.isFalse(changeRaised);
            c.areIdentical(3, result);

            mockLhs.raiseChange(1);

            c.isFalse(changeRaised);
        }

        public testRhsChange(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(1);
            var mockRhs = new MockExpression(2);

            var expr = new BinaryOperatorExpression(mockLhs, "+", mockRhs);

            var changeRaised: bool;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true; newResult = x}, null, null, null);

            c.isFalse(changeRaised);
            c.areIdentical(3, result);

            mockRhs.raiseChange(3);

            c.isTrue(changeRaised);
            c.areIdentical(4, newResult);
        }

        public testRhsChangeIgnoredWhenSameValue(c: tsUnit.TestContext): void {
            var mockLhs = new MockExpression(1);
            var mockRhs = new MockExpression(2);

            var expr = new BinaryOperatorExpression(mockLhs, "+", mockRhs);

            var changeRaised: bool;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true; newResult = x}, null, null, null);

            c.isFalse(changeRaised);
            c.areIdentical(3, result);

            mockRhs.raiseChange(2);

            c.isFalse(changeRaised);
        }

    }
}