/// <reference path="tsUnit.ts" />
/// <reference path="../src/Binder.ts" />

module jsBind {

    class MockInnerModel {
        public value: string = "Hello World";
    }

    class MockModel {
        public value: string;

        public values: string[] = [];

        public if: number;

        public methodNoArgs(): string {
            return "Test";
        }

        public method1Args(arg0: any): string {
            return "Test";
        }
        public method2Args(arg0: any, arg1: any): string {
            return "Test";
        }
        public method3Args(arg0: any, arg1: any, arg2: any): string {
            return "Test";
        }

        public funcMethod(arg0: any): any {
            return (x) => {};
        }

        public inner = new MockInnerModel();
    }

    export class BinderTests {



        public testParse(c: tsUnit.TestContext): void {
            var inps = [
                ["(1+2)*3;", "10 expression expressions"],
                

                ['a + b;', 'addition'],
                ["'a';", 'single string literal'],
                ["'a\\n';", 'single string literal with escaped return'],
                ['"a";', 'double string literal'],
                ['"a\\n";', 'double string literal with escaped return'],
                ['"var";', 'string is a keyword'],
                ['"variable";', 'string starts with a keyword'],
                ['"somevariable";', 'string contains a keyword'],
                ['"somevar";', 'string ends with a keyword'],
                ['500;', 'int literal'],
                ['500.;', 'float literal w/o decimals'],
                ['500.432;', 'float literal with decimals'],
                ['.432432;', 'float literal w/o int'],
                ['$d.method3Args(1,2,3);', 'parens and comma'],
                ['[1,2,abc];', 'array literal'],

                
                //// http://code.google.com/p/es-lab/source/browse/trunk/tests/parser/parsertests.js?r=86
                //// http://code.google.com/p/es-lab/source/browse/trunk/tests/parser/parsertests.js?r=430

                ["$d.value == null ? 'Y' : 'N'"],

                // identifiers
                ["x;", '1 identifier'],
                ["_x;", '2 identifier'],
                ["xyz;", '3 identifier'],
                ["$x;", '4 identifier'],
                ["x$;", '5 identifier'],
                ["_;", '6 identifier'],
                ["x5;", '7 identifier'],
                ["x_y;", '8 identifier'],
                ["x+5;", '9 identifier'],
                ["xyz123;", '10 identifier'],
                ["x1y1z1;", '11 identifier'],
//                ["foo\\u00D8bar;", '12 identifier unicode escape'],
                //["foo�bar;",'13 identifier unicode embedded (might fail)'],

                // numbers
                ["5;", '1 number'],
                ["5.5;", '2 number'],
                ["0;", '3 number'],
                ["0.0;", '4 number'],
                ["0.001;", '5 number'],
                ["1.e2;", '6 number'],
                ["1.e-2;", '7 number'],
                ["1.E2;", '8 number'],
                ["1.E-2;", '9 number'],
                [".5;", '10 number'],
                [".5e3;", '11 number'],
                [".5e-3;", '12 number'],
                ["0.5e3;", '13 number'],
                ["55;", '14 number'],
                ["123;", '15 number'],
                ["55.55;", '16 number'],
                ["55.55e10;", '17 number'],
                ["123.456;", '18 number'],
                ["1+e;", '20 number'],
                ["0x01;", '22 number'],
                ["0XCAFE;", '23 number'],
                ["0x12345678;", '24 number'],
                ["0x1234ABCD;", '25 number'],
                ["0x0001;", '26 number'],

                // strings
                ["\"foo\";", '1 string'],
                ["\'foo\';", '2 string'],
                ["\"x\";", '3 string'],
                ["\'\';", '4 string'],
                ["\"foo\\tbar\";", '5 string'],
                ["\"!@#$%^&*()_+{}[]\";", '6 string'],
                ["\"/*test*/\";", '7 string'],
                ["\"//test\";", '8 string'],
                ["\"\\\\\";", '9 string'],
                ["\"\\u0001\";", '10 string'],
                ["\"\\uFEFF\";", '11 string'],
                ["\"\\u10002\";", '12 string'],
                ["\"\\x55\";", '13 string'],
                ["\"\\x55a\";", '14 string'],
                ["\"a\\\\nb\";", '15 string'],
                ['";"', '16 string: semi in a string'],
                ['"a\\\nb";', '17 string: line terminator escape'],
                
                // literals
                ["null;", "null"],
                ["true;", "true"],
                ["false;", "false"],
                
                // arrays
                ["[];", "1 array"],
                ["[   ];", "2 array"],
                ["[1];", "3 array"],
                ["[1,2];", "4 array"],
                //["[1,2,,];", "5 array"],
                ["[1,2,3];", "6 array"],
                //["[1,2,3,,,];", "7 array"],

                // member expression
                ["$d.value;", "1 member expression"],
                ["$d.inner['value'];", "2 member expression"],
                ["$d.inner['value']['length'];", "3 member expression"],
                ["$d.values.length;", "4 member expression"],
                ["$d.if;", "5 member expression"],

                // call and invoke expressions
                ["$d.methodNoArgs();", "1 call/invoke expression"],
                ["$d.method1Args(1);", "2 call/invoke expression"],
                ["$d.method2Args(1,2);", "3 call/invoke expression"],
                ["$d['methodNoArgs'];", "5 call/invoke expression"],
                ["$d['method1Args'](1);", "7 call/invoke expression"],
                ["$d['method2Args'](1,2);", "9 call/invoke expression"],
                ["$d.funcMethod(1)(2);", "10 call/invoke expression"],

                // unary operators
                ["+ x;", "3 unary operator"],
                ["-x;", "4 unary operator"],
                ["~x;", "5 unary operator"],
                ["!x;", "6 unary operator"],

                // expression expressions
                ["1 * 2;", "1 expression expressions"],
                ["1 / 2;", "2 expression expressions"],
                ["1 % 2;", "3 expression expressions"],
                ["1 + 2;", "4 expression expressions"],
                ["1 - 2;", "5 expression expressions"],
                ["1 << 2;", "6 expression expressions"],
                ["1 >>> 2;", "7 expression expressions"],
                ["1 >> 2;", "8 expression expressions"],
                ["1 * 2 + 3;", "9 expression expressions"],
                ["(1+2)*3;", "10 expression expressions"],
                ["1*(2+3);", "11 expression expressions"],
                ["x<y;", "12 expression expressions"],
                ["x>y;", "13 expression expressions"],
                ["x<=y;", "14 expression expressions"],
                ["x>=y;", "15 expression expressions"],
                //["$d.methodNoArgs() instanceof string;", "16 expression expressions"],
                ["2 in [1,2,3];", "17 expression expressions"],
                ["x&y;", "18 expression expressions"],
                ["x^y;", "19 expression expressions"],
                ["x|y;", "20 expression expressions"],
                ["x+y<z;", "21 expression expressions"],
                ["x<y+z;", "22 expression expressions"],
                ["x+y+z;", "23 expression expressions"],
                ["x+y<z;", "24 expression expressions"],
                ["x<y+z;", "25 expression expressions"],
                ["x&y|z;", "26 expression expressions"],
                ["x&&y;", "27 expression expressions"],
                ["x||y;", "28 expression expressions"],
                ["x&&y||z;", "29 expression expressions"],
                ["x||y&&z;", "30 expression expressions"],
                ["x<y?z:w;", "31 expression expressions"],
                
                // expression statement
                ["x;", "1 expression statement"],
                ["5;", "2 expression statement"],
                ["1+2;", "3 expression statement"]
                
            ];

            for (var i = 0; i < inps.length; ++i) {
                try {

                    var element = document.createElement("div");
                    element.setAttribute("data-jsBind", "prop:val=" + inps[i][0]);

                    var binder = new Binder(element, new MockModel());
                } catch(e) {
                    console.log(e + " " + inps[i][0]);

                    c.fail();
                }
            };

        }
    }
}