
var word = "";
var wordGuess = [];
var wrongGuess = [];
var guessBomb = 0;
var winCount = 1;
var guess = "";
var dif = 0;

function chooseDif(difficulty) {
    dif = difficulty;
    document.getElementById('startButton').style.display = 'block';
    document.querySelector('.chooseDifficulty').style.display = 'none';
    let body = document.body;
    body.style.background = "#0D40BF"
}


function wordw() {
    const randomWords = ["программист", "разработчик", "дизайнер", "администратор", "гость", "пользователь"];
    const raNum = Math.floor(Math.random() * 6);
    return randomWords[raNum]
}


function wordStart() {
    // var wordLength = word.length;
    // var wordL_ = "";
    var count = word.length;

    while (count > 0) {
        wordGuess.push("___");
        count -= 1;
    }
}

function winCountFunc() {
    var num = 0;
    var lettUsed = "";
    var count = word.length;

    while (count > 0) {
        if (lettUsed.includes(word[count - 1])) {

        }

        else {
            num += 1;
            lettUsed += word[count - 1];
        }

        count -= 1;
    }

    return num;
}

function start() {
    document.querySelector("#guess").addEventListener('change', _ => enterGuess());

    let body = document.body;
    body.style.background = "linear-gradient(90deg, #0DCAF0, #0D40BF)";
    // let container = document.getElementById("container");
    // container.style = "background: white; color: #0D40BF; font-weight: 700;";
    word = wordw();
    winCount = winCountFunc();

    if (dif == 1) {
        guessBomb = word.length + 5;
    }

    else if (dif == 2) {
        guessBomb = word.length;
    }

    else if (dif == 3) {
        if (word.length % 2 == 0) {
            guessBomb = word.length / 2;
        }

        else {
            guessBomb = (word.length - 1) / 2;
        }
    }

    console.log(word);
    document.getElementById('mainGame').style.display = 'block';
    document.getElementById('startButton').style.display = 'none';

    document.getElementById("question").innerHTML = "Введите букву";

    wordStart();

    document.getElementById('RRguess').style.display = 'block';
    document.getElementById("rightGuess").innerHTML = "Прогресс слова: " + wordGuess;
    document.getElementById("wrongGuess").innerHTML = "Неверные буквы: " + wrongGuess;
    document.getElementById("guessesLeft").innerHTML = "Попыток осталось: " + guessBomb;

    // var x = document.getElementById("guess").maxLength;
    //document.getElementById("demo").innerHTML = x;
}

function enterGuess() {
    const lett = document.getElementById("guess").value;
    document.getElementById("guess").value = "";

    if (lett.length === 1) {
        var rightOnot = isRightOnot(lett);
        if (rightOnot == true) {

            NewCW(lett);
        }

        else {
            if (!wrongGuess.includes(lett)) {
                // console.log("hi");
                wrongGuess.push(lett);
            }
            guessBomb -= 1;
        }
    }

    else if (lett.length < 1) {

    }

    else {
        guessBomb -= 1;
    }

    if (guessBomb <= 0) {
        gameLose()
    }

    if (winCount <= 0) {
        gameWin()
    }
    document.getElementById("rightGuess").innerHTML = "Прогресс слова: " + wordGuess;
    document.getElementById("wrongGuess").innerHTML = "Неверные буквы: " + wrongGuess;
    document.getElementById("guessesLeft").innerHTML = "Осталось попыток: " + guessBomb;
}

function isRightOnot(a) {
    return word.includes(a);
}

function NewCW(letter) {
    var count = 0;
    winCount -= 1

    while (count <= word.length - 1) {
        if (letter === word[count]) {
            // if(wordGuess[count] === letter) {
            // }
            // else {
            // }

            wordGuess[count] = letter;
            count += 1;
        }
        else {
            count += 1;
        }
    }

}

function gameLose() {
    document.getElementById('mainGame').style.display = 'none';
    document.getElementById('RRguess').style.display = 'none';
    document.getElementById('youLose').style.display = 'block';
    document.getElementById("correctWordWas").innerHTML = "Правильное слово было: " + word;
}

function gameWin() {
    document.getElementById('mainGame').style.display = 'none';
    document.getElementById('RRguess').style.display = 'none';
    document.getElementById('youWin').style.display = 'block';
}

function restart() {
    document.getElementById('mainGame').style.display = 'none';
    document.getElementById('RRguess').style.display = 'none';
    document.getElementById('youLose').style.display = 'none';
    document.getElementById('youWin').style.display = 'none';
    document.querySelector('.chooseDifficulty').style.display = 'grid';

    let body = document.body;
    body.style.background = "linear-gradient(90deg, #0DCAF0, #0D40BF)";
    // let container = document.getElementById("container");
    // container.style = "background: none; color: white; font-weight: none;";
    // container.style = "";
    word = "";
    wordGuess = [];
    wrongGuess = [];
    guessBomb = 0;
    winCount = 1;
    guess = "";
    dif = 0;
}