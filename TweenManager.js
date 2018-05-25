function TweenManager() {

	var T = {};
	var c = 0;

	function check(e, _t) {// element, tween

		if (!e.id) {
			e.id = "tween_"+c;// create a unique id for the element
			c++;
		}

		var o;

		if (!T[e.id]) {//checks if tweens exist on the element

			o = {};// create new object

		} else {

			o = T[e.id];// get stored object
			var t = o.t;// get stored tween
			var s = t.getState();// checking if tween is running
			if (s == 1) {
				t.stop();// if tween is running it is stopped
			}
		}
		o.t = _t;// store tween
		T[e.id] = o;// store object
	}
	function init() {

		if (!TweenManager.check) {
			TweenManager.check = check;
		}
	}
	init();
}