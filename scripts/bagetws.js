function extend(Child, Parent) {
	    var F = function() { }
	    F.prototype = Parent.prototype
	    Child.prototype = new F()
	    Child.prototype.constructor = Child
	    Child.superclass = Parent.prototype
	}

//baget WorkShop 

//form
var AppForm = new Class({
//constructor
	initialize: function(elts){
		this.elements = elts;
	},
//methods
	show: function() {
		for (var elt in elements) {
			elt.show();
		} 
	}, 
	hide: function() {
		for (var elt in elements) {
			elt.hide();
		} 
	} 
});

//edit form
var EditForm = new Class(AppForm, {
//constructor
	initialize: function(elts) {
		this.$super(elts);
	}
//methods
	
	
}

//print form
var PrintForm = new Class(AppForm, {
//constructor
	initialize: function(elts) {
		this.$super(elts);
	}
//methods
	
	
}


//calculator application
var BagetCalc =new Class({
	extend: {
		DATA:  
	}
//constructor
	initialize: function() {
		
		var editElts = 
		var printElts	
		this.editForm = new editForm(editElts);
		this.printForm = new printForm(printElts);
	}

//methods
	
}