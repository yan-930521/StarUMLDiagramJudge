var timer = null;
const time = 5000;
function aaa(number)
{
	//window.clearTimeout(x)
	const text = [
		"需求1.實體型態包含：「客戶」、「汽車」、「意外事故」、「家屬」", 
		"需求2.「客戶」屬性包括每個客戶的駕照號碼、姓名、出生日期、地址、電話,其中出生日期要分別記載年、月、日。", 
		"需求3.「汽車」屬性資料包括受保的汽車「牌照號碼」、製造車廠、出廠年份、每位客戶何時開始擁有受保的車子(開始日期)。", 
		"需求4.每次「意外事故」要記載下來的內容,屬性包括事故編號、事故地點、日期、事故汽車、事故駕駛、賠償金額。", 
		"需求5.因為事故有可能導致客戶喪生,賠償金此時要發給客戶的「家屬」。因此客戶的家屬資料也要記載下來,屬性包括家屬姓名、身份證號碼、年齡。", 
		"需求6.以上這些資料中,客戶的駕照號碼、汽車牌照號碼、事故編號、(客戶家屬的)身分證號碼, 這些都是唯一的編號,也就是不會有二個相同的號碼。", 
		"需求7.每位客戶的電話號碼可能不只一個。",
		"需求8.受保客戶必須要有車子,否則不能購買保險。一位客戶可以擁有多輛受保的車子,但每輛車子只能隸屬於一位客戶。",
		"需求9.每個意外事故只能將責任歸屬於一個客戶，一個客戶可能會有多個意外事故。",
		"需求10.每個客戶可能會有家屬，也可能會沒有家屬",
		"需求11.每個意外事故只能將責任歸屬於一輛汽車，一輛汽車可能會有多個意外事故。"
	];
	const iframeWindow = document.getElementsByTagName('iframe')[0].contentWindow
	iframeWindow.document.body.innerHTML = text[number]
	startTimer()
}

var startTimer = function() {
	window.clearTimeout(timer);
  	timer = window.setTimeout("turndown()", time);
}

function turndown()
{
	const iframeWindow = document.getElementsByTagName('iframe')[0].contentWindow
	console.log(iframeWindow)
	iframeWindow.document.body.innerHTML = ''
}