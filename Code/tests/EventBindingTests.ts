/// <reference path="tsUnit.ts" />
/// <reference path="MockExpression.ts" />
/// <reference path="../src/EventBinding.ts" />

module jsBind {

    private fireEvent(elem: any): void {
        if (document.createEventObject) {
            // IE 9 & 10
            var event: any = document.createEventObject();
            event.eventType = "onclick";
            elem.fireEvent("onclick", event);
        } else if (dispatchEvent) {
            // For DOM
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", false, true);
            elem.dispatchEvent(evt);
        } else {
            // IE 8-
            elem.fireEvent("onclick");
        }
    }

    export class EventBindingTests {

        public testEvaluate(c: tsUnit.TestContext): void {
            var elem: any = document.getElementById("Results");

            var expr = new MockExpression(42);
            var binding = new EventBinding(elem, "click", expr, null, null);

            binding.evaluate();

            fireEvent(elem);

            c.isTrue(expr.wasEvaluated);
        }

        public testDispose(c: tsUnit.TestContext): void {
            var elem: any = document.getElementById("Results");

            var expr = new MockExpression(42);
            var binding = new EventBinding(elem, "click", expr, null, null);
            binding.evaluate();

            // Check the dispose occurs
            binding.dispose();
            c.isTrue(expr.isDisposed);

            fireEvent(elem);

            c.isFalse(expr.wasEvaluated);
        }

    }
}