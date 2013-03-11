/// <reference path="tsUnit.ts" />
/// <reference path="../src/LiteralExpression.ts" />

module jsBind {

    export class LiteralExpressionTests {

        public testEval(c: tsUnit.TestContext): void {
            var expr = new LiteralExpression(42);
            c.areIdentical(42, expr.eval(null, null, null, null));
        }

    }
}