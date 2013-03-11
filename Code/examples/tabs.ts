/// <reference path="jsBind.d.ts" />

class Tabs {
	public selectedTab: jsBind.ObservableString = new jsBind.ObservableString("Tab 1");
	public tabs: string[] = ["Tab 1", "Tab 2", "Tab 3"];
 
	constructor() {
	}

	public selectTab(tabId: string) {
		this.selectedTab.set(tabId);
	}
}