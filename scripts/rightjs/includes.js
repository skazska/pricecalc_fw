Array.include({
	makeString: function(lambda){
		return this.map(lambda).toString();
	}
});




//returns something from array
//arr - an array
//agregator - function(item1,item2){..} 
//					returning item3 which is somehow agregetion of item1 and item2
//					items 1,2 and 3 are of the same type
//morfer    - function (arrayItem){..}
//					returning item which has same type with item1,2 and 3
//					arrayItem is an item of the array
function agregate(arr, agregator, morfer){
	if (arr.length > 1) {
		return agregator(morfer(arr.shift()) ,agregate(arr, agregator, morfer));
	}	else {
		return morfer(arr[0]);	
	}
}