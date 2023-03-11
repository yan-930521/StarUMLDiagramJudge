//const jsdom = require('jsdom')
//const dom = new jsdom.JSDOM("")
const $ = require('jquery')
const util = require('util');
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mysql = require('mysql');

let correctAnswerClass = []
let CorrectAnswer = []

var studentID = "5";
var questionNumber = 0;
var totalAnswers = 0;
var sumOfCorrectAnswers = 0;
var percent = 0.00;

const sql_connection = mysql.createConnection({
	user: 'admin',
	password: 'kurumi1024',
	host: '127.0.0.1',
	port: '3306',
	database: 'uml_judge_data',
});

module.exports = class {
	constructor(connection = null) {
		this.connection = connection || sql_connection;
	}

	_startJudging = async (st_id, stdAns, p_num) => {
		let standardAnswer = await this._abstractFromDataBase(p_num)
		console.log("standardAnswer:\n" + standardAnswer)
		let studentAnswer = this._abstractFromAPI(stdAns)
		console.log("studentAnswer:\n" + studentAnswer)
		let uploadCount = await this._getStUploadCount(st_id, p_num)
		let judge_result = this._judge(studentAnswer, standardAnswer, st_id, p_num, uploadCount)
		return judge_result
	}

	_abstractFromAPI = (stdAns) => {
		let studentAnswer_json = null
		let studentAnswer_String = null
		studentAnswer_String = JSON.stringify(stdAns)
		studentAnswer_json = JSON.parse(studentAnswer_String)
		studentAnswer_json = JSON.parse(studentAnswer_json)
		return studentAnswer_json
	}

	_getStUploadCount = async (st_id, p_num) => {
		let sql = "SELECT count(`id`) FROM `result` WHERE `st_id` = '" + st_id + "' AND `pid` = '" + p_num + "'";
		return new Promise((res, rej) => {
		this.connection.query(sql, function (err, result) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message);
				res(1);
			}
			else res(result[0]['count(`id`)'] + 1);
		});
		res(1);
	})
	}

	_abstractFromDataBase = (p_num) => {
		let questionToBeJudged_json = null
		let questionToBeJudged_String = null
		let sql = 'SELECT `standard_answers_text` FROM `uml_judge_questions` WHERE `question_number` = ' + p_num;
		console.log(sql)
		return new Promise((res, rej) => {


			this.connection.query(sql, function (err, result) {
				if (err) {
					console.log('[SELECT ERROR] - ', err.message);
					rej(err.message)
					return;
				}
				else {
					questionToBeJudged_String = JSON.stringify(result[0].standard_answers_text)
					//console.log(questionToBeJudged_String)
					questionToBeJudged_json = JSON.parse(questionToBeJudged_String)
					//console.log(typeof(questionToBeJudged_json))
					questionToBeJudged_json = JSON.parse(questionToBeJudged_json)
				}
				let standardAnswers = questionToBeJudged_json
				let tmpClassofCorrecAnswer = []
				for (let i = 0; i < Object.keys(standardAnswers.Answers).length; i++) {
					tmpClassofCorrecAnswer.push(standardAnswers.Answers[i].name)
					correctAnswerClass.push(standardAnswers.Answers[i].name)
					for (let j = 0; j < Object.keys(standardAnswers.Answers[i].ownedAnswers).length; j++) {
						//tmpClassofCorrecAnswer.push(standardAnswers.Answers[i].ownedAnswers[j].name)
						tmpClassofCorrecAnswer.push(Object.values(standardAnswers.Answers[i].ownedAnswers[j]).toString())
						totalAnswers++;
					}
					CorrectAnswer.push(tmpClassofCorrecAnswer)
					console.log("1:\n" + CorrectAnswer)
					tmpClassofCorrecAnswer = []
				}
				console.log("2:\n" + CorrectAnswer)
				res(CorrectAnswer)
			});
		});
	}

	_judge = (studentAnswer, CorrectAnswer, studentID, question, upload) => {
		var x = 0;
		//var tmpResult = []
		var idCount = 0;
		var tmpStatus = ""
		var sql = ''
		var correctness = 0;
		var tmpCorrectingAnswers = []
		var tmpCorrectedAnswers = []
		var wrongAnswersInClass = []
		var expectedAnswersInClass = []
		var judgeResultsToBeShown = []
		var judgeResultsToBeSend = []
		var judgeResultsFinal = []
		var judgeResultsInClass_1 = []
		var judgeResultsInClass_2 = []
		var tmpTimeStamp1 = ""
		var tmpTimeStamp2 = ""
		var filePathToSend = ""

		tmpTimeStamp1 = this.getCurrentTime();
		console.log(tmpTimeStamp1)

		console.log("a=" + studentAnswer)
		console.log("\nb=" + CorrectAnswer)

		if (studentAnswer.length != CorrectAnswer.length) {
			//console.log("Wrong number of classes.")
			judgeResultsInClass_1 = "Wrong number of instances.";
			judgeResultsToBeShown.push(judgeResultsInClass_1)
			judgeResultsToBeSend.push(judgeResultsInClass_1)
			judgeResultsInClass_1 = []
		}
		else {
			for (i = 0; i < studentAnswer.length; i++) {
				if (correctAnswerClass.includes(studentAnswer[i][0])) {
					for (j = 0; j < CorrectAnswer.length; j++) {
						if ((studentAnswer[i][0] == CorrectAnswer[j][0]) && (studentAnswer[i].length >= CorrectAnswer[j].length)) {
							console.log(studentAnswer[i][0] + ": Correct instance name.")
							judgeResultsInClass_2.push(studentAnswer[i][0] + ": Correct instance name." + "\n")
							for (k = 1; k < CorrectAnswer[j].length; k++) {
								if (CorrectAnswer[j].includes(studentAnswer[i][k])) {
									//console.log("\t" + studentAnswer[i][k] + " is Correct.")
									judgeResultsInClass_2.push("    " + studentAnswer[i][k] + " is Correct." + "\n")
									tmpCorrectedAnswers.push(studentAnswer[i][k])
									//if(CorrectAnswer[j])
									sumOfCorrectAnswers++
								}
								else {
									wrongAnswersInClass.push(studentAnswer[i][k])
								}
							}
							tmpCorrectingAnswers = CorrectAnswer[j].slice(1)
							expectedAnswersInClass = $(tmpCorrectingAnswers).not(tmpCorrectedAnswers).toArray()
						}
						else if ((studentAnswer[i][0] == CorrectAnswer[j][0]) && (studentAnswer[i].length != CorrectAnswer[j].length)) {
							//console.log(studentAnswer[i][0] + ": The number of elements is wrong in this class.")
							judgeResultsInClass_1.push(studentAnswer[i][0] + ": The number of elements is wrong in this instance." + "\n")
							judgeResultsInClass_2.push(studentAnswer[i][0] + ": The number of elements is wrong in this instance." + "\n")
						}
					}
					//console.log(wrongAnswersInClass)
					//console.log(wrongAnswersInClass.length)
					if (wrongAnswersInClass.length != 0) {
						//console.log("It's something wrong in the diagram.")
						judgeResultsInClass_1.push("It's something incorrect in instance " + studentAnswer[i][0] + ".\n")
						judgeResultsInClass_2.push("It's something incorrect in instance " + studentAnswer[i][0] + ".\n")
						//console.log("Student's Answers which is wrong: ")
						judgeResultsInClass_1.push("Student's Unexpected Answers : " + "\n")
						judgeResultsInClass_2.push("Student's Unexpected Answers : " + "\n")
						for (l = 0; l < wrongAnswersInClass.length; l++) {
							//console.log("\t" + wrongAnswersInClass[l])
							judgeResultsInClass_1.push("    " + wrongAnswersInClass[l] + "\n")
							judgeResultsInClass_2.push("    " + wrongAnswersInClass[l] + "\n")
						}
						//console.log("Expected Answers: ")
						judgeResultsInClass_1.push("Expected Answers: ")
						judgeResultsInClass_2.push("Expected Answers: ")
						//console.log(expectedAnswersInClass)
						for (l = 0; l < expectedAnswersInClass.length; l++) {
							//console.log("\t" + expectedAnswersInClass[l])
							judgeResultsInClass_1.push("    " + expectedAnswersInClass[l] + "\n")
							judgeResultsInClass_2.push("    " + expectedAnswersInClass[l] + "\n")
						}
						wrongAnswersInClass = []
					}

					judgeResultsToBeShown.push(judgeResultsInClass_1)
					judgeResultsToBeSend.push(judgeResultsInClass_2)
					judgeResultsInClass_1 = []
					judgeResultsInClass_2 = []
					tmpCorrectedAnswers = []
					expectedAnswersInClass = []
				}
				else if (correctAnswerClass.includes(studentAnswer[i][0]) == false) {
					//console.log(studentAnswer[i][0] + ": Wrong class name or no such class.")
					judgeResultsToBeShown.push(studentAnswer[i][0] + ": Wrong instance name or no such instance." + "\n")
					judgeResultsToBeSend.push(studentAnswer[i][0] + ": Wrong instance name or no such instance." + "\n")
				}
			}
		}

		tmpTimeStamp2 = this.getCurrentTime();

		//create a data set for grading
		var doubleTotalAnswers = parseFloat(totalAnswers)
		var doubleSumOfCorrectAnswers = parseFloat(sumOfCorrectAnswers)
		parseFloat(percent)
		percent = (doubleSumOfCorrectAnswers / doubleTotalAnswers) * 100.00;
		percent = percent.toFixed(2);

		//if it is All Pass
		if (percent == 100.00) tmpStatus = "All_Pass"
		else tmpStatus = "Some_Case_Not_Pass"

		console.log(studentID, questionNumber, totalAnswers, sumOfCorrectAnswers, percent)
		var judgeGrade = "Question number: " + questionNumber + "\nTotal answers: " + totalAnswers + "\nCorrect Answers: " + sumOfCorrectAnswers + "\npercent: " + percent + "\n"
		judgeResultsFinal.push(judgeGrade)
		judgeGrade = []
		judgeResultsFinal.push(judgeResultsToBeShown)
		console.log(judgeResultsToBeShown)
		console.log(judgeResultsToBeSend)
		//show the result to user with an InfoDialog
		var judgeResultsString = judgeResultsFinal.join("")
		//judgeResultsString.replace(',', '\n')
		
		// 伺服端沒app的實體
		// app.dialogs.showInfoDialog(judgeResultsString)

		/*let sql = 'SELECT MAX(`id`) FROM `result` AS maxCount_1'
		this.connection.query(sql,function (err, result) 
		{
			if(err)
			{
			  console.log('[SELECT ERROR] - ',err.message);
			  return;
			}
			idCount = result[0]['MAX(`id`)'] + 1
		});
	
		//insert the result into the database
		//console.log(uploadCount)
		sql = "INSERT INTO `result`(`pid`, `st_id`, `upload_count`, `score`, `total_pass`, `total_data`, `status`, `upload_time`, `judge_time`, `ip`) VALUES ('"+question+"','"+studentID+"','"+upload+"','"+percent+"','"+sumOfCorrectAnswers+"','"+totalAnswers+"','"+tmpStatus+"','"+tmpTimeStamp1+"','"+tmpTimeStamp2+"','"+tmpIP+"')";
		console.log(sql)
		connection.query(sql,function (err, result) 
		{
			if(err)
			{
			  console.log('[SELECT ERROR] - ',err.message);
			  return;
			}
			console.log(result);
		});
	
		//filePathToSend = "D:/xampp5.6/htdocs/ntcu-csko-oop-ntcu-csko-oop-web-22a84ac77bc0/public/st/"+question+"/"+studentID+"/"+upload
	
	/*fs.mkdir(filePathToSend, 0666,  (err) => 
		{
			if(err) {
			throw err;
			}
			console.log("mkdir");
		});

	fs.writeFile(filePathToSend + "/log.txt", "", (err) => 
		{
			if(err) {
			throw err;
			}
			console.log("open file");
		});
		
	for(var i = 0;i < judgeResultsToBeSend.length;i++)
	{
		if(judgeResultsToBeSend.length == 1)
		{
			console.log(judgeResultsToBeSend[i][j])
			fs.appendFile(filePathToSend + "/log.txt", judgeResultsToBeSend[i], (err) => 
			{
				if(err) {
				throw err;
				}
				console.log("Data has been written to file successfully.");
			});
		}
		else
		{
			for(var j = 0;j < judgeResultsToBeSend[i].length;j++)
			{
				console.log(judgeResultsToBeSend[i][j])
				fs.appendFile(filePathToSend + "/log.txt", judgeResultsToBeSend[i][j], (err) => 
				{
					if(err) {
					throw err;
					}
					console.log("Data has been written to file successfully.");
				});
			}
		}
	}*/

		questionNumber = 0;
		totalAnswers = 0;
		sumOfCorrectAnswers = 0;
		percent = 0.00;

	}

	getCurrentTime = () => {
		var today = new Date();
		var hours = (today.getHours() < 10 ? '0' : '') + today.getHours();
		var minutes = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
		var seconds = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();

		var currentDateTime =
			today.getFullYear() + '-' +
			(today.getMonth() + 1) + '-' +
			today.getDate() + ' ' +
			hours + ':' + minutes + ':' + seconds;

		return currentDateTime;
	}
}