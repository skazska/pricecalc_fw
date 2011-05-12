




var fnSz = new Array();
var fnPrc = new Array();
var zdnPrc = new Array();
var zdnTxt = new Array();
var glsPrc = new Array();
var glsTxt = new Array();
var bgPrc = new Array();
var bgImg = new Array();
var bgPrf = new Array();
var bgTxt = new Array();
var bgUrl = 'C:/работа/Сайт/багет/';
var logoImg = 'logo1.jpg';

// Паспарту 
	//цена за см2
var pptPrc = 0.070; 
	//процент наценки за двойное
var pptDblPct = 99; 
// Стекло
	//цена за см2
var glsCnt = 3; //количество
var glsIdx = 0; //index
	//цена				   //название	
	glsPrc[0] = 0.085;   glsTxt[0] = "простое"
	glsPrc[1] = 0.180;   glsTxt[1] = "матовое"
	glsPrc[2] = 0.060;   glsTxt[2] = "пластик"


//Задник
	//процент наценки по типам материала...
var zdnCnt = 2; //количество
var zdnIdx = 0; //index
	//процент				//название
	zdnPrc[0] = 0.040;   zdnTxt[0] = "картон"
	zdnPrc[1] = 0.080;   zdnTxt[1] = "пенокартон"

//Багет
var bgtPrc = 0.000;

//Работа
	//процент наценки
var workPct = 30.000;

//Дизайн
	//процент наценки
var designPct = 100.000;

//Подрамник
	//стоимость
var subPrc = 170.000;

//Стирка/глажка
	//стоимость
var cleanPrc = 100;

// количество
var totCnt = 1.000;

// скидка процент
var discPct = 5.000;



//расценки на фурнитуру
//размер       стоимость
fnSz[0] = 0; fnPrc[0] = 20;
fnSz[1] = 30; fnPrc[1] = 25;
fnSz[2] = 50; fnPrc[2] = 35;
fnSz[3] = 70; fnPrc[3] = 45;
fnSz[4] = 90; fnPrc[4] = 55;



//bgImg[0] = 'image';
//bgPrf[0] = 'profile';
//bgPrc[0] = 'cost';


bgImg[0] = '008-001.jpg';
bgPrf[0] = 'profil_008.gif';
bgPrc[0] = '100';
bgTxt[0] = '008-001';

bgImg[10] = 'K1414GD-S.gif';
bgPrf[10] = 'bk1.gif';
bgPrc[10] = '100';
bgTxt[10] = 'K1414GD';

bgImg[11] = 'K1414SL-S.gif';
bgPrf[11] = 'bk1.gif';
bgPrc[11] = '100';
bgTxt[11] = 'K1414SL';

bgImg[20] = '204.OAC.481.jpg';
bgPrf[20] = 'profil_008.gif';
bgPrc[20] = '100';
bgTxt[20] = '204.OAC.481';

bgImg[21] = 'K1417BD-S.gif';
bgPrf[21] = 'p_jj3.gif';
bgPrc[21] = '100';
bgTxt[21] = 'K1417BD-S';

bgImg[22] = 'K1417BK-S.gif';
bgPrf[22] = 'p_jj3.gif';
bgPrc[22] = '100';
bgTxt[22] = 'K1417BK-S';

bgImg[23] = 'K1417BZ-S.gif';
bgPrf[23] = 'p_jj3.gif';
bgPrc[23] = '100';
bgTxt[23] = 'K1417BZ-S';

bgImg[24] = 'K1417DR-S.gif';
bgPrf[24] = 'p_jj3.gif';
bgPrc[24] = '100';
bgTxt[24] = 'K1417DR-S';

bgImg[25] = 'K1417GD-S.gif';
bgPrf[25] = 'p_jj3.gif';
bgPrc[25] = '100';
bgTxt[25] = 'K1417GD-S';

bgImg[26] = 'K1417LB-S.gif';
bgPrf[26] = 'p_jj3.gif';
bgPrc[26] = '100';
bgTxt[26] = 'K1417LB-S';

