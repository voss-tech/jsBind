module jsBind {
    export interface IExpression {

        eval(changeFunc: any, d: any, p: any, e: any): any;

	dispose(): void;

    }
}