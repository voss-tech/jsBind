/// <reference path="jsBind.d.ts"/>

class Item {
    public value: string;
    public amount: number;
}

class TableDemo {
    public items: jsBind.ObservableCollection = new jsBind.ObservableCollection();

    public newCommand(): void {
        var newItem: Item = new Item();
        newItem.value = "Item " + (this.items.count() + 1);
        newItem.amount = this.items.count() - 2;

        this.items.push(newItem);
    }

    public deleteCommand(item: Item): void {
        this.items.remove (item);
    }

}