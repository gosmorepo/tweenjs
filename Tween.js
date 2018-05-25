function Tween(_e, _d, _p) {// _e -> element, _d -> duration, _p -> parameters

	var instance = this;
	var sT;// start time
	var eT;// elapsed time
	var d;// delay
	var t;
	var e;// ease
	var P = {};
	var ocF;// onComplete function
	var ocFA;// onComplete function arguments
	var s = 0;// tween state

	function trimPx(i) {
		var reg0 = 0;
		while (i.charAt(reg0) == "-" || !isNaN(i.charAt(reg0))) {
			reg0++;
		}
		return i.slice(0, reg0);
	}
	function getCurrValue(i, vt, p) {
		var b;
		if (vt == 1) {
			b = _e[i];
		} else {
			b = window.getComputedStyle(_e, null).getPropertyValue(convertProp(i));
			if (isNaN(b)) {
				b = trimPx(b);// trim "px"
				p.px = 1;
			} 
		}
		return b;
	}
	function buildProp(i, vt) {
		var p = {};
		p.px = 0;
		var b = getCurrValue(i, vt, p);
		p.b = Number(b);// current property value
		p.f = Number(_p[i]);// final property value
		p.c = p.f-p.b;// difference
		p.color = 0;
		p.vt = vt;
		P[i] = p;
	}
	function buildColorProp(i, vt) {
		// create p
		var p = {};
		
		// initial rgb values
		var initial = window.getComputedStyle(_e, null).getPropertyValue(convertProp(i));//rgb(255, 255, 255)
		var a1 = initial.split("(");
		var a2 = a1[1].split(")");
		var a3 = a2[0].split(", ");

		p.br = parseInt(a3[0]);
		p.bg = parseInt(a3[1]);
		p.bb =  parseInt(a3[2]);

		// final rgb values
		var final = _p[i].toString();
		var a = final.split("");
		
		p.fr = parseInt(a[0]+a[1], 16);
		p.fg = parseInt(a[2]+a[3], 16);
		p.fb = parseInt(a[4]+a[5], 16);

		// final-initial rgb values
		p.cr = p.fr-p.br;
		p.cg = p.fg-p.bg;
		p.cb = p.fb-p.bb;

		// other properties
		p.px = 0;
		p.color = 1;
		p.vt = vt;

		// store p in P
		P[i] = p;
	}
	function convertProp(i) {
		switch (i) {
			case "marginLeft":
				i = "margin-left";
				break;
			case "marginRight":
				i = "margin-right";
				break;
			case "marginTop":
				i = "margin-top";
				break;
			case "marginBottom":
				i = "margin-bottom";
				break;
			case "paddingLeft":
				i = "padding-left";
				break;
			case "paddingRight":
				i = "padding-right";
				break;
			case "paddingTop":
				i = "padding-top";
				break;
			case "paddingBottom":
				i = "padding-bottom";
				break;
			case "color":
				i = "color";
				break;
			case "backgroundColor":
				i = "background-color";
				break;
		}
		return i;
	}
	function parse() {
		for (var i in _p) {
			switch (i) {
				case "width":
				case "height":
				case "marginLeft":
				case "marginRight":
				case "marginTop":
				case "marginBottom":
				case "paddingLeft":
				case "paddingRight":
				case "paddingTop":
				case "paddingBottom":
				case "opacity":
					buildProp(i, 0);// 0 -> css property
					break;
				case "color":
				case "backgroundColor":
					buildColorProp(i, 0);
					break;
				case "scrollTop":
				case "scrollLeft":
					buildProp(i, 1);
					break;
				case "ease":
					e = _p[i];
					break;
				case "delay":
					d = _p[i]*1000;
					break;
				case "onComplete":
					ocF = _p[i];
					break;
				case "onCompleteArgs":
					ocFA = _p[i];
					break;
			}
		}
		if (d) {
			startDelay();
		} else {
			start();
		}
	}
	function startDelay() {
		sT = Date.now();
		t = setInterval(delayCheck, 10); 
	}
	function delayCheck() {
		eT = Date.now()-sT;
		if (eT > d) {
			clearInterval(t);
			start();
		}
	}
	function tweenProps() {
		for (var i in P) {
			var p = P[i];
			if (p.vt == 1) {
				_e[i] = e(eT, p.b, p.c, _d)+C.PX();
			} else if (p.px == 1) {
				_e.style[i] = e(eT, p.b, p.c, _d)+C.PX();
			} else if (p.color == 1) {

				var er = parseInt(e(eT, p.br, p.cr, _d));
				var eg = parseInt(e(eT, p.bg, p.cg, _d));
				var eb = parseInt(e(eT, p.bb, p.cb, _d));

				_e.style[i] = "rgb("+er+", "+eg+", "+eb+")";

			} else {
				_e.style[i] = e(eT, p.b, p.c, _d);
			}
		}
	}
	function forceProps() {
		for (var i in P) {
			var p = P[i];
			if (p.vt == 1) {
				_e[i] = p.f+C.PX();
			} else if (p.px == 1) {
				_e.style[i] = p.f+C.PX();
			} else if (p.color == 1) {
				_e.style[i] = "#"+p.f;
			} else {
				_e.style[i] = p.f;
			}
		}
	}
	function onTick() {
		eT = Date.now()-sT;
		if (eT < _d) {
			tweenProps();
		} else {
			complete();
		}
	}
	function complete() {
		clearInterval(t);
		if (ocF && ocFA) {
			ocF.apply(this, ocFA);
		} else if (ocF) {
			ocF();
		}
		forceProps();
		s = 0;
	}
	function start() {
		sT = Date.now();// store current timestamp
		t = setInterval(onTick, 10);
	}
	this.stop = function () {
		clearInterval(t);
	}
	this.getState = function() {
		return s;
	}
	function init() {
		TweenManager.check(_e, instance);
		s = 1;// set tween state to active
		_d *= 1000;// convert duration into milliseconds
		parse();
	}
	init();
}