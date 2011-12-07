/* FSR simple testing sketch. 
 
Connect one end of FSR to power, the other end to Analog 0.
Then connect one end of a 10K resistor from Analog 0 to ground 
 
For more information see www.ladyada.net/learn/sensors/fsr.html */
 
int fsrPin = 0;  // the FSR and 10K pulldown are connected to a0
int fsrReading; // the analog reading from the FSR resistor divider
int squeezeOn;

int micPin = 1;
int micReading;
int micOn;

int accePin = 2;
int acceReadingX;
int acceReadingY;
int acceReadingZ;
int xPin = 2;
int yPin = 3;
int zPin = 4;

int photoResPin = 5;
int photoResReading;
int threshold = 200;
int lightOn;


//The minimum and maximum values that came from
//the accelerometer while standing still
//You very well may need to change these
int minVal = 265;
int maxVal = 402;

 
void setup(void) {
  // We'll send debugging information via the Serial monitor
  Serial.begin(115200);   
}
 
void loop(void) {
  
  //FSR
  if(analogRead(fsrPin) > 500) {
     squeezeOn = 1; 
  }
  else {
   squeezeOn = 0; 
  }

  
  //MIC
  if(analogRead(micPin) > 600) {
    micOn = 1;
  }
  else {
    micOn = 0;
  }
  
  Serial.println(analogRead(micPin));

  
  //ACCELEROMETER  
  
  //read the analog values from the accelerometer
  int xRead = analogRead(xPin);
  int yRead = analogRead(yPin);
  int zRead = analogRead(zPin);
  
  //convert read values to degrees -90 to 90 - Needed for atan2
  int xAng = map(xRead, minVal, maxVal, -90, 90);
  int yAng = map(yRead, minVal, maxVal, -90, 90);
  int zAng = map(zRead, minVal, maxVal, -90, 90);
  
  //Caculate 360deg values like so: atan2(-yAng, -zAng)
  //atan2 outputs the value of -π to π (radians)
  //We are then converting the radians to degrees
  acceReadingX = RAD_TO_DEG * (atan2(-yAng, -zAng) + PI);
  acceReadingY = RAD_TO_DEG * (atan2(-xAng, -zAng) + PI);
  acceReadingZ = RAD_TO_DEG * (atan2(-yAng, -xAng) + PI);
  
  //PHOTORESISTOR - Light Off is 0 / Light On is 1
  
    if(analogRead(photoResPin) > threshold ){    
        //Light Off
        lightOn = 0;
    }else{
        //Light On
        lightOn = 1;
    }
  
  //OUTPUT
  //Serial.println(analogRead(photoResPin)); 
  if(photoResReading!=lightOn) {
     photoResReading = lightOn;
     String photoResReadingOutput = "[" + String(photoResPin) + ", " + String(photoResReading) + "]";
    Serial.println(photoResReadingOutput); 
  }
  
  if(micReading != micOn) {
     micReading = micOn;
     String micReadingOutput = "[" + String(micPin) + ", " + String(micReading) + "]";
     Serial.println(micReadingOutput);  // the raw analog reading
  }
  
  if(fsrReading != squeezeOn) {
    fsrReading = squeezeOn;
      String fsrReadingOutput = "[" + String(fsrPin) + ", " + String(fsrReading) + "]";
      Serial.println(fsrReadingOutput);
  }
  

  String accelerometerReadingOutput = "[" + String(accePin) + ", "+
    String(acceReadingX) + ", "+String(acceReadingY) + ", "+String(acceReadingZ) + "]";
  Serial.println(accelerometerReadingOutput);
 
  delay(100);
} 
