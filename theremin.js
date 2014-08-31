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
			var oscillator = this.oscillator = context.createOscillator()
			var gain = this.gain = context.createGain()
			this.setGain(0)
			
			
			oscillator.connect(gain)
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
						self.rightHand(
							interactionBox.normalizePoint(hand.palmPosition)[1]
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

		rightHand: function(y) {
			scale(volumeOut, 1, y)
			this.setGain(y)
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
		}
	}
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