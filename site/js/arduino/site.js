$(document).ready(function() {

	// dependencies
	// declare these variables so you don't have
	// to type the full namespace
	var Arduino = ARDJS.Arduino;
	var Pin = ARDJS.Pin;
	var ArduinoEvent = ARDJS.ArduinoEvent;
	var Event = ARDJS.Event;
	var BlinkM = ARDJS.ui.BlinkM;
	var CompassHMC6352 = ARDJS.ui.CompassHMC6352;
	var Button = ARDJS.ui.Button;
	var ButtonEvent = ARDJS.ui.ButtonEvent;

		
	var ard = new Arduino("localhost", 8080);
	
	var frames = 0;
	var intensity = 0;
	var direction = 1;
	var servoDir = true;
	var blinkM;
	var compass;
	var servo;
	var blinkLED;
	var fadeLED;

	console.log("name = " + ard.name);
	
	ard.addEventListener(ArduinoEvent.READY, onReady);

	function onReady(event) {
					
		ard.removeEventListener(ArduinoEvent.READY, onReady);
					
		// listen for incoming string messages
		ard.addEventListener(ArduinoEvent.STRING_MESSAGE, onStringMessage);
	}
	
	
	function onHeadingUpdate(evt) {
		//console.log("heading = " + evt.target.heading);
		$('#heading').html("heading: " + evt.target.heading);
	}	
	
	function randomColor() {
		var red = Math.floor(Math.random() * 255);
		var green = Math.floor(Math.random() * 255);
		var blue = Math.floor(Math.random() * 255);
		
		blinkM.goToRGBColorNow([red, green, blue]);
		//blinkM.fadeToRGBColor([red, green, blue]);
	}	
	
	function onPotChange(event) {
		var pin = event.target;
		var analogData = "pot value: " + pin.value.toFixed(3) + 
			"\tmin = " + pin.minimum.toFixed(3) + "\tmax = " + 
			pin.maximum.toFixed(3) + "\tavg = " + pin.average.toFixed(3)
		
		//console.log(analogData);
		$('#potData').html(analogData);	
	}

	function onButtonPress(event) {
		var btn = event.target;
		$('#button').html("button: pin = " + btn.pinNumber + " pressed");
	}

	function onButtonRelease(event) {
		var btn = event.target;
		$('#button').html("button: pin = " + btn.pinNumber + " released");
	}
	
	function onButtonChange(event) {
		var pin = event.target;
		//console.log("button changed: pin = " + pin.number + "\tvalue = " + pin.value;
		$('#button').html("button: pin = " + pin.number + "\tvalue = " + pin.value);	
	}	
	
	function onFirmwareVersion(event) {
		console.log("firmware version: " + event.version);
	}
	
	function onFirmwareName(event) {
		console.log("firmware name: " + event.name + " version: " + event.version);
	}
	
	function onCapabilityResponse(event) {
		// print capabilities to the console
		ard.reportCapabilities();
	}
	
	function onStringMessage(event) {
		console.log("string received: " + event.message);
	}
	
	function onPinStateResponse(event) {
		var modeNames = {0:"input", 1:"output", 2:"analog", 3:"pwm", 4:"servo", 5:"shift", 6:"i2c"};
		var pinType = modeNames[event.type];
		console.log("pin state response = " + event.pin + "\t" + pinType);
	}	
	
	function fade() {
		fadeLED.value = (intensity += direction);
		// test sendExtendedAnalog method
		//ard.sendExtendedAnalog(11, intensity += direction);
		if (intensity == 255) direction = -1;
		else if (intensity == 0) direction = 1;
	}
	
	function servoTest() {
		if (servoDir) {
			servo.value = 0;
		} else {
			servo.value = 180;
		}
		servoDir = !servoDir;
	}
	
	function blink() {
		frames++;
		if (frames % 2 == 0) {
			blinkLED.value = Pin.LOW;
		} else {
			blinkLED.value = Pin.HIGH;
		}
	}
			
});