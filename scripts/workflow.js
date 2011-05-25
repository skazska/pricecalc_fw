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

	$$('#'+app._.id+' .appMode').each('hide');	

	var appMode = getCurrentAppMode(app);
	
	$(appMode).fire('refresh');
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


////////////////////////////////////
//  	INIT 
////////////////////////////////////

var init = function () {
//app
//	$$('.app').each('on', 'refresh', onRefresh); 
	$$('.appMode').each('on', 'refresh', onRefresh); 
	
//Plates
	initMainPlt();	
//start	
	$('app1').fire('refresh');

}

$(document).onReady(init);