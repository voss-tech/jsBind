module jsBind {
    export class Expression {
        public parent: Expression;
        public changeFunc: any;

        public eval(changeFunc: any, d: any, p: any, e: any): any {
            return null
        }

    }
}