bgImg[27] = 'K1417LG-S.gif';
bgPrf[27] = 'p_jj3.gif';
bgPrc[27] = '100';
bgTxt[27] = 'K1417LG-S';

bgImg[28] = 'K1417OR-S.gif';
bgPrf[28] = 'p_jj3.gif';
bgPrc[28] = '100';
bgTxt[28] = 'K1417OR-S';

bgImg[29] = 'K1417RG-S.gif';
bgPrf[29] = 'p_jj3.gif';
bgPrc[29] = '100';
bgTxt[29] = 'K1417RG-S';

bgImg[30] = 'K1417SL-S.gif';
bgPrf[30] = 'p_jj3.gif';
bgPrc[30] = '100';
bgTxt[30] = 'K1417SL-S';

bgImg[31] = 'K1417WT-S.gif';
bgPrf[31] = 'p_jj3.gif';
bgPrc[31] = '100';
bgTxt[31] = 'K1417WT-S';

bgImg[32] = 'K1417RM-S.gif';
bgPrf[32] = 'p_jj3.gif';
bgPrc[32] = '100';
bgTxt[32] = 'K1417RM-S';

bgImg[33] = 'br_ah06.jpg';
bgPrf[33] = 'p_ah.gif';
bgPrc[33] = '120';
bgTxt[33] = 'br_ah06';

bgImg[50] = 'br_ah10.jpg';
bgPrf[50] = 'p_ah.gif';
bgPrc[50] = '120';
bgTxt[50] = 'br_ah10';

bgImg[70] = 'b-w851311.jpg';
bgPrf[70] = 'p_b-w.gif';
bgPrc[70] = '130';
bgTxt[70] = 'b-w851311';

bgImg[80] = 'b-w851314.jpg';
bgPrf[80] = 'p_b-w.gif';
bgPrc[80] = '130';
bgTxt[80] = 'b-w851314';

bgImg[81] = 'b1-02.jpg';
bgPrf[81] = 'p_b-w.gif';
bgPrc[81] = '130';
bgTxt[81] = 'b1-02';

bgImg[82] = 'b1-10.jpg';
bgPrf[82] = 'p_b-w.gif';
bgPrc[82] = '130';
bgTxt[82] = 'b1-10';

bgImg[83] = 'K1714GD.gif';
bgPrf[83] = 'p_b-w.gif';
bgPrc[83] = '120';
bgTxt[83] = 'K1714GD';

bgImg[84] = 'K1714BS.gif';
bgPrf[84] = 'p_b-w.gif';
bgPrc[84] = '120';
bgTxt[84] = 'K1714BS';

bgImg[85] = 'K1714BY-S.gif';
bgPrf[85] = 'p_b-w.gif';
bgPrc[85] = '120';
bgTxt[85] = 'K1714BY-S';

bgImg[86] = 'K1714WD-S.gif';
bgPrf[86] = 'p_b-w.gif';
bgPrc[86] = '120';
bgTxt[86] = 'K1714WD-S';

bgImg[87] = 'K1417MH-S.gif';
bgPrf[87] = 'p_b-w.gif';
bgPrc[87] = '120';
bgTxt[87] = 'K1417MH-S';

bgImg[88] = 'K1917SL-S.gif';
bgPrf[88] = 'p_b-w.gif';
bgPrc[88] = '120';
bgTxt[88] = 'K1917SL-S';

bgImg[89] = 'K1917SO.gif';
bgPrf[89] = 'p_b-w.gif';
bgPrc[89] = '120';
bgTxt[89] = 'K1917SO';

bgImg[90] = 'K1917GR-S.gif';
bgPrf[90] = 'p_b-w.gif';
bgPrc[90] = '120';
bgTxt[90] = 'K1917GR-S';

bgImg[91] = 'K1917DO-S.gif';
bgPrf[91] = 'p_b-w.gif';
bgPrc[91] = '120';
bgTxt[91] = 'K1917DO-S';

