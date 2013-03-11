/// <reference path="jsBind.d.ts" />

class Clock extends jsBind.Observable {
    private _time: Date = new Date();

    constructor() {
        super();

        // Run a tick immediately to initialise everything
        this.handleTick();

        // Schedule a callback every second
        window.setInterval( () => { this.handleTick() }, 1000);
    }

    private handleTick() : void {
        // Save the previous time and get the new current time
        var lastTime = this._time;
        this._time = new Date();

        // Notify if the minute component has changed
        if (lastTime.getMinutes() != this._time.getMinutes()) {
            super.notifyChanged("hour");
            super.notifyChanged("minute");
        }

        // Notify if the second component has changed
        if (lastTime.getSeconds() != this._time.getSeconds()) {
            super.notifyChanged("second");
        }
    }

    public second() {
        return this._time.getSeconds() * 6;
    }

    public minute() {
        return this._time.getMinutes() * 6;
    }

    public hour() {
        return (this._time.getHours() % 12) * 30 + (this._time.getMinutes() / 4);
    } 

}