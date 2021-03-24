/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

//global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause between clues
const nextClueWaitTime = 1000; //how long to wait before playing sequence
//global Variables
var pattern = [1,2];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //value between 0.0 and 1.0
var guessCounter = 0
var hidden = false;
var livesLeft = 3;
var hearts = ""
function startGame(){
  //initializes lives left to 3
  livesLeft = 3;
  document.getElementById("LivesLeft").innerHTML = "Lives Left: " + " &hearts; &hearts; &hearts;"
  //randomizes pattern
  var numberofRounds = document.getElementById("NumberofRounds").value;
  console.log(4 == numberofRounds)
  console.log(numberofRounds)
  randomize(numberofRounds);
  console.log(pattern)
  //initialize game variables
  progress = 0; 
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}
function stopGame(){
  pattern = []
  gamePlaying = false;
  progress = 0
  document.getElementById("Rounds").innerHTML = "Round " + (progress+1);
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}
function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}
function winGame(){
  stopGame();
  alert("Game Over. You won!")
}
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
function playClueSequence(){
  guessCounter = 0;
  document.getElementById("Rounds").innerHTML = "Round " + (progress+1);
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}
function guess(btn){
  console.log("user guess: " + btn);
  if(!gamePlaying){
    return;
  }
  if(pattern[guessCounter] == btn){
    //Guess was correct!
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        //GAME OVER: WIN!
        winGame();
      }else{
        //Pattern correct. Add next segment
        progress++;
        playClueSequence();
      }
    }else{
      //so far so good... check the next guess
      guessCounter++;
    }
  }else{
    //Guess was incorrect
    //GAME OVER: LOSE!
    livesLeft -=1;
    //adds in the hearts (1)
    var hearts = ""
    for(let i = 0; i<livesLeft; i++){
      hearts = hearts.concat(" &hearts;");
    }
    document.getElementById("LivesLeft").innerHTML = "Lives Left: " + hearts;
    //hearts (1)
    if(livesLeft==0){
     loseGame(); 
    }
  }
}
//My own code
//Creates a random sequence
function randomize(numberofRounds){
  for(let i = 0; i<numberofRounds; i+=1){
    pattern[i] = Math.floor(Math.random() * 4) + 1  
  }
}
//function hides the squares if hidden is false
function HideSquares(){
  console.log(hidden)
  if(hidden == false){
    hidden = true
    document.getElementById("button"+1).classList.add("hidden");
    document.getElementById("button"+2).classList.add("hidden");
    document.getElementById("button"+3).classList.add("hidden");
    document.getElementById("button"+4).classList.add("hidden");
  }
  else{
    hidden = false
    document.getElementById("button"+1).classList.remove("hidden");
    document.getElementById("button"+2).classList.remove("hidden");
    document.getElementById("button"+3).classList.remove("hidden");
    document.getElementById("button"+4).classList.remove("hidden");
  }
}