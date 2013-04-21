/// <reference path="tsUnit.ts" />
/// <reference path="MockExpression.ts" />
/// <reference path="../src/PropBinding.ts" />

module jsBind {

    export class PropBindingTests {

        public testDispose(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            var path = ["innerText"];
            var expr = new MockExpression(0);
            var dc = "Hello World";
            var pc = null;
            var binding = new PropBinding(elem, path, expr, dc, pc);

            binding.dispose();

            c.isTrue(expr.isDisposed);
        }

        public testEvaluateInnerText(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            var path = ["innerText"];
            var expr = new MockExpression("Hello World");
            var dc = null;
            var pc = null;
            var binding = new PropBinding(elem, path, expr, dc, pc);

            binding.evaluate();

            if (elem.innerText != undefined) {
                c.areIdentical("Hello World", elem.innerText);
            } else {
                c.areIdentical("Hello World", elem.textContent);
            }
        }

        public testChangeInnerText(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            var path = ["innerText"];
            var expr = new MockExpression("Hello World");
            var dc = null;
            var pc = null;
            var binding = new PropBinding(elem, path, expr, dc, pc);

            binding.evaluate();

            expr.raiseChange("Hi There");

            if (elem.innerText != undefined) {
                c.areIdentical("Hi There", elem.innerText);
            } else {
                c.areIdentical("Hi There", elem.textContent);
            }
        }

        public testEvaluateStyle(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            var path = ["style","height"];
            var expr = new MockExpression("10px");
            var dc = null;
            var pc = null;
            var binding = new PropBinding(elem, path, expr, dc, pc);

            binding.evaluate();

            c.areIdentical("10px", elem.style.height);
        }

        public testChangeStyle(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            var path = ["style","height"];
            var expr = new MockExpression("10px");
            var dc = null;
            var pc = null;
            var binding = new PropBinding(elem, path, expr, dc, pc);

            binding.evaluate();

            expr.raiseChange("20px");

            c.areIdentical("20px", elem.style.height);
        }

        public testEvaluateBrowserPrefixStyle(c: tsUnit.TestContext): void {
            var elem: any = document.createElement("div");

            // IE 8- Doesnt use browser prefixes so we dont need this test
            if (!elem.style.transform)
                return;

            var path = ["style", "transform"];
            var expr = new MockExpression("rotate(90deg)");
            var dc = null;
            var pc = null;
            var binding = new PropBinding(elem, path, expr, dc, pc);

            binding.evaluate();

            if (elem.style.transform != undefined) {
                c.areIdentical("rotate(90deg)", elem.style.transform);
            } else if (elem.style.webkitTransform != undefined) {
                c.areIdentical("rotate(90deg)", elem.style.webkitTransform);            
            } else if (elem.style.MozTransform != undefined) {
                c.areIdentical("rotate(90deg)", elem.style.MozTransform);            
            } else if (elem.style.msTransform != undefined) {
                c.areIdentical("rotate(90deg)", elem.style.msTransform);            
            } else if (elem.style.oTransform != undefined) {
                c.areIdentical("rotate(90deg)", elem.style.oTransform);            
            } else {
                c.fail();
            }
        }

        public testChangeBrowserPrefixStyle(c: tsUnit.TestContext): void {
            var elem: any = document.createElement("div");

            // IE 8- Doesnt use browser prefixes so we dont need this test
            if (!elem.style.transform)
                return;

            var path = ["style", "transform"];
            var expr = new MockExpression("rotate(90deg)");
            var dc = null;
            var pc = null;
            var binding = new PropBinding(elem, path, expr, dc, pc);

            binding.evaluate();

            expr.raiseChange("rotate(180deg)");

            if (elem.style.transform != undefined) {
                c.areIdentical("rotate(180deg)", elem.style.transform);
            } else if (elem.style.webkitTransform != undefined) {
                c.areIdentical("rotate(180deg)", elem.style.webkitTransform);            
            } else if (elem.style.MozTransform != undefined) {
                c.areIdentical("rotate(180deg)", elem.style.MozTransform);            
            } else if (elem.style.msTransform != undefined) {
                c.areIdentical("rotate(180deg)", elem.style.msTransform);            
            } else if (elem.style.oTransform != undefined) {
                c.areIdentical("rotate(180deg)", elem.style.oTransform);            
            } else {
                c.fail();
            }
        }
    }
}