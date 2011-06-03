var Calcs = {
	datalink:{},
	dat:{},
	app:{},
	recalc: function(unit,parnm, value) {
		//Обновим параметры расчера
		var dat = this.dat;		
		setField(dat[unit],parnm,value);
	
		//считаем...
		//базовые параметры
		if ((dat.base.width < "1")||(dat.base.height < "1")) {
			dat.base.text = '<font color="red">недопустимые параметры</font>';
		}else{
			dat.base.text = "изображение:"+dat.base.width.toString()+"Х"+dat.base.height.toString()+"см.";
		}
		dat.base.f_width = dat.base.width;
		dat.base.f_height = dat.base.height;
		dat.base.square = dat.base.f_width*dat.base.f_height;
		dat.base.perimeter = 2*(dat.base.f_width+dat.base.f_height);
		dat.base.cost = 0;

		if ((dat.paspartu.is_on)) {
			//уточняем параметры  
			dat.base.f_width 	+= 2*dat.paspartu.thin;
			dat.base.f_height	+= 2*dat.paspartu.thin;
			dat.base.square = dat.base.f_width*dat.base.f_height;
			dat.base.perimeter = 2*(dat.base.f_width+dat.base.f_height);
			//паспарту
			dat.paspartu.cost = dat.paspartu.price * dat.base.square;
			dat.paspartu.cost = dat.paspartu.is_double=="true"?dat.paspartu.cost/100*dat.paspartu.double_pct:dat.paspartu.cost;
			if (dat.paspartu.adwork > "0") {
				dat.paspartu.cost = dat.paspartu.cost + dat.paspartu.cost/100*dat.paspartu.adwork;
			}
			dat.paspartu.cost = dat.paspartu.cost.round(2); 
			dat.paspartu.text = dat.paspartu.thin+"см."+(dat.paspartu.is_double=="true"?", двойное":""); 
			if (dat.paspartu.adwork > "0") {dat.paspartu.text += ", наценка за сложность "+dat.paspartu.adwork+"%";}
			//уточняем стоимость
			dat.base.cost += dat.paspartu.cost;
		}
		dat.base.text += ", изделие:"+(dat.base.width+dat.paspartu.thin).toString()+"Х"+(dat.base.height+dat.paspartu.thin).toString()+"см.";

		
		if ((dat.baget.is_on)) {
			
		}


		//Обновим информацию на экране
		Object.each(this.datalink,function(key, value){
			value.each(function(elt){
				elt.element.html(tplReplace1(elt.content,dat[key]));
			});
		});
	},	

	stubInit:function(){
	
	},

	baseInit:function(){
		var ws0 = new Slider($("imgWidthSlide0"));
		var ws1 = new Slider($("imgWidthSlide1"));
		var hs0 = new Slider($("imgHeightSlide0"));
		var hs1 = new Slider($("imgHeightSlide1"));
		
		ws1.on('change', function(){
			var imgWidth = this.getValue()*10+ws0.getValue();
			$('imgWidth').value(imgWidth); 	
			Calcs.recalc("base","width",imgWidth);
		});	
		ws0.on('change', function(){
			var imgWidth = this.getValue()+ws1.getValue()*10;
			$('imgWidth').value(imgWidth); 	
			Calcs.recalc("base","width",imgWidth);
		});
		$('imgWidth').on('change', function(){
			var imgWidth = this.value().toInt();
			ws0.setValue(imgWidth % 10);
			ws1.setValue(Math.floor(imgWidth / 10));
			Calcs.recalc("base","width",imgWidth);
		});
		$('imgWidth').setValue(this.dat.base.width);
		$('imgWidth').fire('change');
	
		hs1.on('change', function(){
			var imgHeight = this.getValue()*10+hs0.getValue();
			$('imgHeight').value(imgHeight); 	
			Calcs.recalc("base","height",imgHeight);
		});	
		hs0.on('change', function(){
			var imgHeight = this.getValue()+hs1.getValue()*10;
			$('imgHeight').value(imgHeight);
			Calcs.recalc("base","height",imgHeight);
		});
		$('imgHeight').on('change', function(){
			var imgHeight = this.value().toInt();
			hs0.setValue(imgHeight % 10);
			hs1.setValue(Math.floor(imgHeight / 10));
			Calcs.recalc("base","height",imgHeight);
		});
		$('imgHeight').setValue(this.dat.base.height);
		$('imgHeight').fire('change');
	},

	paspartuInit: function() {
		//толщина паспарту
		var ts = new Slider($("pptThinSlide1"));
		ts.on('change', function(){
			Calcs.recalc("paspartu","thin",ts.getValue());
		});
		ts.setValue(this.dat.paspartu.thin);
		ts.fire('change');
		//сложность
		var as = new Slider($("pptAdworkSlide1"));
		as.on('change', function(){
			Calcs.recalc("paspartu","adwork",as.getValue());
		});
		as.setValue(this.dat.paspartu.adwork);
		as.fire('change');
		//двойные
		$("pptDouble").checked(this.dat.paspartu.is_double);
	},
	
	bagetInit: function(){
		//данные приложения по багету
		var unit = this.app.units['baget'];
	
		var dlg = new Dialog();???	
		new Element('div',{
			style:"height:100%",
			onmouseover:function(){ dlg.show(); }
		});
//////-------в диалог? vvvvvv		
		Object.each(unit.data.bgtcat, function(cat,catnm) {
			//формируем елементы списка категорий
			var elt = new Element('div',{
				class:"bgtCategoryItem",
				onclick:function(){
					//обработка активации категории
					unit.data.bgtspr.each(function(bgt){
						//формируем элементы списка багетов
						var e = new Element('div',{
							class:"bgtItem",
							onclick:function(){
								//обработка выбора багета
								Calcs.recalc("baget","bgt",bgt);
								
							}
						});
						//формируем содержимое элемента
						
						//добавим элемент в список
						$("bgtList").insert(e);
					});
				}
			});
			//формируем содержимое
			elt.text(catnm);
			//добавим категорию в список
			$("bgtCatalog").insert(elt);
		});
		
		
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
	bagetInit1: function(Data){
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



