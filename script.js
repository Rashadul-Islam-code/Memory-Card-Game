const endScreen = document.getElementById('endScreen');
const endMessage = document.getElementById('endMessage');
const endTime = document.getElementById('endTime');
const endFlips = document.getElementById('endFlips');
const playAgainBtn = document.getElementById('playAgainBtn');

let maxTime = 60; // 1 minute 


const cards = document.querySelectorAll('.card');

let matchCard = 0;
let cardOne, cardTwo;
let disableDeck = false;

const timerElement = document.getElementById('timer');
const flipsElement = document.getElementById('flips');
const resetBtn = document.getElementById('reset-btn');

let timer;
let time = 0;
let flips = 0;
let gameStarted = false;

function startTimer() {
    timer = setInterval(() => {
        time++;
        timerElement.textContent = time;

        if (time >= maxTime) {
            stopTimer();
            showEndScreen('Game Over');
        }

    }, 1000);
}

function showEndScreen(status) {
    endScreen.classList.remove('hidden');
    endMessage.textContent = status === 'win' ? '🎉 You Win!' : '⏰ Game Over';
    endTime.textContent = time;
    endFlips.textContent = flips;

    // disable all cards
    cards.forEach(card => card.removeEventListener('click', flipCard));
}


function stopTimer() {
    clearInterval(timer);
}


function flipCard(e){
    let clickedCard = e.target.closest('.card'); // safer than e.target alone
    if (clickedCard !== cardOne && !disableDeck && !clickedCard.classList.contains('flip')) {

        if (!gameStarted) {
            gameStarted = true;
            startTimer();
        }

        clickedCard.classList.add('flip');
        flips++;
        flipsElement.textContent = flips;

        if (!cardOne) return cardOne = clickedCard;

        cardTwo = clickedCard;
        disableDeck = true;

        let cardOneImg = cardOne.querySelector('img').src,
            cardTwoImg = cardTwo.querySelector('img').src;

        matchCards(cardOneImg, cardTwoImg);
    }
}


function matchCards(img1, img2){
    // console.log(img1, img2);
    if (img1 === img2) {
        matchCard++;
        if (matchCard === 8) {
            stopTimer();
            setTimeout(() => {
                showEndScreen('win');
            }, 1000);
        }
    

        cardOne.removeEventListener('click', flipCard);
        cardTwo.removeEventListener('click', flipCard);
        cardOne = cardTwo = ''; //setting both card value to blank
        return disableDeck = false;
    }
    // console.log('card not matched'); 

    // if two card not matched
    setTimeout(() => {
        // adding shake class to both card after 400 ms
        cardOne.classList.add('shake');
        cardTwo.classList.add('shake');
    }, 400)

    setTimeout(() => {
        // removing both shake & flip classes from the both card after 1.2 second
        cardOne.classList.remove('shake', 'flip');
        cardTwo.classList.remove('shake', 'flip');
        cardOne = cardTwo = ''; //setting both card value to blank
        disableDeck = false;
    }, 1200)
}

function shuffleCard(){
    matchCard = 0;
    cardOne = cardTwo = '';
    disableDeck = false;
    time = 0;
    flips = 0;
    gameStarted = false;
    timerElement.textContent = '0';
    flipsElement.textContent = '0';
    stopTimer();

    let arr = [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);

    cards.forEach((card, index) => {
        card.classList.remove('flip');
        let imgTag = card.querySelector('img');
        imgTag.src = `assets/img-${arr[index]}.png`;
        card.addEventListener('click', flipCard);
    });
}

resetBtn.addEventListener('click', shuffleCard);


shuffleCard();

cards.forEach(card => { // Adding click events to all cards
    // card.classList.add('flip');
    card.addEventListener('click', flipCard);
    // console.log(card);
})

playAgainBtn.addEventListener('click', () => {
    endScreen.classList.add('hidden');
    shuffleCard();
});
