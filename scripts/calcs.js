var Calcs = {
	datalink:{},
	dat:{},
	app:{},
	url: "///home/ksz/my/work/newcalc/",
	recalc: function(unit,parnm, value) {
		//Обновим параметры расчера
		var dat = this.dat;	
		var un = this.app.units;	
		if (defined(unit) && defined(parnm)) {
			setField(dat[unit],parnm,value);
		}
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
		//паспарту
		if ((dat.paspartu.is_on)) {
			//уточняем параметры  
			dat.base.f_width 	+= 2*dat.paspartu.thin;
			dat.base.f_height	+= 2*dat.paspartu.thin;
			dat.base.square = dat.base.f_width*dat.base.f_height;
			dat.base.perimeter = 2*(dat.base.f_width+dat.base.f_height);
			//паспарту
			dat.paspartu.cost = un.paspartu.data.price * dat.base.square;
			dat.paspartu.cost += dat.paspartu.is_double==true?dat.paspartu.cost/100*un.paspartu.data.double_pct:0;
			if (dat.paspartu.adwork > "0") {
				dat.paspartu.cost += dat.paspartu.cost/100*dat.paspartu.adwork;
			}
			dat.paspartu.cost = dat.paspartu.cost.round(2); 
			dat.paspartu.text = dat.paspartu.thin+"см."+(dat.paspartu.is_double==true?", двойное":""); 
			if (dat.paspartu.adwork > "0") {dat.paspartu.text += ", наценка за сложность "+dat.paspartu.adwork+"%";}
			//уточняем стоимость
			dat.base.cost += dat.paspartu.cost;
		}
		dat.base.text += ", изделие:"+(dat.base.width+dat.paspartu.thin).toString()+"Х"+(dat.base.height+dat.paspartu.thin).toString()+"см.";
		//багет
		if ((dat.baget.is_on)) {
			dat.baget.cost = (dat.base.perimeter*dat.baget.bgt.cost/100).round(2);
			dat.base.cost += dat.baget.cost;
			dat.baget.text = "<img height='50' width='50' src='"+dat.baget.bgt.profil+"'><img height='50' src='"+dat.baget.bgt.fas+"'><div style='vertical-align:top;display:inline;'>"+dat.baget.bgt.name+"</div>"; 
		}
		//стекло
		if ((dat.glass.is_on)) {
			dat.glass.cost = (dat.base.square*dat.glass.gls.cost).round(2);
			dat.base.cost += dat.glass.cost;
			dat.glass.text = dat.glass.gls.nm;
		}
		//фурнитура
		if ((dat.furniture.is_on)) {
			dat.furniture.cost = 0;
			un.furniture.data.pricegrid.each(function(prc){
				if (dat.base.perimeter > prc.p) {
					dat.furniture.cost = (prc.cost).round(2);
				}
			});
			dat.base.cost += dat.glass.cost;

//			dat.furniture.text = ""			
		}
		//натяжка
		if ((dat.backside.is_on)) {
			dat.backside.cost = (dat.base.square*dat.backside.bsd.cost).round(2);
			dat.base.cost += dat.backside.cost;
			dat.backside.text = dat.backside.bsd.nm;
		}
		//подрамник
		if ((dat.underram.is_on)) {
			dat.underram.cost = (dat.base.perimeter*un.underram.data.cost/100).round(2);
			dat.base.cost += dat.underram.cost;
		}
		//чистка
		if ((dat.clean.is_on)) {
			dat.clean.cost = (un.clean.data.cost).round(2);
			dat.base.cost += dat.clean.cost;
		}
		//работа
		if (dat.handwork.is_on) {
			dat.handwork.cost = (dat.base.cost/100*un.handwork.data.pct).round(2);
			dat.base.cost += dat.handwork.cost;
		}

		//стоимость изделия
		dat.base.cost = dat.base.cost.round(2);
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
		$("pptDouble").onChange(function(){
			Calcs.recalc("paspartu","is_double",this.checked());
		});
	},
	
	bagetInit: function(){
		//данные приложения по багету
		var unit = this.app.units['baget'];
		//формирование представления выбранного багета
		var updateSelected = function(){
					//обработка выбора багета
					$("bgtSelHead").clean();
					$("bgtSelHead").insert(new Element('span').insert(
							new Element('img',{src:dlg.bgt.profil})
					));
					$("bgtSelHead").insert(new Element('span').insert(
							new Element('img',{src:dlg.bgt.fas})
					));
					$("bgtSelHead").insert(new Element('span').text(dlg.bgt.name));
					$("bgtSelHead").insert(new Element('span').text(dlg.bgt.cost+" р."));
		};
	
		var tabs = new Tabs('bgtCategories',{idPrefix:"bgtTabs"});
		Object.each(unit.data.bgtcat, function(cat,catnm) {
			var list = new Element('div');
			unit.data.bgtspr.filter(function(itm, i){
				return itm.cat == cat;
			}).each(function(bgt){
				//формируем элементы списка багетов
				var e = new Element('div',{
					class:"bgtItem"
				});
				e.on('click', function() {
					dlg.bgt = bgt;
					updateSelected(); 
				});
				//формируем содержимое элемента
				e.setStyle("background-image:url('"+Calcs.url+bgt.fas+"');");
				e.insert(new Element('img',{src:bgt.profil,style:"position:relative;left:-100px;height:90px;width:90px;"}));
				//добавим элемент в список
				list.insert(e);
			});
			tabs.add(catnm,list);
		});
		
		var dlg = new Dialog({
			title:"Выбор багета",
			expandable: false
		}).onOk(function(){
			Calcs.recalc("baget","bgt",dlg.bgt);
			dlg.hide();
		});

		tabs.show("1");

		dlg.html($("bgtContent"));
		//текущий багет
		dlg.bgt = this.dat.baget.bgt;
		//функции интерфейса открытие / закрытие конфигурации
		return {
			onBodyShow : function() {
				dlg.show().expand();
				updateSelected();
			}
		};
	},	
	
	glassInit: function(){
		//данные приложения по стеклу
		var unit = this.app.units['glass'];
		unit.data.matspr.each(function(itm){
			var e = new Element('div', {class:"sprItem", html:itm.nm});
			e.on("click",function(){
				Calcs.recalc("glass","gls",itm);
			});
			$("glsCont").insert(e);
		});
	},
	
	backsideInit: function(){
		//данные приложения по стеклу
		var unit = this.app.units.backside;
		unit.data.matspr.each(function(itm){
			var e = new Element('div', {class:"sprItem", html:itm.nm});
			e.on("click",function(){
				Calcs.recalc("backside","bsd",itm);
			});
			$("bsdCont").insert(e);
		});
	}
	
	
}



