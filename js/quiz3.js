const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName("btn"));
const questionCounterText = document.getElementById('questionCounter');
const scoreText = document.getElementById('score');

const nextbtn = document.getElementById("next");
const quitbtn = document.getElementById("quit");
const hudd = document.getElementById('hud');
const hidden = document.getElementById("hidden");

console.log(choices);

let currentQue={};
let acceptingAns=false;
let score=0;
let questionCounter =0;
let availableQuestions=[];

let questions=[];

fetch("https://opentdb.com/api.php?amount=5&category=22&difficulty=easy&type=multiple")
.then(res=>{
    return res.json();
})
.then(loadQues =>{
    console.log(loadQues.results);
    questions = loadQues.results.map( loadQues=>{
        const formatQuestions={
            question: loadQues.question
        };
        const answerChoices=[...loadQues.incorrect_answers];
        formatQuestions.answer=Math.floor(Math.random()*5)+1;
        answerChoices.splice(formatQuestions.answer-1, 0, loadQues.correct_answer);

        answerChoices.forEach((choice, index)=>{
            formatQuestions["choice"+(index+1)]=choice;
    })
    return formatQuestions;
});
startQuiz();
})
.catch(err=>{
    console.error(err);
});


const MARKS =1;
const MAX_QUE = 5;

function startQuiz(){
    questionCounter=0;
    score=0;
    scoreText.innerHTML=`${score}`;
    hudd.style.display="flex";
    nextbtn.style.display="none";
    quitbtn.style.display="none";
    hidden.style.display="block";
    availableQuestions=[...questions];
    console.log(availableQuestions);
    getNewQuestion();
}

function resetState(){
    nextbtn.style.display="none";
    hudd.style.display="none";
}

function showScore(){
    resetState();
    question.innerHTML=`You scored ${score} out of 5!`;
    nextbtn.innerHTML="Play Again";

    hidden.style.display="none";
    nextbtn.style.display="block";
    quitbtn.style.display="block";
}

nextbtn.addEventListener("click",()=>{
    window.location.assign("../Selection.html");
})

quitbtn.addEventListener("click", ()=>{
    window.location.assign("../login_page.html");
})


function getNewQuestion(){

    if(availableQuestions.length==0||questionCounter>=MAX_QUE){
        showScore();
    }
    questionCounter++;
    questionCounterText.innerText=`${questionCounter}/${MAX_QUE}`;

    const questionIndex=Math.floor(Math.random()*availableQuestions.length);
    currentQue = availableQuestions[questionIndex];
    question.innerText= currentQue.question;

    choices.forEach(choice=>{
                const number = choice.dataset["number"];
                choice.innerText=currentQue["choice"+number];
            });
            availableQuestions.splice(questionIndex, 1);

            acceptingAns=true;
}

choices.forEach(choice=>{
    choice.addEventListener("click", e=>{
        if(!acceptingAns) return;

        acceptingAns=false;
        const selectedChoice =e.target;
        const selectedAnswer =selectedChoice.dataset["number"];

        let classToApply = 'incorrect';
            if(selectedAnswer==currentQue.answer){
                classToApply='correct';
                incrementScore(MARKS);
            }
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () =>{
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion(); 
        },1000);
    });
});

incrementScore = num =>{
    score+=num;
    scoreText.innerHTML=score;
}