bgImg[92] = 'K1917BL.gif';
bgPrf[92] = 'p_b-w.gif';
bgPrc[92] = '120';
bgTxt[92] = 'K1917BL';

bgImg[93] = 'K1917WT-S.gif';
bgPrf[93] = 'p_b-w.gif';
bgPrc[93] = '120';
bgTxt[93] = 'K1917WT';

bgImg[94] = 'K2416BL.gif';
bgPrf[94] = 'ah3.gif';
bgPrc[94] = '120';
bgTxt[94] = 'K2416BL';

bgImg[95] = 'K2416CR-S.gif';
bgPrf[95] = 'ah3.gif';
bgPrc[95] = '120';
bgTxt[95] = 'K2416CR';

bgImg[96] = 'K2416BY-S.gif';
bgPrf[96] = 'ah3.gif';
bgPrc[96] = '120';
bgTxt[96] = 'K2416BY-S';

bgImg[97] = 'K2416WD-S.gif';
bgPrf[97] = 'ah3.gif';
bgPrc[97] = '120';
bgTxt[97] = 'K2416WD-S';

bgImg[98] = 'K2416NT-S.gif';
bgPrf[98] = 'ah3.gif';
bgPrc[98] = '120';
bgTxt[98] = 'K2416NT-S';

bgImg[99] = 'K2416YL-S.gif';
bgPrf[99] = 'ah3.gif';
bgPrc[99] = '120';
bgTxt[99] = 'K2416YL-S';

bgImg[100] = 'K2416SL-S.gif';
bgPrf[100] = 'ah3.gif';
bgPrc[100] = '120';
bgTxt[100] = 'K2416SL-S';

bgImg[101] = 'K2416RD-S.gif';
bgPrf[101] = 'ah3.gif';
bgPrc[101] = '120';
bgTxt[101] = 'K2416RD-S';

bgImg[102] = 'K2416GR-S.gif';
bgPrf[102] = 'ah3.gif';
bgPrc[102] = '120';
bgTxt[102] = 'K2416GR-S';

bgImg[103] = 'K2416GD-S.gif';
bgPrf[103] = 'ah3.gif';
bgPrc[103] = '120';
bgTxt[103] = 'K2416GD-S';

bgImg[104] = 'K2416BL-S.gif';
bgPrf[104] = 'ah3.gif';
bgPrc[104] = '120';
bgTxt[104] = 'K2416BL-S';

bgImg[105] = 'K2416DO-S.gif';
bgPrf[105] = 'ah3.gif';
bgPrc[105] = '120';
bgTxt[105] = 'K2416DO-S';

bgImg[106] = 'K2416OK-S.gif';
bgPrf[106] = 'ah3.gif';
bgPrc[106] = '120';
bgTxt[106] = 'K2416OK-S';

bgImg[107] = 'K2416WT-S.gif';
bgPrf[107] = 'ah3.gif';
bgPrc[107] = '120';
bgTxt[107] = 'K2416WT-S';

bgImg[110] = 'br808-08.jpg';
bgPrf[110] = 'p_808.gif';
bgPrc[110] = '170';
bgTxt[110] = 'br808-08';

bgImg[111] = 'K3116BZ-S.gif';
bgPrf[111] = 'p_811.gif';
bgPrc[111] = '170';
bgTxt[111] = 'K3116BZ-S';

bgImg[112] = 'K3116YL-S.gif';
bgPrf[112] = 'p_811.gif';
bgPrc[112] = '170';
bgTxt[112] = 'K3116YL-S';

bgImg[120] = 'c1-ku44g.jpg';
bgPrf[120] = 'c1.gif';
bgPrc[120] = '170';
bgTxt[120] = 'c1-ku44g';

bgImg[125] = 'c1-wb2.jpg';
bgPrf[125] = 'c1.gif';
bgPrc[125] = '170';
bgTxt[125] = 'c1-wb2';

