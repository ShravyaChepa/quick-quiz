const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById("loader");
const game = document.getElementById("game");


let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = []

let questions = [];

function decodeHtmlEntities(text){
    var textArea = document.createElement('textarea')
    textArea.innerHTML = text;
    return textArea.value;
}

const category = localStorage.getItem("selectedCat");

let URL = "https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple";
let apiURL = "";
switch (category) {
    case "9":
        apiURL = URL + "&category=9";
        break;
    case "17":
        apiURL = URL + "&category=17";
        break;
    case "18":
        apiURL = URL + "&category=18";
        break;
    case "19":
        apiURL = URL + "&category=19";
        break;
    case "21":
        apiURL = URL + "&category=21";
        break;
    case "22":
        apiURL = URL + "&category=22";
        break;
    case "23":
        apiURL = URL + "&category=23";
        break;
    case "24":
        apiURL = URL + "&category=24";
        break;
    case "25":
        apiURL = URL + "&category=25";
        break;
    case "10":
        apiURL = URL + "&category=10";
        break;
    case "11":
        apiURL = URL + "&category=11";
        break;
    case "12":
        apiURL = URL + "&category=12";
        break;
    case "14":
        apiURL = URL + "&category=14";
        break;
    case "30":
        apiURL = URL + "&category=30";
        break;
    case "27":
        apiURL = URL + "&category=27";
        break;
    case "28":
        apiURL = URL + "&category=28";
        break;
    default:
        apiURL = URL;
        break;
}

fetch(apiURL).then(res => {
    return res.json();
})
.then(loadedQuestions => {
    questions = loadedQuestions.results.map( loadedQuestion =>{
        const formattedQuestion ={
            question : decodeHtmlEntities(loadedQuestion.question)
        };
        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random()*3)+1;
        answerChoices.splice(formattedQuestion.answer-1, 0, loadedQuestion.correct_answer)

        answerChoices.forEach((choice,index)=>{
            choice = decodeHtmlEntities(choice);
            formattedQuestion["choice" + (index+1)] = choice;
        });
        return formattedQuestion;
    });
    startGame();
})
.catch(err => {
    console.error(err);
});

//Constants

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions]
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
}

getNewQuestion = () =>{

    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore',score);
        //go to the end page
        return window.location.assign("/end.html");
    }

    questionCounter++;
    progressText.innerText = "Question "+questionCounter+"/"+MAX_QUESTIONS;

    //Update the progress bar
    progressBarFull.style.width = (questionCounter/MAX_QUESTIONS)*100+"%";

    const questionIndex = Math.floor(Math.random() *availableQuestions.length)
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach( choice =>{
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice'+number]
    });

    availableQuestions.splice(questionIndex,1)

    acceptingAnswers= true;
}

choices.forEach( choice => {
    choice.addEventListener("click", e =>{
        if(!acceptingAnswers) return;

        acceptingAnswers= false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const correctChoice = document.getElementById("choice"+currentQuestion.answer);

        const classToApply = selectedAnswer == currentQuestion.answer? "correct" : "incorrect";
        

        if(classToApply == 'correct'){
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout( () =>{
            selectedChoice.parentElement.classList.remove(classToApply);
            correctChoice.parentElement.classList.add("correct");
            setTimeout(()=>{
                correctChoice.parentElement.classList.remove("correct");
            },1000);
            setTimeout( ()=>{
                getNewQuestion();
            },1000);
        },1000);
        
    });
});

incrementScore = num =>{
    score += num;
    scoreText.innerText = score;
}