int sensorValue;

void setup()
{
  Serial.begin(9600);  // sets the serial port to 9600
}

void loop()
{
  sensorValue = analogRead(0);       // read analog input pin 0
  Serial.println(sensorValue, DEC);  // prints the value read
  delay(1000);                        // wait 100ms for next reading
}
