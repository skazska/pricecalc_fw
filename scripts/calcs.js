var Calcs = {
	datalink:{},
	dat:{},
	recalc: function(parnm, value) {
		//Обновим параметры расчера
		var dat = this.dat;		
		setField(dat,parnm,value);
	
		//считаем...
		dat.base.cost = "---";
			
		if (dat.paspartu.is_on) {
			dat.paspartu.square = (dat.base.width+2*dat.paspartu.thin)*(dat.base.height+2*dat.paspartu.thin);
			dat.paspartu.cost = dat.paspartu.cost * dat.paspartu.square;
			dat.paspartu.cost = dat.paspartu.is_double=="true"?dat.paspartu.cost*100/dat.paspartu.double_pct:dat.paspartu.cost;
			dat.paspartu.cost = dat.paspartu.cost + dat.paspartu.cost*100/dat.paspartu.adwork;
			dat.paspartu.text = dat.paspartu.thin+"см. "+dat.paspartu.is_double=="true"?"двойное":""; 
			if (dat.paspartu.adwork > "0") {dat.paspartu.text += " наценка за сложность "+dat.paspartu.adwork;}
		} else {
			dat.paspartu.cost = 0;
		}
		
		dat.baget.perimeter = ((dat.base.width+2*dat.paspartu.thin)+(dat.base.height+2*dat.paspartu.thin))*2;
	
	
		//Обновим информацию на экране
		Object.each(this.datalink,function(key, value){
			value.each(function(elt){
				elt.element.text(tplReplace1(elt.content,dat[key]));
			});
		});
	},	

	stubinit:function(){
	
	},

	baseInit:function(){
		var ws0 = new Slider($("imgWidthSlide0"));
		var ws1 = new Slider($("imgWidthSlide1"));
		var hs0 = new Slider($("imgHeightSlide0"));
		var hs1 = new Slider($("imgHeightSlide1"));
		
		ws1.on('change', function(){
			var imgWidth = this.getValue()*10+ws0.getValue();
			$('imgWidth').value(imgWidth); 	
			Calcs.recalc("base.width",imgWidth);
		});	
		ws0.on('change', function(){
			var imgWidth = this.getValue()+ws1.getValue()*10;
			$('imgWidth').value(imgWidth); 	
			Calcs.recalc("base.width",imgWidth);
		});
		$('imgWidth').on('change', function(){
			var imgWidth = this.value();
			ws0.setValue(imgWidth % 10);
			ws1.setValue(Math.floor(imgWidth / 10));
			Calcs.recalc("base.width",imgWidth);
		});
		$('imgWidth').fire('change');
	
		hs1.on('change', function(){
			$('imgHeight').value(this.getValue()*10+hs0.getValue()); 	
		});	
		hs0.on('change', function(){
			$('imgHeight').value(this.getValue()+hs1.getValue()*10); 	
		});
		$('imgHeight').on('change', function(){
			var imgWidth = this.value();
			hs0.setValue(imgWidth % 10);
			hs1.setValue(Math.floor(imgWidth / 10));
		});
		$('imgHeight').fire('change');
	},
	
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
	}	
	
}