bgImg[130] = 'c1-u.jpg';
bgPrf[130] = 'c1.gif';
bgPrc[130] = '170';
bgTxt[130] = 'c1-u';

bgImg[140] = '341-03.jpg';
bgPrf[140] = 'p_341.gif';
bgPrc[140] = '190';
bgTxt[140] = '341-03';

bgImg[141] = '341-04.jpg';
bgPrf[141] = 'p_341.gif';
bgPrc[141] = '190';
bgTxt[141] = '341-04';

bgImg[150] = '341-05.jpg';
bgPrf[150] = 'p_341.gif';
bgPrc[150] = '190';
bgTxt[150] = '341-05';

bgImg[160] = '341-06.jpg';
bgPrf[160] = 'p_341.gif';
bgPrc[160] = '190';
bgTxt[160] = '341-06';

bgImg[161] = '341-07.jpg';
bgPrf[161] = 'p_341.gif';
bgPrc[161] = '190';
bgTxt[161] = '341-07';

bgImg[170] = '341-09.jpg';
bgPrf[170] = 'p_341.gif';
bgPrc[170] = '190';
bgTxt[170] = '341-09';

bgImg[180] = '135.OAC.502.jpg';
bgPrf[180] = 'bk1.gif';
bgPrc[180] = '170';
bgTxt[180] = '135.OAC.502';

bgImg[181] = 'K3117WT-S.gif';
bgPrf[181] = 'p_am.gif';
bgPrc[181] = '170';
bgTxt[181] = 'K3117WT-S';

bgImg[182] = 'K3121GD-S.gif';
bgPrf[182] = 'p_533.gif';
bgPrc[182] = '160';
bgTxt[182] = 'K3121GD-S';

bgImg[190] = 'bk1-ts1121.jpg';
bgPrf[190] = 'bk1.gif';
bgPrc[190] = '170';
bgTxt[190] = 'bk1-ts1121';

bgImg[191] = 'K2723GD-S.gif';
bgPrf[191] = 'bp3.gif';
bgPrc[191] = '200';
bgTxt[191] = 'K2723GD-S';

bgImg[192] = 'K2723RD-S.gif';
bgPrf[192] = 'bp3.gif';
bgPrc[192] = '200';
bgTxt[192] = 'K2723RD-S';

bgImg[193] = 'K2822GL-S.gif';
bgPrf[193] = 'bp3.gif';
bgPrc[193] = '190';
bgTxt[193] = 'K2822GL-S';

bgImg[194] = 'K2822OK-S.gif';
bgPrf[194] = 'bp3.gif';
bgPrc[194] = '190';
bgTxt[194] = 'K2822OK-S';

bgImg[195] = 'K2922PG-S.gif';
bgPrf[195] = 'bp3.gif';
bgPrc[195] = '210';
bgTxt[195] = 'K2922PG-S';

bgImg[196] = 'K2922SO-S.gif';
bgPrf[196] = 'bp3.gif';
bgPrc[196] = '210';
bgTxt[196] = 'K2922SO-S';

bgImg[240] = '811-07.jpg';
bgPrf[240] = 'p_811.gif';
bgPrc[240] = '230';
bgTxt[240] = '811-07';

bgImg[250] = '350-10.jpg';
bgPrf[250] = 'p_350.gif';
bgPrc[250] = '230';
bgTxt[250] = '350-10';

bgImg[260] = '350-20.jpg';
bgPrf[260] = 'p_350.gif';
bgPrc[260] = '230';
bgTxt[260] = '350-20';

bgImg[261] = 'K4222YL-S.gif';
bgPrf[261] = 'p_br1405g.gif';
bgPrc[261] = '230';
bgTxt[261] = 'K4222YL-S';

bgImg[262] = '826-F0113.jpg';
bgPrf[262] = 'p_284-827.gif';
bgPrc[262] = '250';
bgTxt[262] = '826-F0113';

