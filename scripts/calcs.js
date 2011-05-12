var Calcs = {
	glasInit: function(Data){
		var plate = Data.plates.glas.plate;		
		Data.plates.glas.selMat = new Selectable({
			options:Data.plates.glas.menu.options,
			selected:Data.plates.glas.menu.selected,
			onSelect:function(evt){
				var sel = this;				
				sel.items().each(function(item){
					if (item != evt.item ) {
						sel.unselect(item);
					}
				});
			}
		}).insertTo(plate.first('#pltGlasMatSel'));
		plate.find('li').each(function(elt){
			elt.setStyle('display:inline-block;border-right:1px solid #CCCCCC');
		});
	},	
	bagetInit: function(Data){
		var plate = Data.plates.baget.plate;
		var spr = Data.data.baget.spr;
		var defid = Data.plates.baget.menu.selected[0];
		Data.plates.baget.selBaget = new Selectable({
			options:Data.plates.baget.menu.options,
			selected:Data.plates.baget.menu.selected,
			multiple:false
		}).insertTo(plate.first('#pltBagetSel' ));
		plate.first('div .rui-selectable-container').setStyle({'height':'100px'});
		plate.find('li').each(function(elt){
			var id = defined(elt._value)?elt._value:defid;
			var div = new Element('div', {'class':'bagetProfil'}).insertTo(elt);
			new Element(
				'img',
				{'src':spr[id].profil,'alt':spr[id].profil,'height':100,'width':100}
			).insertTo(div);
			var div = new Element('div',{'class':'bagetFas'}).insertTo(elt);
			new Element(
				'img',
				{'src':spr[id].fas,'alt':spr[id].fas,'height':100,'width':300}
			).insertTo(div);
			var div = new Element('div', {'class':'bagetText'}).insertTo(elt);
			div.text(spr[id].name+' - '+spr[id].cost+'р.');
		});
	},	
	
	
	
	calcByName: function(cn) {
		return this[cn];
	}	
}



