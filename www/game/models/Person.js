Main.Person = function(game, x, y, image) {
	Phaser.Sprite.call(this, game, x, y, image);

	// Regular properties
	this.animations.add('walking', [6, 7, 8, 7], 4, true);
	this.anchor.set(0.5, 0.7);
	this.scale.set(1.5, 1.5);
	this.checkWorldBounds = true;
	this.outOfBoundsKill = true;
	this.bringToTop();
	// When extending Phaser.Sprite we need to set this property explicitly
	this.alive = true;
	this.events.onKilled.add(this.removePerson, this);

	// Physics properties
	this.game.physics.arcade.enable(this);
	this.body.setSize(13, 28, 7, 15);
	this.body.velocity.x = -200;

	this.animations.play('walking');
};

Main.Person.prototype = Object.create(Phaser.Sprite.prototype);
Main.Person.prototype.constructor = Main.Person;

Main.Person.prototype.removePerson = function(person) {
	if (person.parent) {
	   person.parent.removeChild(person);
	}
	person.destroy;
};