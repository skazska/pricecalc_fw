//рекурсивно берем поля из вложенных объектов
var getField = function(obj, field) {
	var idx = field.indexOf('.');
	if (idx == -1) {
		if (defined(obj[field])) return obj[field]; else return '';
	} else if (defined(obj[field.substring(0,idx)])) {
		return getField(obj[field.substring(0,idx)],field.substring(idx+1));
	} else {
		return '';
	}
}
//рекурсивно пишем в поля вложенных объектов
var setField = function(obj, field, value) {
	var idx = field.indexOf('.');
	if (idx == -1) {
		obj[field] = value;
	} else if (defined(obj[field.substring(0,idx)])) {
		setField(obj[field.substring(0,idx)],field.substring(idx+1),value)
	} else {
		obj[field.substring(0,idx)] = setField(new Object(),field.substring(idx+1));
	}
	return obj;
}

//Заменяем @[field]@ значениями полей из структуры - контекста
var tplReplace = function(txt, context) {
	return txt.replace(
		/@\[([\w\.]+)\]@/g,
		function(a,b){
			return getField(context,b);
		}
	);
}
//Заменяем #[field]# значениями полей из структуры - контекста
var tplReplace1 = function(txt, context) {
	return txt.replace(
		/#\[([\w\.]+)\]#/g,
		function(a,b){
			return getField(context,b);
		}
	);
}
//Создаем элемент
var makeElt = function(template, context, datalink){
	if (isArray(template)) {
		return template.map(function(elt){return makeElt(elt, context, datalink);});
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
				elt.insert(makeElt(chld, context, datalink));
			});
		} else {
			//шаблон содержит текст
			elt.html(tplReplace(template.content, context));
			if (template.content.indexOf("#")>-1) {
				datalink.push({"element":elt,"content":template.content});
			}
		}
		return elt;
	}
}
//активация плашки
var activateUnit = function(evt, unit, itmData){
	unit.etm.hide();
	itmData[unit.id].is_on = true;
	unit.etp.show();
	Calcs.recalc();
};
//активация плашки
var deactivateUnit = function(evt, unit, itmData){
	unit.etp.hide();
	itmData[unit.id].is_on = false;
	unit.etm.show();
	Calcs.recalc();
};

var initUI = function(appData, itmData){
	if (itmData.mode == "calc") {

		//показываем приложение
		$$('.'+itmData.mode).each('show');	


		Calcs.dat = itmData;
		Calcs.app = appData;
		//Формируем меню и плашки
		var mc = $("wsMenu");
		var pc = $("wsPlates");
		mc.clean();	pc.clean();
		//загрузим функцию расчета recalc
		Object.each(appData.units,function(ukey,unit){
			//даталинк
			Calcs.datalink[ukey] = new Array();
			//элемент меню
			unit.etm = makeElt(appData.templates.menuItem,unit,Calcs.datalink[ukey]);
			mc.insert(unit.etm);
			//плашка
			unit.etp = makeElt(appData.templates.plate,unit,Calcs.datalink[ukey]);
			pc.insert(unit.etp);
			//актив/инактив
			//для инициации включаем все плашки 
			if (itmData[ukey].is_on) {
				unit.etm.hide(); unit.etp.show();
			} else {
				unit.etp.hide(); unit.etm.show();
			}
			//обработка
			if (unit.ui.is_opt == true){
				unit.etm.onClick(activateUnit, unit, itmData);
				unit.etp.first('.pltHeadTitle').onClick(deactivateUnit, unit, itmData);
			} else {
				
			}
	 		appData.formTmp = ''; appData.form = ''; 
	 		//Тело подгрузка и инициация контента плашек
			getHTMLData(unit.ui.content_url, function(pltData,elt){
				var e = elt.first(".pltBody").html(pltData);//.hide();
				//Инициализация
				var pltHooks = Calcs[unit.ui.init]();
				if (!defined(pltHooks)) {pltHooks = {};}
				//Скрываем после инициации тк. в скрытом виде ползунок слайдера почемуто не инициализируется
				e.hide();
				//обнаружение тела
				var pltBodyShow = function(e){
					if (e == appData.formTmp) {
						if (defined(pltHooks.onBodyShow)) {
							pltHooks.onBodyShow();
						}else{
							e.show('slide',{duration:'short'});
						}
						if ((appData.form != e)&&(appData.form!='')) {
							appData.form.hide('slide',{duration:'normal'});
						}
						appData.form = e;
					}
				};
				var pltBodyHide = function(){
					if ((appData.formTmp == '')&&(appData.form != '' )) {
						appData.form.hide('slide',{duration:'normal'});
						appData.form = '';
					}
				};
				//раскрытие тела плашки с задержкой (при наведении мыши)
				elt.first('.pltHeadText').on("mouseover", function(evt, e) {
					appData.formTmp = e;	pltBodyShow.delay(900,e);
				}, e);
				//чтоб не схлапывался
				elt.on("mouseover", function(evt, e) {appData.formTmp = e;}, e);
				//раскрытие тела плашки сразу (клик)
				elt.first('.pltHeadText').on("click", function(evt, e) {
					appData.formTmp = e;	pltBodyShow(e);
				}, e);
				//сокрытие тела (мышь покинула плашку)
				elt.on("mouseout", function(){
					if (appData.formTmp != '') {
						appData.formTmp = '';
						pltBodyHide.delay(1300);
					}
				});
			}.rcurry(unit.etp));
		});



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