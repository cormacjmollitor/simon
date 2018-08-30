var KEYS = ['c', 'd', 'e', 'f'];
var NOTE_DURATION = 1000;

// NoteBox
//
// Acts as an interface to the coloured note boxes on the page, exposing methods
// for playing audio, handling clicks,and enabling/disabling the note box.
function NoteBox(key, onClick) {
	// Create references to box element and audio element.
	var boxEl = document.getElementById(key);
	var audioEl = document.getElementById(key + '-audio');
	if (!boxEl) throw new Error('No NoteBox element with id' + key);
	if (!audioEl) throw new Error('No audio element with id' + key + '-audio');

	// When enabled, will call this.play() and this.onClick() when clicked.
	// Otherwise, clicking has no effect.
	var enabled = true;
	// Counter of how many play calls have been made without completing.
	// Ensures that consequent plays won't prematurely remove the active class.
	var playing = 0;

	this.key = key;
	this.onClick = onClick || function () {};

	// Plays the audio associated with this NoteBox
	this.play = function () {
		playing++;
		// Always play from the beginning of the file.
		audioEl.currentTime = 0;
		audioEl.play();

		// Set active class for NOTE_DURATION time
		boxEl.classList.add('active');
		setTimeout(function () {
			playing--
			if (!playing) {
				boxEl.classList.remove('active');
			}
		}, NOTE_DURATION)
	}

	// Enable this NoteBox
	this.enable = function () {
		enabled = true;
	}

	// Disable this NoteBox
	this.disable = function () {
		enabled = false;
	}

	// Call this NoteBox's clickHandler and play the note.
	this.clickHandler = function () {
		if (!enabled) return;

		this.onClick(this.key)
		this.play()
	}.bind(this)

	boxEl.addEventListener('mousedown', this.clickHandler);
}

// Example usage of NoteBox.
//
// This will create a map from key strings (i.e. 'c') to NoteBox objects so that
// clicking the corresponding boxes on the page will play the NoteBox's audio.
// It will also demonstrate programmatically playing notes by calling play directly.
/*
var notes = {};

KEYS.forEach(function (key) {
	notes[key] = new NoteBox(key);
});
/*
KEYS.concat(KEYS.slice().reverse()).forEach(function(key, i) {
	setTimeout(notes[key].play.bind(null, key), i * NOTE_DURATION);
});*/

function echo(){
  const timeOut = 2500;
  var boxes = []; //Contains references to the box DOM elements
  var notes = {};
  var noteBuffer = []; //What is played after 2.5 seconds of now mouse clicks over boxes
  var currentTimeout = setTimeout(null, 0);

  //Create the NoteBox objects for each box and get references for each box DOM element
  KEYS.forEach(function(key) {
    notes[key] = new NoteBox(key);
    boxes.push(document.getElementById(key));
  });

  //Play the notes in the note buffer and then clear it
  var playBuffer = function(){
    noteBuffer.forEach(function(note, i){
      setTimeout(note.play.bind(null, note), i * NOTE_DURATION);
    });
    noteBuffer.splice(0, noteBuffer.length);
  };

  //Append a key to the note buffer and reset the timer
  var appendKey = function(key){
    clearTimeout(currentTimeout);
    noteBuffer.push(notes[key]);
    currentTimeout = setTimeout(playBuffer, timeOut);
  };

  //When a box is pressed, append a key to the note buffer
  boxes.forEach(function(box){
    box.addEventListener('mousedown', function(){appendKey(box.id)});
  });
}

//echo();

function simon(){
  var boxes = [];
  var notes = {};
  var score = 0;
  var simonNotes = [];
  var playerNotes = [];
  var success = true;
  var scoreElement = document.getElementById('score')
  scoreElement.value = score;

  //Create the NoteBox objects for each box and get references for each box DOM element
  KEYS.forEach(function(key) {
    notes[key] = new NoteBox(key);
    boxes.push(document.getElementById(key));
  });

  //Adds a new note to simon's notes
  this.addSimonNote = function(){
    var key = KEYS[Math.floor(Math.random() * 4)];
    simonNotes.push(notes[key]);
  };

  this.playSimonNotes = function(){
    simonNotes.forEach(function(note, i){
      setTimeout(note.play.bind(null, note), i * NOTE_DURATION);
    });
  };
  
  this.addPlayerNote = function(key){
    success = false;
    var noteIndex = playerNotes.length;
    playerNotes.push(notes[key]);

    //clear both note lists, reset score, and restart
    if(simonNotes[noteIndex] != playerNotes[noteIndex]){
      score = 0;
      simonNotes.splice(0, simonNotes.length);
      playerNotes.splice(0, playerNotes.length);
      setTimeout(addSimonNote, 1);
      setTimeout(playSimonNotes, 2000);
    }

    //clear player list, increment score, 
    else if(simonNotes.length == noteIndex+1){
      score++;
      playerNotes.splice(0, playerNotes.length);
      setTimeout(addSimonNote, 1);
      setTimeout(playSimonNotes, 2000);
    }
  };

  setTimeout(addSimonNote, 1);
  setTimeout(playSimonNotes, 2000);

  boxes.forEach(function(box){
    box.addEventListener('mousedown', function(){addPlayerNote(box.id)});
  });
}

simon();
