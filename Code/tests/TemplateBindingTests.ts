/// <reference path="tsUnit.ts" />
/// <reference path="MockExpression.ts" />
/// <reference path="../src/TemplateBinding.ts" />

module jsBind {

    export class TemplateBindingTests {

        public testDispose(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");

            var testElem: any = document.createElement("div");

            var template1: any = document.createElement("div");
            template1.innerHTML = "<p id=\"1\">1</p>";

            elem.appendChild(testElem);
            elem.appendChild(template1);

            var dom = this.getDom();
            dom.innerHTML = "";
            dom.appendChild(elem);

            var expr = new MockExpression("1");
            var binding = new TemplateBinding(testElem, "id", expr, null, null);

            binding.evaluate();

            c.areIdentical("<p id=\"1\">1</p>", testElem.innerHTML);

            binding.dispose();

            c.isTrue(expr.isDisposed);

            expr.raiseChange("2");

            dom.innerHTML = "";
            c.areIdentical("<p id=\"1\">1</p>", testElem.innerHTML);
        }

        public testEvaluate(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");

            var testElem: any = document.createElement("div");

            var template1: any = document.createElement("div");
            template1.innerHTML = "<p id=\"1\">1</p>";

            elem.appendChild(testElem);
            elem.appendChild(template1);

            var dom = this.getDom();
            dom.innerHTML = "";
            dom.appendChild(elem);

            var expr = new MockExpression("1");
            var binding = new TemplateBinding(testElem, "id", expr, null, null);

            binding.evaluate();

            dom.innerHTML = "";
            c.areIdentical("<p id=\"1\">1</p>", testElem.innerHTML);
        }

        public testChange(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");

            var testElem: any = document.createElement("div");

            var template1: any = document.createElement("div");
            template1.innerHTML = "<p id=\"1\">1</p>";

            var template2: any = document.createElement("div");
            template2.innerHTML = "<p id=\"2\">2</p>";

            elem.appendChild(testElem);
            elem.appendChild(template1);
            elem.appendChild(template2);

            var dom = this.getDom();
            dom.innerHTML = "";
            dom.appendChild(elem);

            var expr = new MockExpression("1");
            var binding = new TemplateBinding(testElem, "id", expr, null, null);

            binding.evaluate();

            expr.raiseChange("2");

            dom.innerHTML = "";
            c.areIdentical("<p id=\"2\">2</p>", testElem.innerHTML);
        }

        private getDom(): any 
        {
            var element = null;

            if (document.getElementById) {
                // Modern technique
                element = document.getElementById("dom");
            } else if (document.all) {
                // Older IE
                element = document.all["dom"];
            } else if ((<any>document).layers) {
                // Older FireFox (cast to any because TypeScript doesn't define the layers property in its standard library)
                element = (<any>document).layers["dom"];
            }

            return element;
        }
    }
}