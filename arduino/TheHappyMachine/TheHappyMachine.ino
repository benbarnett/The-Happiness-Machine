/* FSR simple testing sketch. 
 
Connect one end of FSR to power, the other end to Analog 0.
Then connect one end of a 10K resistor from Analog 0 to ground 
 
For more information see www.ladyada.net/learn/sensors/fsr.html */
 
int fsrPin = 0;  // the FSR and 10K pulldown are connected to a0
int fsrReading; // the analog reading from the FSR resistor divider
int micPin = 1;
int micReading;


 
void setup(void) {
  // We'll send debugging information via the Serial monitor
  Serial.begin(115200);   
}
 
void loop(void) {
  fsrReading = analogRead(fsrPin);
  micReading = analogRead(micPin);
  
  String micReadingOutput = "[" + String(micPin) + ", " + String(micReading) + "]";
  String fsrReadingOutput = "[" + String(fsrPin) + ", " + String(fsrReading) + "]";

  Serial.println(fsrReadingOutput);
  Serial.println(micReadingOutput);  // the raw analog reading
 
  delay(1000);
} 
