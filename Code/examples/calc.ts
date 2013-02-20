/// <reference path="jsBind.d.ts" />

class Calc extends jsBind.Observable {

	private _display: string = "0";
	private _startNumber: bool = true;	
	private _lastOp: string = "=";
	private _total: number = 0;
	private _prevOp: string = "=";

    // Handles a click event on one of the digit buttons
	public handleDigitPress(button:string) {
		if (this._startNumber) {
			this._display = button;
			this._startNumber = false;
		} else {
			this._display += button
		}

		super.notifyChanged("display");
	}

    // Handles the clicking of the '.' button
	public handleDecimal(): void {
		if (this._startNumber) {
			this._display = "0.";
			this._startNumber = false;
		} else if (this._display.indexOf('.') == -1) {
			this._display += ".";
		}
		super.notifyChanged("display");
	}

    // Handles the clicking of the clear button
	public handleClearPress(): void {
		this._display = "0";
		this._total = 0;
		this._startNumber = true;

		super.notifyChanged("display");
	}
	
    // Handles the clicking of one of the +, -, /, * buttons
	public handleMathOp(op: string):void {
		if (this._startNumber) {
			return;
		}

		switch (this._prevOp) {
			case "=": {
				this._total = parseFloat(this._display);
				break;
			}

			case "+": {
				this._total += parseFloat(this._display);
				break;
			}

			case "-": {
				this._total -= parseFloat(this._display);
				break;
			}

			case "*": {
				this._total *= parseFloat(this._display);
				break;
			}

			case "/": {
				this._total /= parseFloat(this._display);
				break;
			}
		}

		this._prevOp = op;

		this._startNumber = true;

		this._display = this._total.toString();
		super.notifyChanged("display");
	}

    // Gets the current display value
	public display(): string {
		return this._display;
	}
}