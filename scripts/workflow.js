function prepareCalcData(callback){
	if (isDataChanged()) {		
		getJSONData('data/data.json', callback);
	}
}

//////////////////////////////////
// refresher functions
//////////////////////////////////

//////////////////////////////////
//вкл выкл видимость плашки
//Data - блок данных приложения
//pn 	 - название раздела
//Data.plates - область данных, описывающих плашки
function togglePlate(Data, pn) {
	if (Data.plates[pn].state) {
		Data.plates[pn].plate.hide();
		Data.plates[pn].state = false;
	}else{
		Data.plates[pn].plate.show();
		Data.plates[pn].state = true;
	}
}

//////////////////////////////////
//инициализация плашек 
//  для каждой плашки привязываем соотв. по имени раздела (поле id) 
//  елемент в поле plate, скрываем элемент, выставляем статус - скрыта
//Data - блок данных приложения
//Data.plates - область данных, описывающих плашки
function refreshPlates(Data) {
	Object.each(
		Data.plates,
		function(key,val){
			if (!defined(val.plate)) {
				val.plate = $(val.id);
				val.plate.hide();
				val.state = false;
				if (defined(Data.functions[key])) {
					 Object.each(Data.functions[key],function(fkey, fval){
						Data.functions[key][fkey] = eval(fval)
					});
					Data.functions[key].init(Data);
				}
			}
		}
	);	
}

//////////////////////////////////
//Инициализация меню
//  Создаем элемент управления (Selectable) - меню
//Data - блок данных приложения
//Data.menu - область данных, описывающих меню
//Data.menu.options - элементы меню, соответствующие названиям разделов приложения
//Data.menu.selected - индексы элементов меню выделенные по умолчанию
//Data.menu.disabled - индексы элементов меню недоступные для магнипуляций пользователю
function refreshMenu(Data) {
			$('wsMenu').clean();
			var menu = new Selectable({
				options:Data.menu.options,
				selected:Data.menu.selected,
				//обработчик выделения пункта меню 
				onSelect:function(evt){
								togglePlate(Data, evt.item._value); 
							},	
				//обработчик снятия выделения пункта меню 
				onUnselect:function(evt){
								togglePlate(Data, evt.item._value);  
							}	
			}).insertTo('wsMenu');
			Data.menu.disabled.each(function(item){
				menu.disable(item);
			});
			menu._.style.width = "100%";	
}	

//////////////////////////////////
//Инициализация режима приложения
//appMode - элемент режима
function refreshAppMode(appMode) {
	if (appMode._.id == 'appModeCalc') {
		//инициализация запроса данных и приложения
		prepareCalcData(function(Data){
			refreshPlates(Data);		
			refreshMenu(Data);
		});
	}
}

//////////////////////////////////
//Инициализация приложения
//app - элемент приложения
function refreshApp(app) {

//	$$('#'+app._.id+' .appMode').each('hide');	

	$(document).children().each('hide');

	var appMode = getCurrentAppMode(app);
		
	$$(appMode).fire('refresh');
	$(appMode).show();	

}

//////////////////////////////////
//event handlers
//////////////////////////////////

//
var onRefresh = function(event) {
	event.stop();	
	var cl = this.getClass();
	switch (cl) {
		case 'app':
			refreshApp(this);		
		break;	
		case 'appMode':
			refreshAppMode(this);		
		break;			
	}	
}


////////////////////////////////////
//local interfaces
////////////////////////////////////
var initMainPlt = function() {
	$('imgWidthSlide1').on('change', function(){
		$('imgWidth').value(this.getValue()*10+$('imgWidthSlide0').getValue()); 	
	});	
	$('imgWidthSlide0').on('change', function(){
		$('imgWidth').value(this.getValue()+$('imgWidthSlide1').getValue()*10); 	
	});
	$('imgWidth').on('change', function(){
		var imgWidth = this.value();
		$('imgWidthSlide0').setValue(imgWidth % 10);
		$('imgWidthSlide1').setValue(Math.floor(imgWidth / 10));
	});
	$('imgWidth').fire('change');

	$('imgHeightSlide1').on('change', function(){
		$('imgHeight').value(this.getValue()*10+$('imgHeightSlide0').getValue()); 	
	});	
	$('imgHeightSlide0').on('change', function(){
		$('imgHeight').value(this.getValue()+$('imgHeightSlide1').getValue()*10); 	
	});
	$('imgHeight').on('change', function(){
		var imgWidth = this.value();
		$('imgHeightSlide0').setValue(imgWidth % 10);
		$('imgHeightSlide1').setValue(Math.floor(imgWidth / 10));
	});
	$('imgHeight').fire('change');

}





