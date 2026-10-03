  // ---------- 全球数据（演示用；汇率为近似值，运营商为各市场主要品牌） ----------
  // 每个货币：1 美元约合多少该货币
  var FX = {
    CNY: 7.1, HKD: 7.8, MOP: 8.0, TWD: 30, JPY: 145, KRW: 1380, KPW: 900, MNT: 3450, SGD: 1.3, MYR: 4.3, THB: 33, VND: 25500, PHP: 56, IDR: 16300,
    KHR: 4050, LAK: 21500, MMK: 2100, BND: 1.3, USD: 1, INR: 84, PKR: 280, BDT: 120, LKR: 300, NPR: 135, BTN: 84, MVR: 15.4, AFN: 70,
    KZT: 500, UZS: 12700, KGS: 87, TJS: 10.7, TMT: 3.5, AED: 3.67, SAR: 3.75, QAR: 3.64, KWD: 0.31, BHD: 0.377, OMR: 0.385, YER: 250,
    IQD: 1310, IRR: 42000, JOD: 0.71, LBP: 89500, SYP: 13000, ILS: 3.7, TRY: 34, GEL: 2.7, AMD: 390, AZN: 1.7,
    GBP: 0.78, EUR: 0.92, CHF: 0.88, DKK: 6.9, SEK: 10.5, NOK: 10.8, ISK: 138, PLN: 4.0, CZK: 23.5, HUF: 370, RON: 4.6, BGN: 1.8,
    RSD: 108, BAM: 1.8, MKD: 57, ALL: 92, UAH: 41, BYN: 3.3, MDL: 18, RUB: 90, GIP: 0.78,
    EGP: 49, MAD: 10, DZD: 134, TND: 3.1, LYD: 4.85, SDG: 600, SSP: 1300, ETB: 120, ERN: 15, DJF: 178, SOS: 570, KES: 129, UGX: 3700,
    TZS: 2650, RWF: 1350, BIF: 2900, MZN: 64, MWK: 1735, ZMW: 26, BWP: 13.6, NAD: 18, ZAR: 18, LSL: 18, SZL: 18, AOA: 900, CDF: 2850,
    XAF: 605, XOF: 605, NGN: 1550, GHS: 15.5, GNF: 8600, SLE: 22.5, LRD: 195, GMD: 70, MRU: 40, CVE: 101, STN: 22.5, MGA: 4600,
    MUR: 46, SCR: 14, KMF: 453,
    CAD: 1.37, MXN: 19.5, GTQ: 7.7, BZD: 2, HNL: 25, NIO: 36.8, CRC: 515, PAB: 1, CUP: 24, DOP: 60, HTG: 131, JMD: 157, BSD: 1, BBD: 2,
    TTD: 6.8, XCD: 2.7, KYD: 0.83, BMD: 1, AWG: 1.79, ANG: 1.79,
    BRL: 5.6, ARS: 1000, CLP: 940, COP: 4200, PEN: 3.75, VES: 40, BOB: 6.9, PYG: 7700, UYU: 42, GYD: 209, SRD: 34,
    AUD: 1.53, NZD: 1.68, PGK: 3.95, FJD: 2.25, SBD: 8.4, VUV: 119, WST: 2.8, TOP: 2.35, XPF: 110
  };
  var REGIONS = { asia: '亚洲', europe: '欧洲', africa: '非洲', namerica: '北美洲', samerica: '南美洲', oceania: '大洋洲' };
  var HOT = ['CN', 'HK', 'TW', 'SG', 'MY', 'TH', 'VN', 'PH', 'ID', 'IN', 'JP', 'KR', 'US', 'GB', 'AU', 'AE'];
  var CN_PRICES = { 10: 9.95, 20: 19.9, 30: 29.8, 50: 49.6, 100: 98.8, 200: 197.5, 300: 296, 500: 493 };

  // 字段：代码, 中文名, 英文名, 区号, 货币, 大洲, 最少位数, 最多位数, 输入时去掉开头0, 首位规则, 运营商[[名称, 号段(可选)], ...]
  var RAW = [
    // ===== 亚洲 =====
    ['CN', '中国大陆', 'China', '86', 'CNY', 'asia', 11, 11, 0, '1[3-9]', [['中国移动', '134,135,136,137,138,139,147,150,151,152,157,158,159,165,172,178,182,183,184,187,188,195,197,198'], ['中国联通', '130,131,132,145,155,156,166,167,171,175,176,185,186,196'], ['中国电信', '133,149,153,173,177,180,181,189,190,191,193,199'], ['中国广电', '192']]],
    ['HK', '中国香港', 'Hong Kong', '852', 'HKD', 'asia', 8, 8, 0, '[569]', [['csl'], ['3HK'], ['SmarTone'], ['中国移动香港']]],
    ['MO', '中国澳门', 'Macao', '853', 'MOP', 'asia', 8, 8, 0, '6', [['CTM'], ['3 Macau'], ['中国电信澳门'], ['SmarTone Macau']]],
    ['TW', '中国台湾', 'Taiwan', '886', 'TWD', 'asia', 9, 9, 1, '9', [['中华电信'], ['台湾大哥大'], ['远传电信']]],
    ['JP', '日本', 'Japan', '81', 'JPY', 'asia', 10, 10, 1, '[789]0', [['NTT docomo'], ['au'], ['SoftBank'], ['Rakuten Mobile']]],
    ['KR', '韩国', 'South Korea', '82', 'KRW', 'asia', 9, 10, 1, '1', [['SK Telecom'], ['KT'], ['LG U+']]],
    ['KP', '朝鲜', 'North Korea', '850', 'KPW', 'asia', 10, 10, 1, '', [['Koryolink'], ['Kangsong Net']]],
    ['MN', '蒙古', 'Mongolia', '976', 'MNT', 'asia', 8, 8, 0, '', [['Mobicom'], ['Unitel'], ['Skytel'], ['G-Mobile']]],
    ['SG', '新加坡', 'Singapore', '65', 'SGD', 'asia', 8, 8, 0, '[89]', [['Singtel'], ['StarHub'], ['M1'], ['Simba']]],
    ['MY', '马来西亚', 'Malaysia', '60', 'MYR', 'asia', 9, 10, 1, '1', [['Maxis / Hotlink', '12,17,142'], ['CelcomDigi', '13,19,148,10,16,11'], ['U Mobile', '18'], ['Yes']]],
    ['TH', '泰国', 'Thailand', '66', 'THB', 'asia', 9, 9, 1, '[689]', [['AIS'], ['True / dtac'], ['NT Mobile']]],
    ['VN', '越南', 'Vietnam', '84', 'VND', 'asia', 9, 9, 1, '[3-9]', [['Viettel', '86,96,97,98,32,33,34,35,36,37,38,39'], ['Vinaphone', '88,91,94,81,82,83,84,85'], ['MobiFone', '89,90,93,70,76,77,78,79'], ['Vietnamobile', '92,52,56,58']]],
    ['PH', '菲律宾', 'Philippines', '63', 'PHP', 'asia', 10, 10, 1, '9', [['Globe / TM', '905,906,915,916,917,926,927,935,936,945,955,956,965,966,975,976,995,996,997'], ['Smart / TNT', '907,908,909,918,919,920,921,928,929,939,946,947,949,951,961,970,981,998,999'], ['DITO', '991,992,993,994']]],
    ['ID', '印度尼西亚', 'Indonesia', '62', 'IDR', 'asia', 9, 12, 1, '8', [['Telkomsel', '811,812,813,821,822,823,851,852,853'], ['Indosat', '814,815,816,855,856,857,858'], ['XL Axiata', '817,818,819,859,877,878'], ['Tri', '895,896,897,898,899'], ['Smartfren', '881,882,883,884,885,886,887,888,889']]],
    ['KH', '柬埔寨', 'Cambodia', '855', 'KHR', 'asia', 8, 9, 1, '', [['Cellcard'], ['Smart Axiata'], ['Metfone']]],
    ['LA', '老挝', 'Laos', '856', 'LAK', 'asia', 9, 10, 1, '', [['Lao Telecom'], ['Unitel'], ['ETL'], ['TPLUS']]],
    ['MM', '缅甸', 'Myanmar', '95', 'MMK', 'asia', 8, 10, 1, '', [['MPT'], ['ATOM'], ['Ooredoo'], ['Mytel']]],
    ['BN', '文莱', 'Brunei', '673', 'BND', 'asia', 7, 7, 0, '', [['DST'], ['Progresif'], ['imagine']]],
    ['TL', '东帝汶', 'Timor-Leste', '670', 'USD', 'asia', 8, 8, 0, '', [['Timor Telecom'], ['Telkomcel'], ['Telemor']]],
    ['IN', '印度', 'India', '91', 'INR', 'asia', 10, 10, 0, '[6-9]', [['Jio'], ['Airtel'], ['Vi'], ['BSNL']]],
    ['PK', '巴基斯坦', 'Pakistan', '92', 'PKR', 'asia', 10, 10, 1, '3', [['Jazz'], ['Zong'], ['Telenor Pakistan'], ['Ufone']]],
    ['BD', '孟加拉国', 'Bangladesh', '880', 'BDT', 'asia', 10, 10, 1, '1', [['Grameenphone'], ['Robi / Airtel'], ['Banglalink'], ['Teletalk']]],
    ['LK', '斯里兰卡', 'Sri Lanka', '94', 'LKR', 'asia', 9, 9, 1, '7', [['Dialog'], ['SLT-Mobitel'], ['Hutch'], ['Airtel']]],
    ['NP', '尼泊尔', 'Nepal', '977', 'NPR', 'asia', 10, 10, 0, '9', [['Nepal Telecom'], ['Ncell']]],
    ['BT', '不丹', 'Bhutan', '975', 'BTN', 'asia', 8, 8, 0, '', [['B-Mobile'], ['TashiCell']]],
    ['MV', '马尔代夫', 'Maldives', '960', 'MVR', 'asia', 7, 7, 0, '', [['Dhiraagu'], ['Ooredoo']]],
    ['AF', '阿富汗', 'Afghanistan', '93', 'AFN', 'asia', 9, 9, 1, '7', [['Roshan'], ['Afghan Wireless'], ['Etisalat Afghanistan'], ['Salaam']]],
    ['KZ', '哈萨克斯坦', 'Kazakhstan', '7', 'KZT', 'asia', 10, 10, 0, '7', [['Beeline'], ['Kcell / Activ'], ['Tele2 / Altel']]],
    ['UZ', '乌兹别克斯坦', 'Uzbekistan', '998', 'UZS', 'asia', 9, 9, 0, '', [['Ucell'], ['Beeline'], ['Mobiuz'], ['Uzmobile'], ['Humans']]],
    ['KG', '吉尔吉斯斯坦', 'Kyrgyzstan', '996', 'KGS', 'asia', 9, 9, 1, '', [['Beeline'], ['MegaCom'], ['O!']]],
    ['TJ', '塔吉克斯坦', 'Tajikistan', '992', 'TJS', 'asia', 9, 9, 0, '', [['Tcell'], ['MegaFon Tajikistan'], ['Babilon-Mobile'], ['ZET-Mobile']]],
    ['TM', '土库曼斯坦', 'Turkmenistan', '993', 'TMT', 'asia', 8, 8, 1, '', [['TM Cell']]],
    ['AE', '阿联酋', 'United Arab Emirates', '971', 'AED', 'asia', 9, 9, 1, '5', [['e& (Etisalat)', '50,54,56'], ['du', '52,55,58']]],
    ['SA', '沙特阿拉伯', 'Saudi Arabia', '966', 'SAR', 'asia', 9, 9, 1, '5', [['stc'], ['Mobily'], ['Zain']]],
    ['QA', '卡塔尔', 'Qatar', '974', 'QAR', 'asia', 8, 8, 0, '[3567]', [['Ooredoo'], ['Vodafone Qatar']]],
    ['KW', '科威特', 'Kuwait', '965', 'KWD', 'asia', 8, 8, 0, '[569]', [['Zain'], ['Ooredoo'], ['stc Kuwait']]],
    ['BH', '巴林', 'Bahrain', '973', 'BHD', 'asia', 8, 8, 0, '3', [['Batelco'], ['Zain'], ['stc Bahrain']]],
    ['OM', '阿曼', 'Oman', '968', 'OMR', 'asia', 8, 8, 0, '[79]', [['Omantel'], ['Ooredoo'], ['Vodafone Oman']]],
    ['YE', '也门', 'Yemen', '967', 'YER', 'asia', 9, 9, 1, '7', [['Yemen Mobile'], ['Sabafon'], ['YOU']]],
    ['IQ', '伊拉克', 'Iraq', '964', 'IQD', 'asia', 10, 10, 1, '7', [['Zain Iraq'], ['Asiacell'], ['Korek']]],
    ['IR', '伊朗', 'Iran', '98', 'IRR', 'asia', 10, 10, 1, '9', [['MCI (Hamrah-e Aval)'], ['Irancell'], ['Rightel']]],
    ['JO', '约旦', 'Jordan', '962', 'JOD', 'asia', 9, 9, 1, '7', [['Zain'], ['Orange'], ['Umniah']]],
    ['LB', '黎巴嫩', 'Lebanon', '961', 'LBP', 'asia', 7, 8, 1, '', [['Alfa'], ['touch']]],
    ['SY', '叙利亚', 'Syria', '963', 'SYP', 'asia', 9, 9, 1, '9', [['Syriatel'], ['MTN Syria']]],
    ['IL', '以色列', 'Israel', '972', 'ILS', 'asia', 9, 9, 1, '5', [['Cellcom'], ['Partner'], ['Pelephone'], ['HOT Mobile']]],
    ['PS', '巴勒斯坦', 'Palestine', '970', 'ILS', 'asia', 9, 9, 1, '5', [['Jawwal'], ['Ooredoo Palestine']]],
    ['TR', '土耳其', 'Türkiye', '90', 'TRY', 'asia', 10, 10, 1, '5', [['Turkcell'], ['Vodafone'], ['Türk Telekom']]],
    ['GE', '格鲁吉亚', 'Georgia', '995', 'GEL', 'asia', 9, 9, 0, '5', [['Magti'], ['Silknet'], ['Cellfie']]],
    ['AM', '亚美尼亚', 'Armenia', '374', 'AMD', 'asia', 8, 8, 1, '', [['Viva-MTS'], ['Ucom'], ['Team Telecom']]],
    ['AZ', '阿塞拜疆', 'Azerbaijan', '994', 'AZN', 'asia', 9, 9, 1, '[57]', [['Azercell'], ['Bakcell'], ['Nar']]],
    // ===== 欧洲 =====
    ['GB', '英国', 'United Kingdom', '44', 'GBP', 'europe', 10, 10, 1, '7', [['EE'], ['O2'], ['Vodafone'], ['Three'], ['giffgaff']]],
    ['IE', '爱尔兰', 'Ireland', '353', 'EUR', 'europe', 9, 9, 1, '8', [['Vodafone'], ['Three'], ['eir']]],
    ['FR', '法国', 'France', '33', 'EUR', 'europe', 9, 9, 1, '[67]', [['Orange'], ['SFR'], ['Bouygues Telecom'], ['Free Mobile']]],
    ['DE', '德国', 'Germany', '49', 'EUR', 'europe', 10, 11, 1, '1', [['Telekom'], ['Vodafone'], ['O2']]],
    ['IT', '意大利', 'Italy', '39', 'EUR', 'europe', 9, 10, 0, '3', [['TIM'], ['Vodafone'], ['WindTre'], ['Iliad']]],
    ['ES', '西班牙', 'Spain', '34', 'EUR', 'europe', 9, 9, 0, '[67]', [['Movistar'], ['Vodafone'], ['Orange'], ['Yoigo'], ['Digi']]],
    ['PT', '葡萄牙', 'Portugal', '351', 'EUR', 'europe', 9, 9, 0, '9', [['MEO'], ['NOS'], ['Vodafone']]],
    ['NL', '荷兰', 'Netherlands', '31', 'EUR', 'europe', 9, 9, 1, '6', [['KPN'], ['Vodafone'], ['Odido']]],
    ['BE', '比利时', 'Belgium', '32', 'EUR', 'europe', 9, 9, 1, '4', [['Proximus'], ['Orange'], ['Telenet / BASE']]],
    ['LU', '卢森堡', 'Luxembourg', '352', 'EUR', 'europe', 9, 9, 0, '6', [['POST'], ['Orange'], ['Tango']]],
    ['CH', '瑞士', 'Switzerland', '41', 'CHF', 'europe', 9, 9, 1, '7', [['Swisscom'], ['Sunrise'], ['Salt']]],
    ['AT', '奥地利', 'Austria', '43', 'EUR', 'europe', 10, 13, 1, '6', [['A1'], ['Magenta'], ['Drei']]],
    ['DK', '丹麦', 'Denmark', '45', 'DKK', 'europe', 8, 8, 0, '', [['TDC / YouSee'], ['Telenor'], ['Telia'], ['3']]],
    ['SE', '瑞典', 'Sweden', '46', 'SEK', 'europe', 9, 9, 1, '7', [['Telia'], ['Tele2'], ['Telenor'], ['Tre']]],
    ['NO', '挪威', 'Norway', '47', 'NOK', 'europe', 8, 8, 0, '[49]', [['Telenor'], ['Telia'], ['Ice']]],
    ['FI', '芬兰', 'Finland', '358', 'EUR', 'europe', 9, 10, 1, '4', [['Elisa'], ['Telia'], ['DNA']]],
    ['IS', '冰岛', 'Iceland', '354', 'ISK', 'europe', 7, 7, 0, '', [['Síminn'], ['Vodafone'], ['Nova']]],
    ['PL', '波兰', 'Poland', '48', 'PLN', 'europe', 9, 9, 0, '[4-8]', [['Orange'], ['Play'], ['Plus'], ['T-Mobile']]],
    ['CZ', '捷克', 'Czechia', '420', 'CZK', 'europe', 9, 9, 0, '[67]', [['O2'], ['T-Mobile'], ['Vodafone']]],
    ['SK', '斯洛伐克', 'Slovakia', '421', 'EUR', 'europe', 9, 9, 1, '9', [['Orange'], ['Slovak Telekom'], ['O2'], ['4ka']]],
    ['HU', '匈牙利', 'Hungary', '36', 'HUF', 'europe', 9, 9, 0, '[237]', [['Magyar Telekom'], ['Yettel'], ['One']]],
    ['RO', '罗马尼亚', 'Romania', '40', 'RON', 'europe', 9, 9, 1, '7', [['Orange'], ['Vodafone'], ['Digi'], ['Telekom']]],
    ['BG', '保加利亚', 'Bulgaria', '359', 'BGN', 'europe', 9, 9, 1, '[89]', [['A1'], ['Yettel'], ['Vivacom']]],
    ['GR', '希腊', 'Greece', '30', 'EUR', 'europe', 10, 10, 0, '69', [['Cosmote'], ['Vodafone'], ['Nova']]],
    ['CY', '塞浦路斯', 'Cyprus', '357', 'EUR', 'europe', 8, 8, 0, '9', [['Cyta'], ['Epic'], ['Primetel']]],
    ['MT', '马耳他', 'Malta', '356', 'EUR', 'europe', 8, 8, 0, '[79]', [['GO'], ['Epic'], ['Melita']]],
    ['HR', '克罗地亚', 'Croatia', '385', 'EUR', 'europe', 8, 9, 1, '9', [['Hrvatski Telekom'], ['A1'], ['Telemach']]],
    ['SI', '斯洛文尼亚', 'Slovenia', '386', 'EUR', 'europe', 8, 8, 1, '[3-7]', [['Telekom Slovenije'], ['A1'], ['Telemach']]],
    ['RS', '塞尔维亚', 'Serbia', '381', 'RSD', 'europe', 8, 9, 1, '6', [['MTS'], ['Yettel'], ['A1']]],
    ['BA', '波黑', 'Bosnia and Herzegovina', '387', 'BAM', 'europe', 8, 8, 1, '6', [['BH Telecom'], ['m:tel'], ['HT Eronet']]],
    ['ME', '黑山', 'Montenegro', '382', 'EUR', 'europe', 8, 8, 1, '6', [['One'], ['Crnogorski Telekom'], ['m:tel']]],
    ['MK', '北马其顿', 'North Macedonia', '389', 'MKD', 'europe', 8, 8, 1, '7', [['Makedonski Telekom'], ['A1']]],
    ['AL', '阿尔巴尼亚', 'Albania', '355', 'ALL', 'europe', 9, 9, 1, '6', [['Vodafone'], ['One']]],
    ['XK', '科索沃', 'Kosovo', '383', 'EUR', 'europe', 8, 8, 1, '4', [['Vala'], ['IPKO']]],
    ['UA', '乌克兰', 'Ukraine', '380', 'UAH', 'europe', 9, 9, 1, '[5-9]', [['Kyivstar'], ['Vodafone'], ['lifecell']]],
    ['BY', '白俄罗斯', 'Belarus', '375', 'BYN', 'europe', 9, 9, 0, '[234]', [['A1'], ['MTS'], ['life:)']]],
    ['MD', '摩尔多瓦', 'Moldova', '373', 'MDL', 'europe', 8, 8, 1, '[67]', [['Orange'], ['Moldcell'], ['Unité']]],
    ['RU', '俄罗斯', 'Russia', '7', 'RUB', 'europe', 10, 10, 0, '9', [['MTS'], ['Beeline'], ['MegaFon'], ['Tele2']]],
    ['LT', '立陶宛', 'Lithuania', '370', 'EUR', 'europe', 8, 8, 1, '6', [['Telia'], ['Bitė'], ['Tele2']]],
    ['LV', '拉脱维亚', 'Latvia', '371', 'EUR', 'europe', 8, 8, 0, '2', [['LMT'], ['Tele2'], ['Bite']]],
    ['EE', '爱沙尼亚', 'Estonia', '372', 'EUR', 'europe', 7, 8, 0, '5', [['Telia'], ['Elisa'], ['Tele2']]],
    ['AD', '安道尔', 'Andorra', '376', 'EUR', 'europe', 6, 6, 0, '[36]', [['Andorra Telecom']]],
    ['MC', '摩纳哥', 'Monaco', '377', 'EUR', 'europe', 8, 9, 0, '[46]', [['Monaco Telecom']]],
    ['SM', '圣马力诺', 'San Marino', '378', 'EUR', 'europe', 6, 10, 0, '', [['TIM San Marino']]],
    ['LI', '列支敦士登', 'Liechtenstein', '423', 'CHF', 'europe', 7, 7, 0, '7', [['FL1'], ['Swisscom'], ['Salt']]],
    ['GI', '直布罗陀', 'Gibraltar', '350', 'GIP', 'europe', 8, 8, 0, '5', [['Gibtelecom']]],
    ['FO', '法罗群岛', 'Faroe Islands', '298', 'DKK', 'europe', 6, 6, 0, '', [['Føroya Tele'], ['Hey']]],
    ['GL', '格陵兰', 'Greenland', '299', 'DKK', 'namerica', 6, 6, 0, '', [['Tusass']]],
    ['IM', '马恩岛', 'Isle of Man', '44', 'GBP', 'europe', 10, 10, 1, '7', [['Manx Telecom'], ['Sure']]],
    ['JE', '泽西岛', 'Jersey', '44', 'GBP', 'europe', 10, 10, 1, '7', [['JT'], ['Sure'], ['Airtel-Vodafone']]],
    ['GG', '根西岛', 'Guernsey', '44', 'GBP', 'europe', 10, 10, 1, '7', [['Sure'], ['JT'], ['Airtel-Vodafone']]],
    // ===== 非洲 =====
    ['EG', '埃及', 'Egypt', '20', 'EGP', 'africa', 10, 10, 1, '1', [['Vodafone'], ['Orange'], ['e& Egypt'], ['WE']]],
    ['MA', '摩洛哥', 'Morocco', '212', 'MAD', 'africa', 9, 9, 1, '[67]', [['Maroc Telecom'], ['Orange'], ['inwi']]],
    ['DZ', '阿尔及利亚', 'Algeria', '213', 'DZD', 'africa', 9, 9, 1, '[567]', [['Djezzy'], ['Mobilis'], ['Ooredoo']]],
    ['TN', '突尼斯', 'Tunisia', '216', 'TND', 'africa', 8, 8, 0, '[2459]', [['Ooredoo'], ['Tunisie Telecom'], ['Orange']]],
    ['LY', '利比亚', 'Libya', '218', 'LYD', 'africa', 9, 9, 1, '9', [['Libyana'], ['Al Madar']]],
    ['SD', '苏丹', 'Sudan', '249', 'SDG', 'africa', 9, 9, 1, '[19]', [['Zain'], ['MTN'], ['Sudani']]],
    ['SS', '南苏丹', 'South Sudan', '211', 'SSP', 'africa', 9, 9, 1, '9', [['MTN'], ['Zain'], ['Digitel']]],
    ['ET', '埃塞俄比亚', 'Ethiopia', '251', 'ETB', 'africa', 9, 9, 1, '[79]', [['Ethio Telecom'], ['Safaricom Ethiopia']]],
    ['ER', '厄立特里亚', 'Eritrea', '291', 'ERN', 'africa', 7, 7, 1, '', [['EriTel']]],
    ['DJ', '吉布提', 'Djibouti', '253', 'DJF', 'africa', 8, 8, 0, '77', [['Djibouti Telecom']]],
    ['SO', '索马里', 'Somalia', '252', 'SOS', 'africa', 8, 9, 1, '', [['Hormuud'], ['Somtel'], ['Telesom'], ['Golis']]],
    ['KE', '肯尼亚', 'Kenya', '254', 'KES', 'africa', 9, 9, 1, '[17]', [['Safaricom'], ['Airtel'], ['Telkom Kenya']]],
    ['UG', '乌干达', 'Uganda', '256', 'UGX', 'africa', 9, 9, 1, '7', [['MTN'], ['Airtel'], ['Lycamobile']]],
    ['TZ', '坦桑尼亚', 'Tanzania', '255', 'TZS', 'africa', 9, 9, 1, '[67]', [['Vodacom'], ['Airtel'], ['Yas (Tigo)'], ['Halotel']]],
    ['RW', '卢旺达', 'Rwanda', '250', 'RWF', 'africa', 9, 9, 1, '7', [['MTN'], ['Airtel']]],
    ['BI', '布隆迪', 'Burundi', '257', 'BIF', 'africa', 8, 8, 0, '[67]', [['Econet Leo'], ['Lumitel'], ['Onatel']]],
    ['MZ', '莫桑比克', 'Mozambique', '258', 'MZN', 'africa', 9, 9, 0, '8', [['Vodacom'], ['Tmcel'], ['Movitel']]],
    ['MW', '马拉维', 'Malawi', '265', 'MWK', 'africa', 9, 9, 1, '[89]', [['Airtel'], ['TNM']]],
    ['ZM', '赞比亚', 'Zambia', '260', 'ZMW', 'africa', 9, 9, 1, '[79]', [['MTN'], ['Airtel'], ['Zamtel']]],
    ['ZW', '津巴布韦', 'Zimbabwe', '263', 'USD', 'africa', 9, 9, 1, '7', [['Econet'], ['NetOne'], ['Telecel']]],
    ['BW', '博茨瓦纳', 'Botswana', '267', 'BWP', 'africa', 8, 8, 0, '7', [['Mascom'], ['Orange'], ['BTC Mobile']]],
    ['NA', '纳米比亚', 'Namibia', '264', 'NAD', 'africa', 9, 9, 1, '8', [['MTC'], ['TN Mobile']]],
    ['ZA', '南非', 'South Africa', '27', 'ZAR', 'africa', 9, 9, 1, '[678]', [['Vodacom'], ['MTN'], ['Cell C'], ['Telkom']]],
    ['LS', '莱索托', 'Lesotho', '266', 'LSL', 'africa', 8, 8, 0, '[56]', [['Vodacom'], ['Econet']]],
    ['SZ', '斯威士兰', 'Eswatini', '268', 'SZL', 'africa', 8, 8, 0, '7', [['MTN'], ['Eswatini Mobile']]],
    ['AO', '安哥拉', 'Angola', '244', 'AOA', 'africa', 9, 9, 0, '9', [['Unitel'], ['Movicel'], ['Africell']]],
    ['CD', '刚果（金）', 'DR Congo', '243', 'CDF', 'africa', 9, 9, 1, '[89]', [['Vodacom'], ['Airtel'], ['Orange'], ['Africell']]],
    ['CG', '刚果（布）', 'Congo', '242', 'XAF', 'africa', 9, 9, 0, '0', [['MTN'], ['Airtel']]],
    ['GA', '加蓬', 'Gabon', '241', 'XAF', 'africa', 8, 8, 0, '', [['Airtel'], ['Moov Africa']]],
    ['GQ', '赤道几内亚', 'Equatorial Guinea', '240', 'XAF', 'africa', 9, 9, 0, '[235]', [['GETESA'], ['Muni']]],
    ['CM', '喀麦隆', 'Cameroon', '237', 'XAF', 'africa', 9, 9, 0, '6', [['MTN'], ['Orange'], ['Camtel'], ['Nexttel']]],
    ['CF', '中非', 'Central African Republic', '236', 'XAF', 'africa', 8, 8, 0, '7', [['Telecel'], ['Orange'], ['Moov Africa']]],
    ['TD', '乍得', 'Chad', '235', 'XAF', 'africa', 8, 8, 0, '[69]', [['Airtel'], ['Moov Africa']]],
    ['NG', '尼日利亚', 'Nigeria', '234', 'NGN', 'africa', 10, 10, 1, '[789]', [['MTN', '803,806,703,706,813,816,810,814,903,906,913,916'], ['Airtel', '802,808,708,812,701,902,907,901,912'], ['Glo', '805,807,705,815,811,905,915'], ['9mobile', '809,817,818,909,908']]],
    ['GH', '加纳', 'Ghana', '233', 'GHS', 'africa', 9, 9, 1, '[25]', [['MTN'], ['Telecel'], ['AirtelTigo']]],
    ['CI', '科特迪瓦', "Côte d'Ivoire", '225', 'XOF', 'africa', 10, 10, 0, '0', [['Orange'], ['MTN'], ['Moov Africa']]],
    ['SN', '塞内加尔', 'Senegal', '221', 'XOF', 'africa', 9, 9, 0, '7', [['Orange'], ['Free'], ['Expresso']]],
    ['ML', '马里', 'Mali', '223', 'XOF', 'africa', 8, 8, 0, '[5-9]', [['Orange'], ['Moov Africa Malitel'], ['Telecel']]],
    ['BF', '布基纳法索', 'Burkina Faso', '226', 'XOF', 'africa', 8, 8, 0, '[5-7]', [['Orange'], ['Moov Africa'], ['Telecel']]],
    ['NE', '尼日尔', 'Niger', '227', 'XOF', 'africa', 8, 8, 0, '[89]', [['Airtel'], ['Moov Africa'], ['Zamani'], ['Niger Telecom']]],
    ['GN', '几内亚', 'Guinea', '224', 'GNF', 'africa', 9, 9, 0, '6', [['Orange'], ['MTN'], ['Cellcom']]],
    ['GW', '几内亚比绍', 'Guinea-Bissau', '245', 'XOF', 'africa', 9, 9, 0, '9', [['Orange'], ['MTN']]],
    ['SL', '塞拉利昂', 'Sierra Leone', '232', 'SLE', 'africa', 8, 8, 1, '[2-9]', [['Orange'], ['Africell'], ['Qcell']]],
    ['LR', '利比里亚', 'Liberia', '231', 'LRD', 'africa', 8, 9, 1, '[578]', [['Orange'], ['Lonestar Cell MTN']]],
    ['TG', '多哥', 'Togo', '228', 'XOF', 'africa', 8, 8, 0, '[79]', [['Yas (Togocel)'], ['Moov Africa']]],
    ['BJ', '贝宁', 'Benin', '229', 'XOF', 'africa', 8, 10, 0, '', [['MTN'], ['Moov Africa'], ['Celtiis']]],
    ['GM', '冈比亚', 'Gambia', '220', 'GMD', 'africa', 7, 7, 0, '[2-9]', [['Africell'], ['QCell'], ['Gamcel'], ['Comium']]],
    ['MR', '毛里塔尼亚', 'Mauritania', '222', 'MRU', 'africa', 8, 8, 0, '[234]', [['Mattel'], ['Moov Africa Mauritel'], ['Chinguitel']]],
    ['CV', '佛得角', 'Cabo Verde', '238', 'CVE', 'africa', 7, 7, 0, '[59]', [['CVMóvel'], ['Unitel T+']]],
    ['ST', '圣多美和普林西比', 'São Tomé and Príncipe', '239', 'STN', 'africa', 7, 7, 0, '9', [['CST'], ['Unitel']]],
    ['MG', '马达加斯加', 'Madagascar', '261', 'MGA', 'africa', 9, 9, 1, '3', [['Telma'], ['Orange'], ['Airtel']]],
    ['MU', '毛里求斯', 'Mauritius', '230', 'MUR', 'africa', 7, 8, 0, '5', [['my.t'], ['Emtel'], ['Chili']]],
    ['SC', '塞舌尔', 'Seychelles', '248', 'SCR', 'africa', 7, 7, 0, '2', [['Cable & Wireless'], ['Airtel']]],
    ['KM', '科摩罗', 'Comoros', '269', 'KMF', 'africa', 7, 7, 0, '[34]', [['Comores Telecom'], ['Telma']]],
    ['RE', '留尼汪', 'Réunion', '262', 'EUR', 'africa', 9, 9, 1, '[67]', [['Orange'], ['SFR'], ['Free']]],
    ['YT', '马约特', 'Mayotte', '262', 'EUR', 'africa', 9, 9, 1, '6', [['Orange'], ['SFR']]],
    // ===== 北美洲（含中美洲、加勒比） =====
    ['US', '美国', 'United States', '1', 'USD', 'namerica', 10, 10, 0, '[2-9]', [['AT&T'], ['T-Mobile'], ['Verizon'], ['Boost Mobile'], ['Cricket']]],
    ['CA', '加拿大', 'Canada', '1', 'CAD', 'namerica', 10, 10, 0, '[2-9]', [['Rogers'], ['Bell'], ['Telus'], ['Freedom Mobile']]],
    ['MX', '墨西哥', 'Mexico', '52', 'MXN', 'namerica', 10, 10, 0, '[1-9]', [['Telcel'], ['Movistar'], ['AT&T']]],
    ['GT', '危地马拉', 'Guatemala', '502', 'GTQ', 'namerica', 8, 8, 0, '[345]', [['Claro'], ['Tigo']]],
    ['BZ', '伯利兹', 'Belize', '501', 'BZD', 'namerica', 7, 7, 0, '6', [['Digi (BTL)'], ['Smart']]],
    ['SV', '萨尔瓦多', 'El Salvador', '503', 'USD', 'namerica', 8, 8, 0, '[67]', [['Tigo'], ['Claro'], ['Movistar'], ['Digicel']]],
    ['HN', '洪都拉斯', 'Honduras', '504', 'HNL', 'namerica', 8, 8, 0, '[389]', [['Tigo'], ['Claro']]],
    ['NI', '尼加拉瓜', 'Nicaragua', '505', 'NIO', 'namerica', 8, 8, 0, '[578]', [['Claro'], ['Tigo']]],
    ['CR', '哥斯达黎加', 'Costa Rica', '506', 'CRC', 'namerica', 8, 8, 0, '[5678]', [['Kölbi'], ['Claro'], ['Liberty']]],
    ['PA', '巴拿马', 'Panama', '507', 'PAB', 'namerica', 8, 8, 0, '6', [['Tigo'], ['Claro'], ['Digicel']]],
    ['CU', '古巴', 'Cuba', '53', 'CUP', 'namerica', 8, 8, 0, '5', [['Cubacel']]],
    ['DO', '多米尼加', 'Dominican Republic', '1', 'DOP', 'namerica', 10, 10, 0, '8[024]9', [['Claro'], ['Altice'], ['Viva']]],
    ['HT', '海地', 'Haiti', '509', 'HTG', 'namerica', 8, 8, 0, '[34]', [['Digicel'], ['Natcom']]],
    ['JM', '牙买加', 'Jamaica', '1', 'JMD', 'namerica', 10, 10, 0, '(876|658)', [['Digicel'], ['Flow']]],
    ['PR', '波多黎各', 'Puerto Rico', '1', 'USD', 'namerica', 10, 10, 0, '(787|939)', [['Claro'], ['Liberty'], ['T-Mobile']]],
    ['BS', '巴哈马', 'Bahamas', '1', 'BSD', 'namerica', 10, 10, 0, '242', [['BTC'], ['Aliv']]],
    ['BB', '巴巴多斯', 'Barbados', '1', 'BBD', 'namerica', 10, 10, 0, '246', [['Flow'], ['Digicel']]],
    ['TT', '特立尼达和多巴哥', 'Trinidad and Tobago', '1', 'TTD', 'namerica', 10, 10, 0, '868', [['bmobile'], ['Digicel']]],
    ['AG', '安提瓜和巴布达', 'Antigua and Barbuda', '1', 'XCD', 'namerica', 10, 10, 0, '268', [['Flow'], ['Digicel'], ['APUA']]],
    ['DM', '多米尼克', 'Dominica', '1', 'XCD', 'namerica', 10, 10, 0, '767', [['Flow'], ['Digicel']]],
    ['GD', '格林纳达', 'Grenada', '1', 'XCD', 'namerica', 10, 10, 0, '473', [['Flow'], ['Digicel']]],
    ['KN', '圣基茨和尼维斯', 'Saint Kitts and Nevis', '1', 'XCD', 'namerica', 10, 10, 0, '869', [['Flow'], ['Digicel']]],
    ['LC', '圣卢西亚', 'Saint Lucia', '1', 'XCD', 'namerica', 10, 10, 0, '758', [['Flow'], ['Digicel']]],
    ['VC', '圣文森特和格林纳丁斯', 'Saint Vincent and the Grenadines', '1', 'XCD', 'namerica', 10, 10, 0, '784', [['Flow'], ['Digicel']]],
    ['KY', '开曼群岛', 'Cayman Islands', '1', 'KYD', 'namerica', 10, 10, 0, '345', [['Flow'], ['Digicel']]],
    ['BM', '百慕大', 'Bermuda', '1', 'BMD', 'namerica', 10, 10, 0, '441', [['One'], ['Digicel']]],
    ['TC', '特克斯和凯科斯群岛', 'Turks and Caicos Islands', '1', 'USD', 'namerica', 10, 10, 0, '649', [['Flow'], ['Digicel']]],
    ['VG', '英属维尔京群岛', 'British Virgin Islands', '1', 'USD', 'namerica', 10, 10, 0, '284', [['Flow'], ['CCT'], ['Digicel']]],
    ['VI', '美属维尔京群岛', 'U.S. Virgin Islands', '1', 'USD', 'namerica', 10, 10, 0, '340', [['Viya'], ['Liberty']]],
    ['AI', '安圭拉', 'Anguilla', '1', 'XCD', 'namerica', 10, 10, 0, '264', [['Flow'], ['Digicel']]],
    ['MS', '蒙特塞拉特', 'Montserrat', '1', 'XCD', 'namerica', 10, 10, 0, '664', [['Flow']]],
    ['AW', '阿鲁巴', 'Aruba', '297', 'AWG', 'namerica', 7, 7, 0, '[567]', [['Setar'], ['Digicel']]],
    ['CW', '库拉索', 'Curaçao', '599', 'ANG', 'namerica', 7, 7, 0, '[569]', [['Flow'], ['Digicel']]],
    ['SX', '荷属圣马丁', 'Sint Maarten', '1', 'ANG', 'namerica', 10, 10, 0, '721', [['TelCell'], ['UTS']]],
    ['GP', '瓜德罗普', 'Guadeloupe', '590', 'EUR', 'namerica', 9, 9, 1, '69', [['Orange'], ['Digicel'], ['SFR']]],
    ['MQ', '马提尼克', 'Martinique', '596', 'EUR', 'namerica', 9, 9, 1, '69', [['Orange'], ['Digicel'], ['SFR']]],
    // ===== 南美洲 =====
    ['BR', '巴西', 'Brazil', '55', 'BRL', 'samerica', 11, 11, 0, '[1-9][1-9]9', [['Vivo'], ['Claro'], ['TIM']]],
    ['AR', '阿根廷', 'Argentina', '54', 'ARS', 'samerica', 10, 10, 1, '', [['Personal'], ['Movistar'], ['Claro']]],
    ['CL', '智利', 'Chile', '56', 'CLP', 'samerica', 9, 9, 0, '9', [['Entel'], ['Movistar'], ['Claro'], ['WOM']]],
    ['CO', '哥伦比亚', 'Colombia', '57', 'COP', 'samerica', 10, 10, 0, '3', [['Claro'], ['Movistar'], ['Tigo'], ['WOM']]],
    ['PE', '秘鲁', 'Peru', '51', 'PEN', 'samerica', 9, 9, 0, '9', [['Movistar'], ['Claro'], ['Entel'], ['Bitel']]],
    ['VE', '委内瑞拉', 'Venezuela', '58', 'VES', 'samerica', 10, 10, 1, '4', [['Movilnet'], ['Movistar'], ['Digitel']]],
    ['EC', '厄瓜多尔', 'Ecuador', '593', 'USD', 'samerica', 9, 9, 1, '9', [['Claro'], ['Movistar'], ['CNT']]],
    ['BO', '玻利维亚', 'Bolivia', '591', 'BOB', 'samerica', 8, 8, 0, '[67]', [['Entel'], ['Tigo'], ['Viva']]],
    ['PY', '巴拉圭', 'Paraguay', '595', 'PYG', 'samerica', 9, 9, 1, '9', [['Tigo'], ['Personal'], ['Claro']]],
    ['UY', '乌拉圭', 'Uruguay', '598', 'UYU', 'samerica', 8, 8, 1, '9', [['Antel'], ['Movistar'], ['Claro']]],
    ['GY', '圭亚那', 'Guyana', '592', 'GYD', 'samerica', 7, 7, 0, '6', [['GTT'], ['ENet']]],
    ['SR', '苏里南', 'Suriname', '597', 'SRD', 'samerica', 7, 7, 0, '[678]', [['Telesur'], ['Digicel']]],
    ['GF', '法属圭亚那', 'French Guiana', '594', 'EUR', 'samerica', 9, 9, 1, '69', [['Orange'], ['Digicel'], ['SFR']]],
    // ===== 大洋洲 =====
    ['AU', '澳大利亚', 'Australia', '61', 'AUD', 'oceania', 9, 9, 1, '4', [['Telstra'], ['Optus'], ['Vodafone']]],
    ['NZ', '新西兰', 'New Zealand', '64', 'NZD', 'oceania', 8, 10, 1, '2', [['One NZ'], ['Spark'], ['2degrees']]],
    ['PG', '巴布亚新几内亚', 'Papua New Guinea', '675', 'PGK', 'oceania', 8, 8, 0, '7', [['Digicel'], ['bmobile']]],
    ['FJ', '斐济', 'Fiji', '679', 'FJD', 'oceania', 7, 7, 0, '[79]', [['Vodafone'], ['Digicel']]],
    ['SB', '所罗门群岛', 'Solomon Islands', '677', 'SBD', 'oceania', 7, 7, 0, '[78]', [['Our Telekom'], ['bemobile']]],
    ['VU', '瓦努阿图', 'Vanuatu', '678', 'VUV', 'oceania', 7, 7, 0, '[57]', [['Digicel'], ['Vodafone']]],
    ['WS', '萨摩亚', 'Samoa', '685', 'WST', 'oceania', 7, 7, 0, '[78]', [['Digicel'], ['Vodafone']]],
    ['TO', '汤加', 'Tonga', '676', 'TOP', 'oceania', 7, 7, 0, '[78]', [['Digicel'], ['U-Call']]],
    ['KI', '基里巴斯', 'Kiribati', '686', 'AUD', 'oceania', 8, 8, 0, '', [['ATH Kiribati']]],
    ['TV', '图瓦卢', 'Tuvalu', '688', 'AUD', 'oceania', 7, 7, 0, '', [['Tuvalu Telecom']]],
    ['NR', '瑙鲁', 'Nauru', '674', 'AUD', 'oceania', 7, 7, 0, '', [['Digicel']]],
    ['FM', '密克罗尼西亚', 'Micronesia', '691', 'USD', 'oceania', 7, 7, 0, '', [['FSM Telecom']]],
    ['MH', '马绍尔群岛', 'Marshall Islands', '692', 'USD', 'oceania', 7, 7, 0, '', [['NTA']]],
    ['PW', '帕劳', 'Palau', '680', 'USD', 'oceania', 7, 7, 0, '', [['PNCC']]],
    ['NC', '新喀里多尼亚', 'New Caledonia', '687', 'XPF', 'oceania', 6, 6, 0, '[789]', [['Mobilis (OPT)']]],
    ['PF', '法属波利尼西亚', 'French Polynesia', '689', 'XPF', 'oceania', 8, 8, 0, '8', [['Vini'], ['Vodafone']]],
    ['GU', '关岛', 'Guam', '1', 'USD', 'oceania', 10, 10, 0, '671', [['Docomo Pacific'], ['GTA'], ['IT&E']]],
    ['MP', '北马里亚纳群岛', 'Northern Mariana Islands', '1', 'USD', 'oceania', 10, 10, 0, '670', [['Docomo Pacific'], ['IT&E']]],
    ['AS', '美属萨摩亚', 'American Samoa', '1', 'USD', 'oceania', 10, 10, 0, '684', [['Bluesky']]],
    ['CK', '库克群岛', 'Cook Islands', '682', 'NZD', 'oceania', 5, 5, 0, '', [['Vodafone Cook Islands']]]
  ];

  // 品牌色（按名称关键字匹配，未命中则从调色板取色）
  var BRAND = [
    ['vodafone', '#E60000'], ['vodacom', '#E60000'], ['orange', '#FF7900'], ['mtn', '#FFCC00'], ['airtel', '#E40000'], ['telenor', '#0084C9'],
    ['movistar', '#019DF4'], ['claro', '#E3001B'], ['tigo', '#00377B'], ['digicel', '#E40028'], ['ooredoo', '#ED1C24'], ['zain', '#6BC04B'],
    ['etisalat', '#E2001A'], ['e&', '#E2001A'], ['flow', '#5C2D91'], ['telia', '#990AE3'], ['tele2', '#0060A9'], ['t-mobile', '#E20074'],
    ['telekom', '#E20074'], ['magenta', '#E20074'], ['o2', '#0019A5'], ['three', '#1F1F1F'], ['a1', '#E30613'], ['beeline', '#FFCC00'],
    ['megafon', '#00B956'], ['mts', '#E30611'], ['safaricom', '#4CAF50'], ['globe', '#1F4FA3'], ['smart', '#00A651'], ['viettel', '#E0202A'],
    ['jio', '#0F3CC9'], ['stc', '#4F008C'], ['turkcell', '#FFC900'], ['lycamobile', '#0091D4'], ['moov', '#0072BC'], ['africell', '#7B2CBF'],
    ['unitel', '#F58220'], ['econet', '#0072CE'], ['entel', '#0057A8'], ['personal', '#00A9E0'], ['wom', '#5C2D91'], ['bitel', '#0066B3'],
    ['kyivstar', '#00A2E1'], ['lifecell', '#F5B800'], ['play', '#5B2D8E'], ['telstra', '#0D54FF'], ['optus', '#00A79D'], ['spark', '#FF6A00'],
    ['singtel', '#E4002B'], ['starhub', '#6BBE45'], ['telkomsel', '#E30613'], ['indosat', '#F6A800'], ['xl', '#1E4D9B'], ['maxis', '#3FAE49'],
    ['celcom', '#0056A7'], ['ais', '#3FA535'], ['true', '#E2231A'], ['docomo', '#CC0033'], ['softbank', '#8B8B8B'], ['rakuten', '#BF0000'],
    ['sk telecom', '#EA002C'], ['kt', '#E4002B'], ['lg', '#E6007E'], ['at&t', '#009FDB'], ['verizon', '#CD040B'], ['vivo', '#660099'],
    ['tim', '#004691'], ['ee', '#007B85'], ['swisscom', '#0A2B66'], ['proximus', '#5C2D91'], ['kpn', '#00A02A'], ['sfr', '#E2001A'],
    ['bouygues', '#009BDF'], ['free', '#CD1E25'], ['iliad', '#CD1E25'], ['cosmote', '#78BE20'], ['yettel', '#00B5A5'], ['glo', '#3AAA35'],
    ['9mobile', '#006B3F'], ['telcel', '#0B2A8A'], ['rogers', '#DA291C'], ['bell', '#0057B8'], ['telus', '#4B286D'], ['dialog', '#B71234'],
    ['grameenphone', '#0E5EA8'], ['jazz', '#E31E24'], ['zong', '#6DBE45'], ['csl', '#0B5ED7'], ['3', '#F26B1D'], ['中国移动', '#1D7BD8'],
    ['中国联通', '#E0452E'], ['中国电信', '#1E9E8A'], ['中国广电', '#C8102E'], ['中华电信', '#0A6DB2'], ['台湾大哥大', '#E2231A'], ['远传', '#7A2E8E']
  ];
  var PALETTE = ['#0F5C6B', '#1D7BD8', '#7A2E8E', '#C8102E', '#1E9E8A', '#F26B1D', '#3B6E22', '#8A5A00', '#2F4858', '#B03A5B'];
  var RANGE_BRANDS = ['globe', 'smart', 'mtn', 'airtel', 'telkomsel', 'at&t', 't-mobile', 'safaricom', 'vodacom', 'jio', 'digicel', 'claro'];

  function brandColor(name) {
    var n = name.toLowerCase();
    for (var i = 0; i < BRAND.length; i++) {
      var k = BRAND[i][0];
      if (k.length <= 2 ? (n === k || n.indexOf(k + ' ') === 0 || n.indexOf(k + 'hk') === 0) : n.indexOf(k) >= 0) return BRAND[i][1];
    }
    var h = 0; for (var j = 0; j < name.length; j++) h = (h * 31 + name.charCodeAt(j)) >>> 0;
    return PALETTE[h % PALETTE.length];
  }
  function isLight(hex) {
    var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 170;
  }
  function avatarText(name, used) {
    var n = name.replace(/\(.*?\)/g, '').trim();
    var av;
    if (/[一-鿿]/.test(n)) av = n.length >= 4 ? n.slice(-2) : n;
    else {
      var words = n.split(/[\s\/]+/).filter(Boolean);
      if (words[0].length <= 4) av = words[0];
      else if (words.length > 1) av = words.slice(0, 3).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
      else av = words[0].slice(0, 3);
    }
    if (used.indexOf(av) >= 0) av = n.charAt(0).toUpperCase() + n.replace(/[^a-z]/gi, '').slice(-2).toLowerCase();
    used.push(av);
    return av;
  }
  function flagOf(code) {
    return String.fromCodePoint(0x1F1E6 + code.charCodeAt(0) - 65, 0x1F1E6 + code.charCodeAt(1) - 65);
  }
  function nice(x) {
    var p = Math.pow(10, Math.floor(Math.log10(x))), m = x / p;
    var step = m < 1.4 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10;
    return Math.round(step * p * 100) / 100;
  }
  // 面额：强货币用 5/10/20/50/100 阶梯（极强货币如 KWD 再缩小 10 倍），其余按人民币 10–500 元换算后取整数
  function facesFor(cur, perCny) {
    if (cur === 'CNY') return [10, 20, 30, 50, 100, 200, 300, 500];
    if (perCny < 1) {
      var ladders = [[5, 10, 20, 50, 100], [1, 2, 5, 10, 20], [0.5, 1, 2, 5, 10]];
      for (var i = 0; i < ladders.length; i++) {
        var l = ladders[i].filter(function (x) { return x / perCny <= 800; });
        if (l.length >= 4 || i === ladders.length - 1) return l;
      }
    }
    var out = [];
    [10, 20, 50, 100, 200, 500].forEach(function (cny) { var f = nice(cny * perCny); if (out.indexOf(f) < 0) out.push(f); });
    return out;
  }
  var COUNTRIES = RAW.map(function (r) {
    var perCny = Math.round(FX[r[4]] / FX.CNY * 1000) / 1000;
    if (perCny >= 100) perCny = Math.round(perCny);
    var faces = facesFor(r[4], perCny);
    var used = [];
    var ops = r[10].map(function (o, i) {
      var color = brandColor(o[0]);
      var isRange = RANGE_BRANDS.some(function (k) { return o[0].toLowerCase().indexOf(k) >= 0; });
      return {
        id: r[0].toLowerCase() + '-' + i, name: o[0], color: color, light: isLight(color), av: avatarText(o[0], used),
        prefixes: o[1] ? o[1].split(',') : null, eta: i < 2 ? 'instant' : 'minutes',
        faces: faces.slice(), prices: r[4] === 'CNY' ? faces.map(function (f) { return CN_PRICES[f]; }) : null,
        range: isRange && r[4] !== 'CNY' ? [faces[0], faces[faces.length - 1] * 5] : null
      };
    });
    return { code: r[0], name: r[1], en: r[2], dial: r[3], flag: flagOf(r[0]), cur: r[4], region: r[5], perCny: perCny,
      fee: r[4] === 'CNY' ? 0 : 0.03, len: [r[6], r[7]], trunk0: !!r[8], start: r[9] ? new RegExp('^' + r[9]) : null,
      hot: HOT.indexOf(r[0]) >= 0, ops: ops };
  });
