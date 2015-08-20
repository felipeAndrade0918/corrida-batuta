Main.Person = function(game, x, y, image) {
	Phaser.Sprite.call(this, game, x, y, image);

	// Regular properties
	this.animations.add('walking', [6, 7, 8, 7], 4, true);
	this.anchor.set(0.5, 0.7);
	this.scale.set(1.5, 1.5);
	this.checkWorldBounds = true;
	this.outOfBoundsKill = true;
	this.bringToTop();

	// Physics properties
	this.game.physics.arcade.enable(this);
	this.body.setSize(17, 35);
	this.body.immovable = true;
	this.body.velocity.x = -200;

	this.animations.play('walking');
	this.game.add.existing(this);
};

Main.Person.prototype = Object.create(Phaser.Sprite.prototype);
Main.Person.prototype.constructor = Main.Person;