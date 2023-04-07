var timer = null;
const time = 5000;
function aaa(number)
{
	//window.clearTimeout(x)
	const text = [
		"需求1.實體型態包含：「學生」、「課程」", 
		"需求2.學生的屬性包含：學號(主鍵)、名字、年級", 
		"需求3.課程的屬性包含：課程編號(主鍵)、課程名稱、學分數", 
		"需求4.學生可以選修多個課程", 
		"需求5.很多學生可以選修同一課程", 
		"需求6.學生可以不選修課程", 
		"需求7.每個課程至少需要一個學生"
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