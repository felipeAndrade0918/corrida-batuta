Main.ScoreSystem = function(game, difficultySystem) {
	this.game = game;

	// Keeps updating the score for each second elapsed
	this.scoreTimer = this.game.time.create();
	this.scoreTimer.loop(Phaser.Timer.SECOND, this.updateScore, this, difficultySystem);
};

Main.ScoreSystem.prototype = {
	// Creates the score text
	createScoreText: function() {
		var scoreText = 'Pontuação: 0';
		var scoreStyle = { font: 'bold 18px Arial', fill: '#DED125', stroke: '#000000', strokeThickness: 3 };
		this.score = this.game.add.text(this.game.world.width -150, 3, scoreText, scoreStyle);
		this.scorePoints = 0;
	},

	createBestScoreText: function() {
		var bestScorePoints = this.getBestScore();
		var bestScoreText = 'Melhor Pontuação: ' + bestScorePoints;
		var bestScoreStyle = { font: 'bold 18px Arial', fill: '#DED125', stroke: '#000000', strokeThickness: 3 };
		this.bestScore = this.game.add.text(this.game.world.centerX - 90, this.game.world.height - 30, bestScoreText, bestScoreStyle);
	},

	updateScore: function(difficultySystem) {
		this.scorePoints++;
		this.score.text = 'Pontuação: ' + this.scorePoints;
		difficultySystem.increaseDifficulty(this.scorePoints);
	},

	// Resume the timer if it is paused or start it if it is not running
	start: function() {
		this.bestScore.destroy();

		if (!this.score) {
			this.createScoreText();
		}

		if (this.scoreTimer.paused) {
			this.score.text = 'Pontuação: 0';
			this.score.alpha = 1;
			this.scoreTimer.resume();
		}
		if (!this.scoreTimer.running) {
			this.scoreTimer.start();
		}
	},

	pause: function() {
		var bestScore = this.getBestScore();
		console.log('Current best score: ' + bestScore);
		if (this.scorePoints > bestScore) {
			console.log('Current score ' + this.scorePoints + ' is bigger than best score ' + bestScore);
			this.saveBestScore(this.scorePoints);
		}

		this.score.alpha = 0;
		this.scorePoints = 0;
		this.scoreTimer.pause();
		this.createBestScoreText();
	},

	getBestScore: function() {
		if (window.localStorage) {
			var bestScore = window.localStorage.getItem('bestScore');

			if (bestScore) {
				return window.localStorage.getItem('bestScore');
			} else {
				return 0;
			}
		}
		return 0;
	},

	saveBestScore: function(bestScore) {
		if (window.localStorage) {
			window.localStorage.setItem('bestScore', bestScore);
		}
	}
};