//рекурсивно берем поля из вложенных объектов
var getField = function(obj, field) {
	var idx = field.indexOf('.');
	if (idx == -1) {
		if (defined(obj[field])) return obj[field]; else return '';
	} else {
		var o = obj[field.substring(0,idx)];
		return getField(o,field.substring(idx+1));
	}
}

//Заменяем @field@ значениями полей из структуры - контекста
var tplReplace = function(txt, context) {
	if (!isString(txt)){
		alert('wtf?');
		return '';
	}	
	return txt.replace(
		/@([\w\.]+)@/g,
		function(a,b){
			return getField(context,b);
		}
	);
}
//Создаем элемент
var makeElt = function(template, context){
	if (isArray(template)) {
		return template.map(function(elt){return makeElt(elt, context);});
	}	else {
		//подставляем значения в аттрибуты шаблона
		Object.each(template.attrs, function(key, val){
			template.attrs[key] = tplReplace(val, context);
		});
		//создаем элемент
		var elt = new Element(template.tag,template.attrs);
		//содержимое
		if (isArray(template.content)) {
			//шаблон содержит подшаблон
			template.content.each(function(chld){
				elt.insert(makeElt(chld, context));
			});
		} else {
			//шаблон содкржит текст
			elt.text(tplReplace(template.content, context));
		}
		return elt;
	}
}
//активация плашки
var activateUnit = function(evt, unit, itmData){
	unit.etm.hide();
	itmData[unit.id].is_on = "true";
	unit.etp.show();
}
//активация плашки
var deactivateUnit = function(evt, unit, itmData){
	unit.etp.hide();
	itmData[unit.id].is_on = "false";
	unit.etm.show();
	
}
//Инициация интерфейса
var initUI = function(appData, itmData){
	if (itmData.mode == "calc") {
		//Формируем меню и плашки
		var mc = $("wsMenu");
		var pc = $("wsPlates");
		mc.clean();	pc.clean();
		appData.units.each(function(unit){
			//элемент меню
			unit.etm = makeElt(appData.templates.menuItem,unit);
			mc.insert(unit.etm);
			//плашка
			unit.etp = makeElt(appData.templates.plate,unit);
			pc.insert(unit.etp);
			//актив/инактив
			//инициализация
			if (itmData[unit.id].is_on == "true") {
				unit.etm.hide(); unit.etp.show();
			} else {
				unit.etp.hide(); unit.etm.show();
			} 
			//обработка
			if (unit.ui.is_opt == "true"){
				unit.etm.onClick(activateUnit, unit, itmData);
				unit.etp.first('.pltHead').onClick(deactivateUnit, unit, itmData);
			} else {
				
			}
	 		appData.formTmp = ''; appData.form = ''; 
	 		//Тело подгрузка и инициация контента плашек
			getHTMLData(unit.ui.content_url, function(pltData,elt){
				var e = elt.first(".pltBody").html(pltData).hide();
				//отображение тела
				elt.on("mouseover", function(evt, e){
					var callback = function(e) {
						if (e == appData.formTmp) {
							e.show('slide',{duration:'short'});
							if ((appData.form != e)&&(appData.form!='')) {
								appData.form.hide('slide',{duration:'normal'});
							}
							appData.form = e;
						}
					};
					appData.formTmp = e;
					callback.delay(900,e);
				}, e);
				//сокрытие тела
				elt.on("mouseout", function(){
					var callback = function() {
						if ((appData.formTmp == '')&&(appData.form != '' )) {
							appData.form.hide('slide',{duration:'normal'});
							appData.form = '';
						}
					};
					if (appData.formTmp != '') {
						appData.formTmp = '';
						callback.delay(1300);
					}
				});
				
			}.rcurry(unit.etp));
			
		});

		//обработка mouseover
		//показываем приложение
		$$('.'+itmData.mode).each('show');	

	} else {
	}
}


////////////////////////////////////
//  	INIT 
////////////////////////////////////

var init = function (itemId) {	
	$$(".layer").each('hide');

	getJSONData('data/data.json', function(appData){
		getJSONData('data/data1.json', function(itmData){
			initUI(appData, itmData);

		});
	});


}

$(document).onReady(init);