function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

function generateWinningNumber(){
    var num =  Math.random() * 100;
    if(num === 0){
        return 1;
    } else {
        return Math.ceil(num);
    }
}

function shuffle(arr){
    var m = arr.length;
    var t;
    var i;

    //while there remain elements to shuffle
    while(m){

        //pick a remaining element
        i = Math.floor(Math.random() * m--);

        //and swap it with the current element
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }

    return arr;

}



Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
    if(this.playersGuess < this.winningNumber){
        $('#subtitle').text('Guess higher.')
    } else {
        $('#subtitle').text('Guess lower.')
    }
}

Game.prototype.playersGuessSubmission = function(num){
    if(num < 1 || num > 100 || typeof num !== 'number'){
        throw "That is an invalid guess.";
    } else {
        this.playersGuess = num;
    }
    return this.checkGuess(); //remember to include 'this.' before function
};

Game.prototype.checkGuess = function(){
    if(this.playersGuess === this.winningNumber){
        $('#title').text('You Win!');
        $('#hint').prop('disabled', true);
        $('#submit').prop('disabled', true);
        $('#subtitle').text("Click the Reset button to play again.");
        return 'You Win!';
    } else if(this.pastGuesses.indexOf(this.playersGuess) !== -1){
        $('#title').text("You have already guessed that number.");
        return "You have already guessed that number.";
    } else {
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess); //this is clever: see here,  https://css-tricks.com/examples/nth-child-tester/
        var diff = Math.abs(this.playersGuess - this.winningNumber);
        if(this.pastGuesses.length === 5){
            $('#title').text("You Lose.");
            $('#hint').prop('disabled', true);
            $('#submit').prop('disabled', true);
            $('#player-input').prop('disabled', true);
            $('#subtitle').text("Click the Reset button to play again.");
            return "You Lose.";
        } else if (diff < 10){
            $('#title').text("You\'re burning up!");
            this.isLower();
            return "You\'re burning up!";
        } else if (diff < 25){
            $('#title').text("You\'re lukewarm.");
            this.isLower();
            return "You\'re lukewarm.";
        } else if (diff < 50){
            $('#title').text("You\'re a bit chilly.");
            this.isLower();
            return "You\'re a bit chilly.";
        } else if (diff < 100){
            $('#title').text("You\'re ice cold!");
            this.isLower();
            return "You\'re ice cold!";
        }
    }
}; 

function newGame(){
    return new Game();
}

Game.prototype.provideHint = function(){
    var winNum = this.winningNumber;
    var num1 = generateWinningNumber();
    var num2 = generateWinningNumber();
    return shuffle([winNum, num1, num2]);
}


function makeGame(game){
    var guess = $('#player-input').val();
    var output= game.playersGuessSubmission(parseInt(guess, 10));
    //console.log(output);
    $('#player-input').val('');
}

$(document).ready( function() {
    var game = new Game();

    $('#submit').click( function(){
        makeGame(game);
    });

    $('#player-input').keypress(function (e) {
        if(e.which == 13){
            makeGame(game);
        }
    });

    $('#reset').click( function(){
        game = new Game();
        $('#hint, #submit, #player-input').prop('disabled', false);
        $('#submit').prop('disabled', false);
        $('#subtitle').text("Guess a number between 1-100!");
        $('.guess').text("-"); //clever to change for all classes like this
        this.pastGuesses = [];
        $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
    });

    $('#hint').click( function(){
        //need to use game.provideHint NOT this.provideHint
        $('h3').text(game.provideHint());
    });

});

