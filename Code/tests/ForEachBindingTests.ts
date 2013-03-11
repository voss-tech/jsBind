/// <reference path="tsUnit.ts" />
/// <reference path="MockExpression.ts" />
/// <reference path="../src/ForEachBinding.ts" />
/// <reference path="../src/ObservableCollection.ts" />

module jsBind {

    export class ForEachBindingTests {

        public testEvaluate(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            elem.innerHTML = "<p data-jsBind=\"prop:innerText=$d\"></p>";

            var expr = new MockExpression([1,2,3]);
            var binding = new ForEachBinding(elem, expr, null, null);

            binding.evaluate();

            c.areIdentical("<p data-jsbind=\"prop:innerText=$d\">1</p><p data-jsbind=\"prop:innerText=$d\">2</p><p data-jsbind=\"prop:innerText=$d\">3</p>", elem.innerHTML);
        }

        public testEvaluateChange(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            elem.innerHTML = "<p data-jsBind=\"prop:innerText=$d\"></p>";

            var expr = new MockExpression([1,2,3]);
            var binding = new ForEachBinding(elem, expr, null, null);

            binding.evaluate();

            expr.raiseChange([4,5]);

            c.areIdentical("<p data-jsbind=\"prop:innerText=$d\">4</p><p data-jsbind=\"prop:innerText=$d\">5</p>", elem.innerHTML);
        }

        public testEvaluateObservableCollection(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            elem.innerHTML = "<p data-jsBind=\"prop:innerText=$d\"></p>";

            var expr = new MockExpression(new ObservableCollection([1,2,3]));
            var binding = new ForEachBinding(elem, expr, null, null);

            binding.evaluate();

            c.areIdentical("<p data-jsbind=\"prop:innerText=$d\">1</p><p data-jsbind=\"prop:innerText=$d\">2</p><p data-jsbind=\"prop:innerText=$d\">3</p>", elem.innerHTML);
        }

        public testEvaluateObservableCollectionInsert(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            elem.innerHTML = "<p data-jsBind=\"prop:innerText=$d\"></p>";

            var coll = new ObservableCollection([1,3]);
            var expr = new MockExpression(coll);
            var binding = new ForEachBinding(elem, expr, null, null);

            binding.evaluate();

            coll.splice(1,0,[2]);

            c.areIdentical("<p data-jsbind=\"prop:innerText=$d\">1</p><p data-jsbind=\"prop:innerText=$d\">2</p><p data-jsbind=\"prop:innerText=$d\">3</p>", elem.innerHTML);
        }

        public testEvaluateObservableCollectionDelete(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            elem.innerHTML = "<p data-jsBind=\"prop:innerText=$d\"></p>";

            var coll = new ObservableCollection([1,2,3]);
            var expr = new MockExpression(coll);
            var binding = new ForEachBinding(elem, expr, null, null);

            binding.evaluate();

            coll.splice(1,1);

            c.areIdentical("<p data-jsbind=\"prop:innerText=$d\">1</p><p data-jsbind=\"prop:innerText=$d\">3</p>", elem.innerHTML);
        }

        public testEvaluateObservableCollectionUpdate(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            elem.innerHTML = "<p data-jsBind=\"prop:innerText=$d\"></p>";

            var coll = new ObservableCollection([1,0,3]);
            var expr = new MockExpression(coll);
            var binding = new ForEachBinding(elem, expr, null, null);

            binding.evaluate();

            coll.set(1,2);

            c.areIdentical("<p data-jsbind=\"prop:innerText=$d\">1</p><p data-jsbind=\"prop:innerText=$d\">2</p><p data-jsbind=\"prop:innerText=$d\">3</p>", elem.innerHTML);
        }

        public testDispose(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            elem.innerHTML = "<p data-jsBind=\"prop:innerText=$d\"></p>";

            var expr = new MockExpression([1,2,3]);
            var binding = new ForEachBinding(elem, expr, null, null);

            binding.dispose();

            c.isTrue(expr.isDisposed);
        }

        
    }
}