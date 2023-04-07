var timer = null;
const time = 5000;
function aaa(number)
{
	//window.clearTimeout(x)
	const text = [
		"需求1.實體型態包含：醫師（Doctor）、住院病人（InPatient）、檢驗項目（TestItem）、病房（Room）。 ", 
		"需求2.醫師有三個屬性：代號（dId）、姓名（dName）、性別 （gender）。其中代號是唯一的。 ", 
		"需求3.住院病人有三個屬性：病人代號（pId）、姓名（pName）、緊急聯 絡人（contact），其中緊急聯絡人可以有多位，且必須記載緊急聯絡人之姓名（name）與電話（phone）。此外病人代號是唯一的。", 
		"需求4.檢驗項目有兩個屬性：項目代號（tId）、名稱（tName）。其中項 目代號是唯一的。", 
		"需求5.病房有兩個屬性：房號（rNo）、等級（level）。其中房號是唯一的。", 
		"需求6.每一位住院病人必定有一位主治醫師；每個醫生可以看很多住院病人，至少需要看一個住院病人。", 
		"需求7.每一位住院病人可以有多個檢驗項目，檢驗日期 （date）必須記載；每個住院病人至少要有一個檢驗項目。",
		"需求8.每一個病房可以最多住六個住院病人，也可能是空病房；每個住院病人只能住在一間病房。",
		"需求9.每一個醫生可以檢視多個檢驗項目；每個檢驗項目可以被多個醫生檢驗。"
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