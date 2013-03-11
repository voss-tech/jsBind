
module jsBind {
    export interface IBinding {
        evaluate(): void;
        dispose(): void;
    }
}