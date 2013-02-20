/// <reference path="Expression.ts" />
/// <reference path="DereferenceExpression.ts"/>

module jsBind {
    export class BindingExpression {
        public subKind: string[];
        public valueExpr: Expression;

        constructor (subKind: string[], valueExpr: Expression) {
            this.subKind = subKind;
            this.valueExpr = valueExpr;
        }

        public evaluate(change: any, dataContext: any, parentContext: any, event: Event): any {
            return this.valueExpr.eval(change, dataContext, parentContext, event);
        }        
    }
}