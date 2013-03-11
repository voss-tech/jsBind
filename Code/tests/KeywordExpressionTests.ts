/// <reference path="tsUnit.ts" />
/// <reference path="MockExpression.ts" />
/// <reference path="MockObservable.ts" />
/// <reference path="../src/KeywordExpression.ts" />

module jsBind {

    export class KeywordExpressionTests {

        public testEvalTrue(c: tsUnit.TestContext): void {
            var expr = new KeywordExpression("true");
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(true, result);
        }

        public testEvalFalse(c: tsUnit.TestContext): void {
            var expr = new KeywordExpression("false");
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(false, result);
        }

        public testEvalNull(c: tsUnit.TestContext): void {
            var expr = new KeywordExpression("null");
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(null, result);
        }

        public testEvalUndefined(c: tsUnit.TestContext): void {
            var expr = new KeywordExpression("undefined");
            var result = expr.eval((x) => {}, null, null, null);

            c.areIdentical(undefined, result);
        }

        
    }
}
