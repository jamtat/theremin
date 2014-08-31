var theremin = function() {
	"use strict";
	console.log('running')
	var L = q('#L');   var R = q('#R')
	var volumeOut = q('#volume'),
		pitchOut = q('#pitch'),
		w = window.innerWidth,
		h = window.innerHeight
	
	return {
		init: function() {
			console.log('hello yes this is dog')
			
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			var context = this.context = new AudioContext()
			
			//Oscillator
			var oscillator = this.oscillator = context.createOscillator()
			
			//Gain node
			var gain = this.gain = context.createGain()
			this.setGain(0)
			
			//Compressor
			var compressor = this.compressor = context.createDynamicsCompressor();
			
			
			oscillator.connect(compressor)
			compressor.connect(gain)
			gain.connect(context.destination)
			
			oscillator.type = 'sawtooth';
			oscillator.frequency.value = 900; // value in hertz
			oscillator.start(0);
			
			Leap.loop(this.frame.bind(this)).use('screenPosition', {scale: 0.25})
		},

		frame: function(frame) {
			var right = false,
				left = false,
				self = this,
				interactionBox = frame.interactionBox;
				
			frame.hands.forEach(function(hand) {
				switch (hand.type) {
					case "right":
						right = true
						var roll = r2d(hand.roll())
						
						self.rightHand(
							//Volume
							interactionBox.normalizePoint(hand.palmPosition)[1],
							
							//Wave type
							/*5-hand.pointables.reduce(function(a,b) {
								return a+b.extended
							},0)*/
							Math.abs(roll)/30
						)
						break;
					case "left":
						left = true
						self.leftHand(
							interactionBox.normalizePoint(hand.palmPosition)[0]
						)
						break;
				}
			})
			
			if(!right)
				self.rightHand(0)
			
			if(!left)
				self.leftHand(0)
				
		},

		rightHand: function(y, w) {
			scale(volumeOut, 1, y)
			this.setGain(y)
			this.setWaveType(w)
		},

		leftHand: function(x) {
			x = x*2
			scale(pitchOut, x, 1)
			this.setPitch(x)
		},
		
		setGain: function(gain) {
			this.gain.gain.value = gain
		},
		
		setPitch: function(pitch) {
			var freq = lerp(20,900,pitch)
			this.oscillator.frequency.value = freq
		},
		
		waves: [
			'sine',
			'square',
			'sawtooth',
			'triangle'
		],
		
		setWaveType: function(w) {
			w = Math.max(0,Math.min(w,3))|0
			this.oscillator.type = this.waves[w]
		}
	}
}

function r2d(rad) {
	return rad*180/Math.PI
}

function lerp(a,b,t) {
	return (b-a)*t + a
}

function q(selector) {
	return document.body.querySelectorAll(selector)[0]
}

function scale(el, x, y) {
	x=x?x:0; y=y?y:0;
	//console.log(el,x,y)
	el.style.webkitTransform = 'scale('+x+','+y+')'
}