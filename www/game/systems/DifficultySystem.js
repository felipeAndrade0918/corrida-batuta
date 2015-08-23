Main.DifficultySystem = function(game, peopleNames) {
	this.game = game;
	this.peopleNames = peopleNames;
	this.peopleGroup = this.game.add.group();

	this.backgroundSpeed = 4;
	this.personMaxRespawnTime = 7;

	// Keeps spawning people when the game is running
	this.personTimer = this.game.time.create(false);
	this.personTimer.loop(this.game.rnd.integerInRange(3, 7) * 1000, this.spawnPerson, this);

};

Main.DifficultySystem.prototype = {
	startSpawningPeople: function() {
		// If the personTimer is paused we resume it, otherwise we start it
		if (this.personTimer.paused) {
			this.personTimer.resume();
		}
		if (!this.personTimer.running) {
			this.personTimer.start();
		}
	},

	stopSpawningPeople: function() {
		this.personTimer.stop();
		this.personMaxRespawnTime = 7;
		this.personTimer.loop(this.game.rnd.integerInRange(3, 7) * 1000, this.spawnPerson, this);
	},

	spawnPerson: function() {
		var personPosition = this.game.rnd.integerInRange(0, this.peopleNames.length - 1);
		var person = new Main.Person(this.game, this.game.world.width, this.game.world.height - 25, this.peopleNames[personPosition]);
		this.peopleGroup.add(person);
	},

	increaseDifficulty: function(scorePoints) {
		if (scorePoints % 14 == 0) {
			if (this.personMaxRespawnTime > 3) {
				this.backgroundSpeed += 1;
				
				this.personTimer.stop();
				this.personMaxRespawnTime -= 1;
				this.personTimer.loop(this.game.rnd.integerInRange(3, this.personMaxRespawnTime) * 1000, this.spawnPerson, this);
				this.personTimer.start();
			}
		}
	},

	resetBackgroundSpeed: function() {
		this.backgroundSpeed = 4;
	}
};