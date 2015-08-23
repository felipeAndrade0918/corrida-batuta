Main.Ground = function(game, x, y) {
	Phaser.Sprite.call(this, game, x, y);

	// Regular properties
	this.width = this.game.world.width;

	// Physics properties
	this.game.physics.arcade.enable(this);
	this.body.immovable = true;
};

Main.Ground.prototype = Object.create(Phaser.Sprite.prototype);
Main.Ground.prototype.constructor = Main.Ground;