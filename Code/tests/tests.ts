/// <reference path="tsUnit.ts" />
/// <reference path="BinderTests.ts" />

/// <reference path="ArrayExpressionTests.ts" />
/// <reference path="ArrayIndexExpressionTests.ts" />
/// <reference path="BinaryOperatorExpressionTests.ts" />
/// <reference path="ConditionExpressionTests.ts" />
/// <reference path="DereferenceExpressionTests.ts" />
/// <reference path="FunctionCallExpressionTests.ts" />
/// <reference path="KeywordExpressionTests.ts" />
/// <reference path="LiteralExpressionTests.ts" />
/// <reference path="ObservableBoolTests.ts" />
/// <reference path="ObservableNumberTests.ts" />
/// <reference path="ObservableStringTests.ts" />
/// <reference path="ObservableValueTests.ts" />
/// <reference path="PreUnaryOperatorExpressionTests.ts" />
/// <reference path="VariableReferenceExpressionTests.ts" />

/// <reference path="EventBindingTests.ts" />
/// <reference path="ForEachBindingTests.ts" />
/// <reference path="PropBindingTests.ts" />
/// <reference path="TemplateBindingTests.ts" />

window.addEventListener("load", () => {

    var test = new tsUnit.Test();

    test.addTestClass(new jsBind.ArrayExpressionTests(), "ArrayExpression");
    test.addTestClass(new jsBind.ArrayIndexExpressionTests(), "ArrayIndexExpression");
    test.addTestClass(new jsBind.BinaryOperatorExpressionTests(), "BinaryOperatorExpression");
    test.addTestClass(new jsBind.ConditionExpressionTests(), "ConditionExpression");
    test.addTestClass(new jsBind.DereferenceExpressionTests(), "DereferenceExpression");
    test.addTestClass(new jsBind.FunctionCallExpressionTests(), "FunctionCallExpression");
    test.addTestClass(new jsBind.KeywordExpressionTests(), "KeywordExpression");
    test.addTestClass(new jsBind.LiteralExpressionTests(), "LiteralExpression");
    test.addTestClass(new jsBind.ObservableBoolTests(), "ObservableBool");
    test.addTestClass(new jsBind.ObservableNumberTests(), "ObservableNumber");
    test.addTestClass(new jsBind.ObservableStringTests(), "ObservableString");
    test.addTestClass(new jsBind.ObservableValueTests(), "ObservableValue");
    test.addTestClass(new jsBind.PreUnaryOperatorExpressionTests(), "PreUnaryOperatorExpression");
    test.addTestClass(new jsBind.VariableReferenceExpressionTests(), "VariableReferenceExpression");

    test.addTestClass(new jsBind.EventBindingTests(), "EventBinding");
    test.addTestClass(new jsBind.ForEachBindingTests(), "ForEachBinding");
    test.addTestClass(new jsBind.PropBindingTests(), "PropBinding");
    test.addTestClass(new jsBind.TemplateBindingTests(), "TemplateBinding");


    test.addTestClass(new jsBind.BinderTests(), "Binder");

    test.showResults(document.getElementById("Results"), test.run());
}, false);


