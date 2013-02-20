/// <reference path="tsUnit.ts" />
/// <reference path="BinderTests.ts" />
/// <reference path="ObservableTests.ts" />

window.addEventListener("load", () => {

    var test = new tsUnit.Test();

    test.addTestClass(new jsBind.BinderTests());
    test.addTestClass(new jsBind.ObservableTests());

    test.showResults(document.getElementById("Results"), test.run());
}, false);


