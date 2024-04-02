const cards = document.querySelectorAll('.memory-card');
const startBtn = document.querySelector('.start-btn');
const startPage = document.querySelector('.start-page');

const dialog = document.querySelector('.dialog');
const dialogTime = document.querySelector('.dialog span');
const dialogInput = document.querySelector('.dialog input');
const dialogBtn = document.querySelector('.dialog button');

const timerEl = document.querySelector('.hud .timer');
const scoreboardEl = document.querySelector('.hud .scoreboard');

const particle = {
	id: "tsparticles",
	options: {
		"fullScreen": {
			"zIndex": 1
		},
		"particles": {
			"number": {
				"value": 0
			},
			"color": {
				"value": [
					"#00FFFC",
					"#FC00FF",
					"#fffc00"
				]
			},
			"shape": {
				"type": "circle",
				"options": {}
			},
			"opacity": {
				"value": {
					"min": 0,
					"max": 1
				},
				"animation": {
					"enable": true,
					"speed": 2,
					"startValue": "max",
					"destroy": "min"
				}
			},
			"size": {
				"value": {
					"min": 9,
					"max": 9
				}
			},
			"links": {
				"enable": false
			},
			"life": {
				"duration": {
					"sync": true,
					"value": 5
				},
				"count": 1
			},
			"move": {
				"enable": true,
				"gravity": {
					"enable": false,
					"acceleration": 10
				},
				"speed": {
					"min": 50,
					"max": 150
				},
				"decay": 0.1,
				"direction": "none",
				"straight": false,
				"outModes": {
					"default": "destroy",
					"top": "none"
				}
			},
			"rotate": {
				"value": {
					"min": 0,
					"max": 360
				},
				"direction": "random",
				"move": true,
				"animation": {
					"enable": true,
					"speed": 60
				}
			},
			"tilt": {
				// "direction": "random",
				"enable": true,
				"move": true,
				"value": {
					"min": 0,
					"max": 360
				},
				"animation": {
					"enable": true,
					"speed": 60
				}
			},
			"roll": {
				"darken": {
					"enable": true,
					"value": 25
				},
				"enable": true,
				"speed": {
					"min": 15,
					"max": 25
				}
			},
			"wobble": {
				"distance": 100,
				"enable": true,
				"move": true,
				"speed": {
					"min": -1,
					"max": 1
				}
			}
		},
		"emitters": {
			"life": {
				"count": 1,
				"duration": 0.01,
				"delay": 0
			},
			"rate": {
				"delay": 0.01,
				"quantity": 150
			},
			"size": {
				"width": 0,
				"height": 0
			},
			"position": {
				"x": 50,
				"y": 50
			}
		}
	}
};

class Scoreboard {
	/**
	 * @type {{name: string, time: number}[]}
	 */
	#scoreboard; // {name, time}[]

	constructor() {
		try {
			this.#scoreboard = JSON.parse(localStorage.getItem('mg-scoreboard')) || [];
		} catch (error) {
			this.#scoreboard = [];
		}
	}

	save(name, time) {
		this.#scoreboard.push({ name, time });
		this.#scoreboard.sort((a, b) => a.time - b.time);

		localStorage.setItem('mg-scoreboard', JSON.stringify(this.#scoreboard));
	}

	get() {
		return this.#scoreboard;
	}
}

const scoreboard = new Scoreboard();

scoreboard.get().slice(0, 10).forEach(({name, time}) => {
	const div = document.createElement('div');

	const
		minutes = Math.floor(time / 60000),
		seconds = Math.floor((time / 1000) % 60);

	console.log(minutes, seconds);

	div.className = 'score';
	div.innerHTML= `<span class="name">${name}</span> <span class="time">${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}</span>`;
	scoreboardEl.appendChild(div);
});

// Timer in the corner
let startTime, interval;

function timer() {
	const time = Date.now() - startTime;

	const
		minutes = Math.floor(time / 60000),
		seconds = Math.floor((time / 1000) % 60);

	timerEl.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

startBtn.onclick = () => {
	startPage.style.display = 'none';

	startTime = Date.now();
	interval = setInterval(timer, 1000);
}

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
	if (lockBoard) return;
	if (this === firstCard) return;
	if (this.classList.contains('match')) return;

	this.classList.add('flip');

	if (!hasFlippedCard) {
		hasFlippedCard = true;
		firstCard = this;
		return;
	}

	secondCard = this;
	lockBoard = true;

	checkForMatch();
}

function checkForMatch() {
	let isMatch = firstCard.dataset.name === secondCard.dataset.name;
	if (isMatch) {
		// firstCard.dataset.classList.add('match');
		// secondCard.dataset.classList.add('match');
		firstCard.classList.add('match');
		secondCard.classList.add('match');
		console.log("Match!");
		tsParticles.load(particle);
		disableCards();

		// Check for all cards matched
		const allMartched = cards.values().every(card => card.classList.contains('match'));
		if (allMartched) {
			console.log('All cards matched');

			const time = Date.now() - startTime;
			clearInterval(interval);

			dialogTime.textContent = `${timerEl.textContent}`;
			dialogBtn.onclick = () => {
				scoreboard.save(dialogInput.value || "Anonymous", time);
				location.reload();
			}
			dialog.oncancel = e => e.preventDefault();
			dialog.showModal();
		}
	} else {
		unflipCards();
	}
}

function disableCards() {
	firstCard.addEventListener("click", flipCard);
	secondCard.addEventListener("click", flipCard);

	resetBoard();
}

function unflipCards() {
	setTimeout(() => {
		firstCard.classList.remove('flip');
		secondCard.classList.remove('flip');

		resetBoard();
	}, 1000);
}

function resetBoard() {
	hasFlippedCard = false;
	lockBoard = false;
	firstCard = null;
	secondCard = null;
}

(function shuffle() {
	cards.forEach(card => {
		let ramdomPos = Math.ceil(Math.random() * 12);
		card.style.order = ramdomPos;
	});
})();

cards.forEach(card => card.addEventListener('click', flipCard));