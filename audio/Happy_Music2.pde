/**
 * HelloHalloween is using toxiclibs audioutils to create a dynamic mix of randomly
 * chosen monster samples. Also shows usage of MultiTimbralManager utility class to
 * handle audio resourcing, scheduling and some house keeping tasks...
 *
 * You will need the following libraries from:
 * http://code.google.com/p/toxiclibs/downloads/list
 *
 * toxiclibscore-0014 or newer
 * audioutils-0004 or newer
 *
 * All audio samples by Pitx (http://www.freesound.org/usersViewSingle.php?id=40665),
 * licensed under Creative Commons Sampling Plus 1.0
 * http://creativecommons.org/licenses/sampling+/1.0/
 */

/* 
 * Copyright (c) 2008-2009 Karsten Schmidt
 * 
 * This demo & library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * 
 * http://creativecommons.org/licenses/LGPL/2.1/
 * 
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

import toxi.audio.*;
import toxi.geom.*;
import processing.serial.*;  

JOALUtil audioSys;
MultiTimbralManager soundManager;
AudioBuffer[] buf=new AudioBuffer[6];

void setup() {
  size(100,100);
  audioSys = JOALUtil.getInstance();
  audioSys.init();
  // create a sound manager instance for 8 audio sources/channels
  soundManager=new MultiTimbralManager(audioSys,8);
  // load the samples
  for(int i=0; i<buf.length; i++) {
    buf[i]=audioSys.loadBuffer(dataPath("Synth"+i+".wav"));
  }
}

void draw() {
  
 
}

void serialEvent(Serial thisPort) {
  // variable to hold the number of the port:
  int portNumber = -1;
  
  // iterate over the list of ports opened, and match the 
  // one that generated this event:
  for (int p = 0; p < myPorts.length; p++) {
    if (thisPort == myPorts[p]) {
      portNumber = p;
    }
  }
  // read a byte from the port:
  int inByte = thisPort.read();
  // put it in the list that holds the latest data from each port:
  dataIn[portNumber] = inByte;
  // tell us who sent what:
  println("Got " + inByte + " from serial port " + portNumber);
  
  If data[6] = 1 {
   for (int i = 0; i < 36000; i++{
  
  // every frame there's 0.4% chance for a new sample being triggered
  // the sample will be assigned to a free audio source managed by the
  // multi-timbral sound manager
  if (random(100)<0.4) {
    soundManager.getNextVoice().setBuffer(buf[(int)random(buf.length)]).play();
  }

  super.stop();
  audioSys.shutdown();
  
   }
}

