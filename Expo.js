function Expo() {}
Expo.easeIn = function(t, b, c, d) {
	if (t==0) {
		return b;
	} else {
		return c*Math.pow(2, 10*(t/d-1))+b-c*0.001;
	}
}
Expo.easeOut = function(t, b, c, d) {
	if (t==d) {
		return b+c;
	} else {
		return c*(-Math.pow(2, -10*t/d)+1)+b;
	}
}
Expo.easeInOut = function(t, b, c, d) {
	if (t==0) {
		return b;
	}
	if (t==d) {
		return b+c;
	}
	if ((t/=d*0.5) < 1) {
		return c*0.5*Math.pow(2, 10*(t-1))+b;
	} else {
		return c*0.5*(-Math.pow(2, -10 * --t)+2)+b;
	}
}