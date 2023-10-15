let hangmanImage = document.querySelector(".hangman-box img");
let wordDisplay = document.querySelector(".words-display");
let guessBox = document.querySelector(".guess-text span");
let gameResault = document.querySelector(".game-model");
let playAgainBtn = document.querySelector(".play-again");
let currentWord ,correctLetters=[], wrongCount = 0 ;
let maxTrys = 6;

// get words from json 
function myWords(){
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function(){
        if(this.readyState == 4&& this.status == 200){
            let wordsObject = JSON.parse(this.responseText);
            // select a random word with hint 
            const { word, hint } = wordsObject[Math.floor(Math.random() * wordsObject.length)];
            currentWord = word.toLowerCase();
            document.querySelector(".hint-text span").innerHTML= hint;
            wordDisplay.innerHTML= word.split("").map(()=>` <li class="letter"></li>`).join("");
        }
    }
    myRequest.open("GET", "word-list.json", true);
    myRequest.send();
}
myWords();
playAgainBtn.addEventListener("click", function(){
    window.location.reload();
});

const intGame = (button , clickedLetter)=>{
    if(currentWord.includes(clickedLetter)){
        // showe all right letter
        [...currentWord].forEach((letter , index)=>{
            if(letter === clickedLetter){
                correctLetters.push(letter);
                wordDisplay.querySelectorAll('li')[index].innerHTML = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        })
    }else{
        // change image 
        wrongCount++;
        hangmanImage.src = `./images/hangman-${wrongCount}.svg`;
    }
    button.disabled = true;
    guessBox.innerHTML= `${wrongCount} / ${maxTrys}`;

    // calling resault function
    if(wrongCount === maxTrys) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
}

// creat keyboard buttons
let letters = "abcdefghijklmnopqrstuvwxyz ";
let lettersArray =  Array.from(letters);
let lettersContainer = document.querySelector(".keyboard");
lettersArray.forEach(letter =>{
    let button = document.createElement("button");
    let spanText = document.createTextNode(letter);
    button.appendChild(spanText);
    lettersContainer.appendChild(button);

    button.addEventListener("click", (e) => intGame(e.target, letter));
});


const gameOver = (victory)=>{
    setTimeout(() =>{
        const resaultText = victory ? `You found the word: ` : `The word was: ` 
        gameResault.querySelector('img').src = victory ? `./images/victory.gif` : `./images/lost.gif`
        gameResault.querySelector('h4').innerHTML = victory ? `Congrats!` : `GameOver!`
        gameResault.querySelector('p').innerHTML = `${resaultText} <span>${currentWord}</span>`;
        gameResault.classList.add('show')
    },300)
}

