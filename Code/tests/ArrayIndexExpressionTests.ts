/// <reference path="tsUnit.ts" />
/// <reference path="MockExpression.ts" />
/// <reference path="../src/ArrayIndexExpression.ts" />

module jsBind {

    export class ArrayIndexExpressionTests {

        public testEval(c: tsUnit.TestContext): void {
            var mockArray = new MockExpression([1, 2, 3]);
            var mockIndex = new MockExpression(1);

            var expr = new ArrayIndexExpression(mockArray, mockIndex);
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(2, result);
        }

        private testIndexChange(c: tsUnit.TestContext): void {
            var mockArray = new MockExpression([1, 2, 3]);
            var mockIndex = new MockExpression(1);

            var expr = new ArrayIndexExpression(mockArray, mockIndex);

            var changeRaised: bool;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true; newResult = x}, null, null, null);

            c.isFalse(changeRaised);
            c.areIdentical(2, result);

            mockIndex.raiseChange(2);

            c.isTrue(changeRaised);
            c.areIdentical(3, newResult);
        }

        private testIndexChangeSameValueIgnored(c: tsUnit.TestContext): void {
            var mockArray = new MockExpression([1, 2, 3]);
            var mockIndex = new MockExpression(1);

            var expr = new ArrayIndexExpression(mockArray, mockIndex);

            var changeRaised: bool;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true; newResult = x}, null, null, null);

            c.isFalse(changeRaised);
            c.areIdentical(2, result);

            mockIndex.raiseChange(1);

            c.isFalse(changeRaised);
        }

        private testArrayChange(c: tsUnit.TestContext): void {
            var mockArray = new MockExpression([1, 2, 3]);
            var mockIndex = new MockExpression(1);

            var expr = new ArrayIndexExpression(mockArray, mockIndex);

            var changeRaised: bool;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true; newResult = x}, null, null, null);

            c.isFalse(changeRaised);
            c.areIdentical(2, result);

            mockArray.raiseChange([10,20,30]);

            c.isTrue(changeRaised);
            c.areIdentical(20, newResult);
        }

        private testArrayChangeSameValueIgnored(c: tsUnit.TestContext): void {
            var array = [1, 2, 3];
            var mockArray = new MockExpression(array);
            var mockIndex = new MockExpression(1);

            var expr = new ArrayIndexExpression(mockArray, mockIndex);

            var changeRaised: bool;
            var newResult;
            var result = expr.eval((x) => {changeRaised = true; newResult = x}, null, null, null);

            c.isFalse(changeRaised);
            c.areIdentical(2, result);

            mockArray.raiseChange(array);

            c.isFalse(changeRaised);
        }

        private testDispose(c: tsUnit.TestContext): void {
            var mockArray = new MockExpression([1, 2, 3]);
            var mockIndex = new MockExpression(1);

            var expr = new ArrayIndexExpression(mockArray, mockIndex);

            expr.dispose();

            c.isTrue(mockArray.isDisposed);
            c.isTrue(mockIndex.isDisposed);
        }

    }
}