bgImg[263] = '825-04.jpg';
bgPrf[263] = 'p_284-827.gif';
bgPrc[263] = '250';
bgTxt[263] = '825-04';

bgImg[280] = 'br3-ts1121.jpg';
bgPrf[280] = 'bp3.gif';
bgPrc[280] = '270';
bgTxt[280] = 'br3-ts1121';

bgImg[290] = 'br3-a39101.jpg';
bgPrf[290] = 'bp3.gif';
bgPrc[290] = '270';
bgTxt[290] = 'br3-a39101';

bgImg[300] = 'br3-a503215.jpg';
bgPrf[300] = 'bp3.gif';
bgPrc[300] = '270';
bgTxt[300] = 'br3-a503215';

bgImg[310] = 'br3-glb.jpg';
bgPrf[310] = 'bp3.gif';
bgPrc[310] = '270';
bgTxt[310] = 'br3-glb';

bgImg[320] = '02-12-05.jpg';
bgPrf[320] = 'p_br0-12.gif';
bgPrc[320] = '330';
bgTxt[320] = '02-12-05';

bgImg[330] = 'br-02-07-09.jpg ';
bgPrf[330] = 'p_br02-07.gif';
bgPrc[330] = '330';
bgTxt[330] = 'br-02-07-09';

bgImg[340] = '213-50.jpg';
bgPrf[340] = 'p_533.gif';
bgPrc[340] = '290';
bgTxt[340] = '213-50';

bgImg[350] = '213-gold.jpg';
bgPrf[350] = 'p_533.gif';
bgPrc[350] = '290';
bgTxt[350] = '213-gold';

bgImg[360] = 'mt28-bvg.jpg';
bgPrf[360] = 'p_533.gif';
bgPrc[360] = '290';
bgTxt[360] = 'mt28-bvg';

bgImg[370] = 'mt28-gg.jpg';
bgPrf[370] = 'p_533.gif';
bgPrc[370] = '290';
bgTxt[370] = 'mt28-gg';

bgImg[380] = '142-20.jpg';
bgPrf[380] = 'p_142.gif';
bgPrc[380] = '290';
bgTxt[380] = '142-20';

bgImg[390] = '142-30.jpg';
bgPrf[390] = 'p_142.gif';
bgPrc[390] = '290';
bgTxt[390] = '142-30';

bgImg[391] = '142-08.jpg';
bgPrf[391] = 'p_142.gif';
bgPrc[391] = '290';
bgTxt[391] = '142-08';

bgImg[392] = '142-10.jpg';
bgPrf[392] = 'p_142.gif';
bgPrc[392] = '290';
bgTxt[392] = '142-10';

bgImg[393] = 'K4917BZ-S.gif';
bgPrf[393] = 'p_K5236BZ.gif';
bgPrc[393] = '300';
bgTxt[393] = 'K4917BZ-S';

bgImg[411] = 'K5236BZ-S.gif';
bgPrf[411] = 'p_K5236BZ.gif';
bgPrc[411] = '330';
bgTxt[411] = 'K5236BZ-S';

bgImg[412] = 'K5236GD-S.gif';
bgPrf[412] = 'p_K5236BZ.gif';
bgPrc[412] = '330';
bgTxt[412] = 'K5236GD-S';

bgImg[413] = 'K5236SL-S.gif';
bgPrf[413] = 'p_K5236BZ.gif';
bgPrc[413] = '330';
bgTxt[413] = 'K5236SL-S';

bgImg[415] = 'K5728PB-S.gif';
bgPrf[415] = 'p_K5728PB.gif';
bgPrc[415] = '270';
bgTxt[415] = 'K5728PB-S';

bgImg[414] = 'K6330WT-S.gif';
bgPrf[414] = 'p_K6330WT.gif';
bgPrc[414] = '330';
bgTxt[414] = 'K6330WT-S';

bgImg[420] = '822-70.jpg';
bgPrf[420] = 'p_822.gif';
bgPrc[420] = '450';
bgTxt[420] = '822-70';
