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

            // We compare against a lower case string content because different browsers use different case ruels (IE8 uses upper case <p> tags)
            var str: string = elem.innerHTML;
            str = str.toLowerCase();

            // IE 8 adds new lines between the p tags
            str = str.replace(">\r\n<", "><");
            str = str.replace(">\r\n<", "><");

            c.areIdentical("<p data-jsbind=\"prop:innertext=$d\">1</p><p data-jsbind=\"prop:innertext=$d\">2</p><p data-jsbind=\"prop:innertext=$d\">3</p>", str);
        }

        public testEvaluateChange(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            elem.innerHTML = "<p data-jsBind=\"prop:innerText=$d\"></p>";

            var expr = new MockExpression([1,2,3]);
            var binding = new ForEachBinding(elem, expr, null, null);

            binding.evaluate();

            expr.raiseChange([4,5]);

            // We compare against a lower case string content because different browsers use different case ruels (IE8 uses upper case <p> tags)
            var str: string = elem.innerHTML;
            str = str.toLowerCase();

            // IE 8 adds new lines between the p tags
            str = str.replace(">\r\n<", "><");

            c.areIdentical("<p data-jsbind=\"prop:innertext=$d\">4</p><p data-jsbind=\"prop:innertext=$d\">5</p>", str);
        }

        public testEvaluateObservableCollection(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            elem.innerHTML = "<p data-jsBind=\"prop:innerText=$d\"></p>";

            var expr = new MockExpression(new ObservableCollection([1,2,3]));
            var binding = new ForEachBinding(elem, expr, null, null);

            binding.evaluate();

            // We compare against a lower case string content because different browsers use different case ruels (IE8 uses upper case <p> tags)
            var str: string = elem.innerHTML;
            str = str.toLowerCase();

            // IE 8 adds new lines between the p tags
            str = str.replace(">\r\n<", "><");
            str = str.replace(">\r\n<", "><");

            c.areIdentical("<p data-jsbind=\"prop:innertext=$d\">1</p><p data-jsbind=\"prop:innertext=$d\">2</p><p data-jsbind=\"prop:innertext=$d\">3</p>", str);
        }

        public testEvaluateObservableCollectionInsert(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            elem.innerHTML = "<p data-jsBind=\"prop:innerText=$d\"></p>";

            var coll = new ObservableCollection([1,3]);
            var expr = new MockExpression(coll);
            var binding = new ForEachBinding(elem, expr, null, null);

            binding.evaluate();

            coll.splice(1,0,[2]);

            // We compare against a lower case string content because different browsers use different case ruels (IE8 uses upper case <p> tags)
            var str: string = elem.innerHTML;
            str = str.toLowerCase();

            // IE 8 adds new lines between the p tags
            str = str.replace(">\r\n<", "><");
            str = str.replace(">\r\n<", "><");

            c.areIdentical("<p data-jsbind=\"prop:innertext=$d\">1</p><p data-jsbind=\"prop:innertext=$d\">2</p><p data-jsbind=\"prop:innertext=$d\">3</p>", str);
        }

        public testEvaluateObservableCollectionDelete(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            elem.innerHTML = "<p data-jsBind=\"prop:innerText=$d\"></p>";

            var coll = new ObservableCollection([1,2,3]);
            var expr = new MockExpression(coll);
            var binding = new ForEachBinding(elem, expr, null, null);

            binding.evaluate();

            coll.splice(1,1);

            // We compare against a lower case string content because different browsers use different case ruels (IE8 uses upper case <p> tags)
            var str: string = elem.innerHTML;
            str = str.toLowerCase();

            // IE 8 adds new lines between the p tags
            str = str.replace(">\r\n<", "><");

            c.areIdentical("<p data-jsbind=\"prop:innertext=$d\">1</p><p data-jsbind=\"prop:innertext=$d\">3</p>", str);
        }

        public testEvaluateObservableCollectionUpdate(c: tsUnit.TestContext): void {
            var elem:any = document.createElement("div");
            elem.innerHTML = "<p data-jsBind=\"prop:innerText=$d\"></p>";

            var coll = new ObservableCollection([1,0,3]);
            var expr = new MockExpression(coll);
            var binding = new ForEachBinding(elem, expr, null, null);

            binding.evaluate();

            coll.set(1,2);

            // We compare against a lower case string content because different browsers use different case ruels (IE8 uses upper case <p> tags)
            var str:string = elem.innerHTML;
            str = str.toLowerCase();

            // IE 8 adds new lines between the p tags
            str = str.replace(">\r\n<", "><");
            str = str.replace(">\r\n<", "><");

            c.areIdentical("<p data-jsbind=\"prop:innertext=$d\">1</p><p data-jsbind=\"prop:innertext=$d\">2</p><p data-jsbind=\"prop:innertext=$d\">3</p>", str);
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