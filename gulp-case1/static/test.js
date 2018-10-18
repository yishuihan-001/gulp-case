function Person(name, age){
	this.name = name;
	this.age = age;
}
Person.prototype = {
	constructor: Person,
	sayName: function(){
		return this.name;
	},
	sayAge: function(){
		return this.age;
	}
};

// var newObj = () => ({
// 	name: 'slient',
// 	age: 24
// });
