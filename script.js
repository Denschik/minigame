let question_answer_base_session = [];
let current_question_element = '';
const players = [];
const typePerson = 'person'
const typeAI = 'ai'
const maxQuestions = 5;
let passedQuestions = 0;

function run(){
    passedQuestions = 0; //set start value for passed questions
    startGameElements();
    initPlayers();
    renderPlayersScore();
    question_answer_base_session = structuredClone(question_answer_base);
    startNewQuestion();
}

function startGameElements(){
    document.getElementById('run').style.display = 'none';
    document.getElementById('result_block').style.display = 'none';
    document.getElementById('question_block').style.display = 'block';
    document.getElementById('game_panel').style.display = 'block';
}

function renderPlayersScore(){
    const playground = document.getElementById('playground');
    playground.innerHTML = '';

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        playground.innerHTML+= `<div class="player_column ` + player.type + `_column">
                                    <div id="player_` + i + `" class="player_status"></div>
                                    <div class="player_score"></div>
                                    <div class="player_name">` + player.name + `</div>
                                </div>`;

    }
}

function initPlayers(){
    players.splice(0,players.length);
    players.push({
        type: typePerson,
        score: 0,
        position: 10,
        name: 'Игрок'
    });

    players.push({
        type: typeAI,
        score: 0,
        position: 10,
        name: 'Анна'
    });

    players.push({
        type: typeAI,
        score: 0,
        position: 10,
        name: 'Боб'
    });

    players.push({
        type: typeAI,
        score: 0,
        position: 10,
        name: 'Влад'
    });
}

function startNewQuestion(){
    ++passedQuestions;
    current_question_element = getRandomQuestionElement();
    document.getElementById('question').innerHTML = current_question_element.question;
}

function getRandomQuestionElement(){
    const random = getRandom(0, question_answer_base_session.length-1);
    const result = question_answer_base_session.splice(random, 1)[0];

    return result;
}

function getRandomAnswer(){
    const random = getRandom(0, current_question_element.answers.length-1);
    return current_question_element.answers[random];
}

function checkQuestion(inputAnswer){
    if(current_question_element.answers.find(answer => inputAnswer.toLowerCase() === answer.toLowerCase())){
        return inputAnswer.length;
    }

    return 0;
}

function addPointsToPerson(points){
    addPoints(0, points);
}

function addPointsToAI(){
    for (let i = 0; i < players.length; i++) {
        if(players[i].type === typeAI){
            const answer = getRandomAnswer();
            addPoints(i, answer.length);
        }
    }
}

function addPoints(indexPlayer, points){
    if(points > 0 && typeof(players[indexPlayer]) !== 'undefined'){
        players[indexPlayer].score += points;
    }
}

function updateScoreBar(){
    let max = 0;
    let leaderIndex = 0;

    for (let i = 0; i < players.length; i++) {
        const player = players[i];

        $($('.player_column .player_score')[i]).css({'height': (player.score * 2) + 'px'})

        if(player.score > max){
            max = player.score;
            leaderIndex = i;
        }

        document.getElementById('player_' + i).innerHTML = ''; //clear probably prev leader

    }
    document.getElementById('player_' + leaderIndex).innerHTML = '&#128081;'; // set mark of leader
}

function nextStep(){
    const answer = document.getElementById('wordInput');
    const answerResult = checkQuestion(answer.value);

    addPoints(0, answerResult); //add points to player
    addPointsToAI();
    updateScoreBar();
    answer.value = ''; //clear input after answer

    if(passedQuestions < maxQuestions)
        startNewQuestion();
    else
        finishGame();
}

function finishGame(){
    let maxScore = 0;
    let leaderIndex = 0;
    let audio = new Audio('lose.wav');

    for (let i = 0; i < players.length; i++) {
        const player = players[i];

        if(player.score > maxScore){
            leaderIndex = i;
            maxScore = player.score
        }
    }


    if(players[leaderIndex].type === typePerson){
        audio = new Audio('win.wav');
        document.getElementById('result_block').innerHTML = 'Поздравляем с победой!';
    } else {
        document.getElementById('result_block').innerHTML = 'К сожалению, вы не набрали максимум очков :(';
    }

    audio.play();
    endGameElements();
}

function endGameElements(){
    document.getElementById('run').style.display = 'inline-block';
    document.getElementById('result_block').style.display = 'inline-block';
    document.getElementById('question_block').style.display = 'none';
    document.getElementById('game_panel').style.display = 'none';
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

