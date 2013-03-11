/// <reference path="tsUnit.ts" />
/// <reference path="MockExpression.ts" />
/// <reference path="../src/EventBinding.ts" />

module jsBind {

    export class EventBindingTests {

        public testEvaluate(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");

            var expr = new MockExpression(42);
            var binding = new EventBinding(elem, "change", expr, null, null);

            binding.evaluate();

            if ("fireEvent" in elem) {
                // IE
                elem.fireEvent("onchange");
            } else {
                // For DOM
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);
                elem.dispatchEvent(evt);
            }

            c.isTrue(expr.wasEvaluated);
        }

        public testDispose(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");

            var expr = new MockExpression(42);
            var binding = new EventBinding(elem, "change", expr, null, null);
            binding.evaluate();

            // Check the dispose occurs
            binding.dispose();
            c.isTrue(expr.isDisposed);

            // The event should no longer be handled now that we are disposed
            if ("fireEvent" in elem) {
                // IE
                elem.fireEvent("onchange");
            } else {
                // For DOM
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);
                elem.dispatchEvent(evt);
            }

            c.isFalse(expr.wasEvaluated);
        }

    }
}