/// <reference path="tsUnit.ts" />
/// <reference path="MockExpression.ts" />
/// <reference path="../src/ArrayExpression.ts" />

module jsBind {

    export class ArrayExpressionTests {

        public testEvalEmptyArray(c: tsUnit.TestContext): void {
            var expr = new ArrayExpression([]);
            var result = expr.eval((x) => {}, null, null, null);

            c.isTrue(result instanceof Array);
            c.isTrue(result.length === 0);
        }

        public testEvalOneElementArray(c: tsUnit.TestContext): void {
            var expr = new ArrayExpression([new MockExpression(42)]);
            var result = expr.eval((x) => {}, null, null, null);

            c.isTrue(result instanceof Array);
            c.isTrue(result.length === 1);
            c.isTrue(result[0] === 42);
        }

        public testEvalTwoElementArray(c: tsUnit.TestContext): void {
            var expr = new ArrayExpression([new MockExpression(1), new MockExpression(2)]);
            var result = expr.eval((x) => {}, null, null, null);

            c.isTrue(result instanceof Array);
            c.isTrue(result.length === 2);
            c.isTrue(result[0] === 1);
            c.isTrue(result[1] === 2);
        }

	public testEvalOneElementArrayChangeFunc(c: tsUnit.TestContext): void {
            var mock = new MockExpression(1);

            var expr = new ArrayExpression([mock]);

            var changeRaised: bool;
            var newResult;

            var result = expr.eval((x) => {changeRaised = true; newResult = x;}, null, null, null);

            c.isFalse(changeRaised);
            c.isTrue(result instanceof Array);
            c.areIdentical(1, result.length);
            c.isTrue(result[0] == 1);

            mock.raiseChange(2);

            c.isTrue(changeRaised);
            c.isTrue(newResult instanceof Array);
            c.areIdentical(1, newResult.length);
            c.isTrue(newResult[0] == 2);
        }

	public testEvalOneElementArrayChangeFuncIgnoredWhenValueDoesNotChange(c: tsUnit.TestContext): void {
            var mock = new MockExpression(1);

            var expr = new ArrayExpression([mock]);

            var changeRaised: bool;
            var newResult;

            var result = expr.eval((x) => {changeRaised = true; newResult = x;}, null, null, null);

            c.isFalse(changeRaised);
            c.isTrue(result instanceof Array);
            c.areIdentical(1, result.length);
            c.isTrue(result[0] == 1);

            mock.raiseChange(1);

            c.isFalse(changeRaised);
        }

        private testDispose(c: tsUnit.TestContext): void {
            var mock1 = new MockExpression(1);
            var mock2 = new MockExpression(2);
            var mock3 = new MockExpression(3);

            var expr = new ArrayExpression([mock1, mock2, mock3]);

            expr.dispose();

            c.isTrue(mock1.isDisposed);
            c.isTrue(mock2.isDisposed);
            c.isTrue(mock3.isDisposed);
        }
    }
}