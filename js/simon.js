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

function echo(){
  const timeOut = 2500;
  var segments = []; // Contains references to the box DOM elements
  var notes = {};
  var noteBuffer = []; // What is played after 2.5 seconds of no mouse clicks over segments
  var currentTimeout = setTimeout(null, 0); // Timeout variable that will be reset everytime 

  // Create the NoteBox objects for each box and get references for each box DOM element
  KEYS.forEach(function(key) {
    notes[key] = new NoteBox(key);
    segments.push(document.getElementById(key));
  });

  // Play the notes in the note buffer and then clear it
  function playBuffer(){
    noteBuffer.forEach(function(note, i){
      setTimeout(note.play.bind(null, note), i * NOTE_DURATION);
    });
    noteBuffer.splice(0, noteBuffer.length);
  };

  // Append a key to the note buffer and reset the timer
  function appendKey(key){
    clearTimeout(currentTimeout);
    noteBuffer.push(notes[key]);
    currentTimeout = setTimeout(function(){playBuffer()}, timeOut);
  };

  // When a box is pressed, append a key to the note buffer
  segments.forEach(function(box){
    box.addEventListener('mousedown', function(){appendKey(box.id)});
  });
}

function simon(){
  var segments = [];
  var notes = {};
  var simonNotes = [];
  var playerNotes = [];

  // Create the NoteBox objects for each box and get references for each box DOM element
  KEYS.forEach(function(key) {
    notes[key] = new NoteBox(key);
    segments.push(document.getElementById(key));
  });

  // Adds a new note to simon's notes
  function addSimonNote(){
    var key = KEYS[Math.floor(Math.random() * 4)];
    simonNotes.push(notes[key]);
  };

  // Plays simon's notes
  function playSimonNotes(){
    simonNotes.forEach(function(note, i){
      setTimeout(note.play.bind(null, note), i * NOTE_DURATION);
    });
  };
  
  // Adds the clicked segment's note to the player's note list.
  // If the player chooses the wrong note, it restarts the game.
  // If the player successfully completes simon's sequence, it adds 
  // a new note to Simon's sequence and plays it.
  function addPlayerNote(key){
    var noteIndex = playerNotes.length;
    playerNotes.push(notes[key]);

    //clear both note lists and restart
    if(simonNotes[noteIndex] != playerNotes[noteIndex]){
      simonNotes.splice(0, simonNotes.length);
      playerNotes.splice(0, playerNotes.length);
      addSimonNote();
      setTimeout(function(){playSimonNotes()}, NOTE_DURATION + 500);
    }

    // Clear player list and play new simon sequence
    else if(simonNotes.length == noteIndex+1){
      playerNotes.splice(0, playerNotes.length);
      addSimonNote();
      setTimeout(function(){playSimonNotes()}, NOTE_DURATION + 500);
    }
  };

  // Initializes the game
  addSimonNote();
  playSimonNotes();

  segments.forEach(function(box){
    box.addEventListener('mousedown', function(){addPlayerNote(box.id)});
  });
}

simon();
//echo();