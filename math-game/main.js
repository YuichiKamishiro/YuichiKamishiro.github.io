var playing = false;
var score;
var action;
var timeremaining;
var correctAnswer;
var level = 1;
let correctPosition = 0;

document.getElementById("startreset").onclick = function () {
	if (level == 0) {
		show("warn");
		setTimeout(function () {
			hide("warn");
		}, 1000);
	}
	if (playing == true) {
		location.reload();
	}
	else if (playing == false && level != 0) {
		playing = true;
		score = 0;

		document.getElementById("scorevalue").innerHTML = score;
		//show count
		show("timeremaining");
		timeremaining = 20;

		document.getElementById("timeremainingvalue").innerHTML = timeremaining;
		//hide game over
		hide("gameOver");

		//change start to reset		
		document.getElementById("startreset").innerHTML = "Заново";

		//start count
		startCountdown();

		//generate quetion
		generateQA();

	}
}


document.getElementById("level1").onclick = function () {
	let el2 = document.getElementById("level2");
	el2.classList.remove("right");
	level = 1;
	
	let el = document.getElementById("level1");
	el.classList.add("right");
}
document.getElementById("level2").onclick = function () {
	let el2 = document.getElementById("level1");
	el2.classList.remove("right");
	level = 2;
	let el = document.getElementById("level2");
	el.classList.add("right");
}
let i = 1
for (i = 1; i < 5; i++) {
	console.log(i);
	document.getElementById("box" + i).onclick = function () {
		if (playing == true) {
			if (this.innerHTML == correctAnswer) {
				const el = document.getElementById("box" + correctPosition);
				el.classList.add("right");
				setTimeout(function () {
					el.classList.remove("right");
				}, 1000);
				//increase score
				score++;
				document.getElementById("scorevalue").innerHTML = score;
				setTimeout(function () {
					generateQA();
				}, 1000);

			} else {
				this.style.outline = "solid 4px #de401a";
				setTimeout(() => {
					this.style.outline = null;
				}, 1000);
			}
		}
	}
}

//functions
//start count
function startCountdown() {
	action = setInterval(function () {
		timeremaining -= 1;


		document.getElementById("timeremainingvalue").innerHTML = timeremaining;
		if (timeremaining == 0) {
			stopCountdown();
			show("gameOver");

			//game over			
			document.getElementById("gameOver").innerHTML = "<p>Начать заново!</p><p>Ваш результат " + score + ".</p>";
			hide("timeremaining");
			playing = false;

			document.getElementById("startreset").innerHTML = "Начать";
		}
	}, 1000);
}

//stop count
function stopCountdown() {
	clearInterval(action);
}

//hide
function hide(Id) {
	document.getElementById(Id).style.display = "none";
}

//show
function show(Id) {
	document.getElementById(Id).style.display = "block";
}
//guestion
function generateQA() {
	if (level == 1) {
		var x = 1 + Math.round(5 * Math.random());
		var y = 1 + Math.round(5 * Math.random());
		correctAnswer = x * y;
	}
	else if (level == 2) {
		var x = 1 + Math.round(10 * Math.random());
		var y = 1 + Math.round(10 * Math.random());
		var z = 1 + Math.round(10 * Math.random());
		var choice = 1 + Math.round(2 * Math.random());
		if (choice == 1) {
			correctAnswer = x * y + z;
		} else {
			correctAnswer = x * y - z;
		}
	}
	if (level == 2) {
		if (choice == 1) {
			document.getElementById("question").innerHTML = "(" + x + "*" + y + ")" + "+" + z;
		} else if (choice == 2) {
			document.getElementById("question").innerHTML = "(" + x + "*" + y + ")" + "-" + z;
		}
	} else {
		document.getElementById("question").innerHTML = x + "*" + y;
	}

	correctPosition = 1 + Math.round(3 * Math.random());

	document.getElementById("box" + correctPosition).innerHTML = correctAnswer;//correct answer

	//wrong answers
	var answers = [correctAnswer];

	for (i = 1; i < 5; i++) {
		if (i != correctPosition) {
			var wrongAnswer;
			do {
				wrongAnswer = (1 +
					Math.round(9 * Math.random())) * (1 +
						Math.round(9 * Math.random()));//wrong answer

			} while (answers.indexOf(wrongAnswer) > -1)

			document.getElementById("box" + i).innerHTML = wrongAnswer;
			answers.push(wrongAnswer);
		}
	}
}