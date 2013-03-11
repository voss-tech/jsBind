/// <reference path="tsUnit.ts" />
/// <reference path="MockExpression.ts" />
/// <reference path="../src/VariableReferenceExpression.ts" />

module jsBind {

    export class VariableReferenceExpressionTests {

        public testEvalD(c: tsUnit.TestContext): void {
            var expr = new VariableReferenceExpression("$d");
            var result = expr.eval((x) => {}, "d", null, null);

            c.areIdentical("d", result);
        }

        public testEvalP(c: tsUnit.TestContext): void {
            var expr = new VariableReferenceExpression("$p");
            var result = expr.eval((x) => {}, null, "p", null);

            c.areIdentical("p", result);
        }

        public testEvalE(c: tsUnit.TestContext): void {
            var expr = new VariableReferenceExpression("$e");
            var result = expr.eval((x) => {}, null, null, "e");

            c.areIdentical("e", result);
        }
        
    }
}