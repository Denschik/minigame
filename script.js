let question_answer_base_session = [];
let current_question_element = '';
const players = [];
const typePerson = 'person'
const typeAI = 'ai'
const maxQuestions = 5;
let passedQuestions = 0;
const audioClick = new Audio('click.wav');

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
    document.getElementById('playground').style.display = 'block';
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
    players.splice(0,players.length); //clean prev list players
    players.push({
        type: typePerson,
        score: 0,
        lastWord: '',
        name: 'Игрок'
    });

    players.push({
        type: typeAI,
        score: 0,
        lastWord: '',
        name: 'Анна'
    });

    players.push({
        type: typeAI,
        score: 0,
        lastWord: '',
        name: 'Боб'
    });

    players.push({
        type: typeAI,
        score: 0,
        lastWord: '',
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
        return inputAnswer;
    }

    return '';
}

function addPointsToPerson(word){
    players[0].lastWord =  word;
    addPoints(0,word);
}

function addPointsToAI(){
    for (let i = 0; i < players.length; i++) {
        if(players[i].type === typeAI){
            const answer = getRandomAnswer();
            players[i].lastWord =  answer;
            addPoints(i, answer);
        }
    }
}

function addPoints(indexPlayer, word){
    if(word && typeof(players[indexPlayer]) !== 'undefined'){
        players[indexPlayer].score += word.length;
    }
}

function updateScoreBar(){
    let max = 0;
    let leaderIndex = 0;

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const element = $($('.player_column .player_score')[i]);
        const diff = player.score - element.children('.char').length;

        if(diff){

            for (let j = player.lastWord.length-1; j >= 0; j--) {
                const char =  player.lastWord[j];
                $(element).prepend('<div class="char">' + char + '</div>');
            }
            $(element).prepend('<div class="word_spacer"></div>');
        }

        if(player.score > max){
            max = player.score;
            leaderIndex = i;
        }

        document.getElementById('player_' + i).innerHTML = ''; //clear probably prev leader

    }
    document.getElementById('player_' + leaderIndex).innerHTML = '&#128081;'; // set mark of leader
}

function nextStep(){
    const answer = document.getElementById('word_input');
    const answerResult = checkQuestion(answer.value);
    addPointsToPerson(answerResult);
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
        document.getElementById('result_message').innerHTML = 'Поздравляем с победой!';
    } else {
        document.getElementById('result_message').innerHTML = 'К сожалению, вы не набрали максимум очков :(';
    }

    audio.volume = 0.5;
    // audio.play();
    endGameElements();
}

function showResultGame(){
    document.getElementById('result_dashboard').innerHTML = '';

    for(let i = 0; i < players.length; i++) {
        const player = players[i];
        $('#result_dashboard').append('<div class="player_result player_result_' + player.type + '">' + player.name + ' - ' + player.score + '</div>');
    }
}

function endGameElements(){
    showResultGame();
    document.getElementById('run').style.display = 'inline-block';
    document.getElementById('result_block').style.display = 'inline-block';
    document.getElementById('question_block').style.display = 'none';
    document.getElementById('game_panel').style.display = 'none';
    document.getElementById('playground').style.display = 'none';
}

function playClick(){
    audioClick.play();
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

