const command = {
    name: "judge",
    superior: null,
    function: async () => {

        const { superior: diagramJudge } = command;

        let base = null;
		let b = null;

        app.elementPickerDialog.showDialog('Select a base model to be judged', null, type.UMLModelElement).then(function ({buttonId, returnValue})
		{
			if (buttonId === 'ok') 
			{
				let c = []
				base = returnValue
                console.log(base)
                //console.log(_abstractFromStudentAnswer(base))
                //console.log(typeof(_abstractFromStudentAnswer(base)))
				if(base.ownedElements[0] instanceof type.UMLClassDiagram)
					{c = _abstract_CD_FromStudentAnswer(base)}
				if(base.ownedElements[0] instanceof type.UMLUseCaseDiagram)
					{c = _abstract_UCD_FromStudentAnswer(base)}
				if(base.ownedElements[0] instanceof type.UMLObjectDiagram)
					{c = _abstract_OD_FromStudentAnswer(base)}
				if(base.ownedElements[0] instanceof type.UMLInteraction)
					{c = _abstract_SD_FromStudentAnswer(base)}
				
                console.log(JSON.stringify(c))
				c = JSON.stringify(c)
				console.log(typeof(c))
                    fetch("http://localhost:3000/api/judge?" + `baseModel=${(c)}`, {
                        headers: {
                            'user-agent': 'Mozilla/4.0 MDN Example',
                            'content-type': 'application/json',
                            "Access-Control-Allow-Origin": "*"
                        },
                        method: "post"
                    }).then((res) => {
						console.log(res)
                        return res.json();
                    }).then((data) => {
                        console.log(data);
                        app.dialogs.showInfoDialog(data.answer);
                    }).catch(err => {
                        console.log(err);
                    })
            }
            else
            {
                console.log("User canceled")
            }
        });
    }
}

function _abstract_CD_FromStudentAnswer(baseModel)
{
	//console.log(baseModel)
	//console.log(standardAnswers)
	var studentAnswer = []
	var tmpAnswer = ""
	var tmpClassAnswer = []
	var data1 = [], data2 = [], data3 = [],data4 = []
	//console.log(Object.keys(standardAnswers).length)
	//console.log(Object.keys(standardAnswers.Answers).length)
	
	var Class_count = Object.keys(baseModel.ownedElements).length
	
	//abstract the charactoristic from the base model
	for (i = 1; i < Class_count; i++)
	{
		data1 = baseModel.ownedElements[i]//abstract a class from base model
		tmpClassAnswer.push("\\"+data1.name+"\\")
		tmpAnswer = "\\Class name:  " + data1.name + "\\"
		tmpClassAnswer.push(tmpAnswer)
		tmpAnswer = ""
		
		//abstract elements from class
		if (data1.hasOwnProperty('ownedElements'))
		{
			data2 = data1.ownedElements
			for (j = 0;j < Object.keys(data2).length; j++)
			{
				if (data2[j] instanceof type.UMLGeneralization)
				{
					for (k = 1;k < Class_count; k++)
					{
						var searchedClassID = baseModel.ownedElements[k]._id
						if (data2[j].target._id == searchedClassID)
						{
							tmpAnswer =  "\\Generalization:  " + data1.name + " extends " + baseModel.ownedElements[k].name + "\\"
							//console.log(tmpAnswer)
							tmpClassAnswer.push(tmpAnswer)
							tmpAnswer = ""
						}
					}
				}
			}
		}
		
		//abstract attributes from class
		if (data1.hasOwnProperty('attributes'))
		{
			data3 = data1.attributes
			for (j = 0; j < Object.keys(data3).length; j++)
			{
				if(data3[j].type instanceof type.UMLClass)
				{
					tmpAnswer = "\\Attribute:  " + data3[j].type.name + " " + data3[j].name + "\\"
					//console.log(tmpAnswer)
				}
				else
				{
					tmpAnswer = "\\Attribute:  " + data3[j].type + " " + data3[j].name + "\\"
					//console.log(tmpAnswer)
				}
				/*if(data3[j].hasOwnProperty('visibility'))
				{
					tmpanswer = data3[j].visibility + " " + tmpAnswer
				}
				else tmpanswer = "Public " + tmpAnswer*/
				
				tmpClassAnswer.push(tmpAnswer)
				tmpAnswer = ""
			}
		}
		
		//abstract operations from class
		if (data1.hasOwnProperty('operations'))
		{
			data4 = data1.operations
			for (j = 0; j < Object.keys(data4).length; j++)
			{
				for(k = 0;k < Object.keys(data4[j].parameters).length; k++)
				{
					if(data4[j].parameters[k].direction == 'return')
					{
						if(data4[j].parameters[k].type instanceof type.UMLClass)
						{
							tmpAnswer = data4[j].parameters[k].type.name + " " + data4[j].name + " ( " + tmpAnswer
						}
						else
						{
							tmpAnswer = data4[j].parameters[k].type + " " + data4[j].name + " ( " + tmpAnswer
						}
					}
					else 
					{
						if(data4[j].parameters[k].type instanceof type.UMLClass)
						{
							tmpAnswer += data4[j].parameters[k].type.name + " " + data4[j].parameters[k].name + ", "
						}
						else
						{
							tmpAnswer += data4[j].parameters[k].type + " " + data4[j].parameters[k].name + ", "
						}
					}
				}
				if(tmpAnswer.substring(tmpAnswer.length - 2, tmpAnswer.length) == ", ")
				{
					tmpAnswer = tmpAnswer.substring(0, tmpAnswer.length - 2)
				}
				
				if(tmpAnswer == "" || tmpAnswer.indexOf("(")<0) //for constructor
				{
					tmpAnswer = data4[j].name + " ( " + tmpAnswer
				}
				
				/*if(data4[j].hasOwnProperty('visibility'))
				{
					tmpanswer = data4[j].visibility + " " + tmpAnswer
				}
				else 
				{
					tmpanswer = "Public " + tmpAnswer
				}*/
				
				tmpAnswer += ")"
				//console.log(tmpAnswer)
				tmpClassAnswer.push("\\Operation:  " + tmpAnswer + "\\")
				tmpAnswer = ""
			}
		}
		
		//copy tmpClassAnswer to studentAnswer
		studentAnswer.push(tmpClassAnswer)
        tmpClassAnswer = []
	}
	//console.log(studentAnswer)
	return studentAnswer;
}

function _abstract_UCD_FromStudentAnswer(baseModel)
{
	var studentAnswer = []
	var tmpAnswer = ""
	var tmpClassAnswer = []
	var data1 = [], data2 = [], data3 = [],data4 = []

	var Usercase_count = Object.keys(baseModel.ownedElements).length
	
	//abstract the charactoristic from the base model
	for (i = 1; i < Usercase_count; i++)
	{
		data1 = baseModel.ownedElements[i]//abstract a class from base model
		//tmpClassAnswer.push(data1.type)
		if(data1 instanceof type.UMLUseCaseSubject)
		{
			tmpClassAnswer.push(data1.name)
			tmpAnswer = "UseCaseSubject:  " + data1.name
			tmpClassAnswer.push(tmpAnswer)
			tmpAnswer = ""
		}
		if(data1 instanceof type.UMLActor)
		{
			tmpClassAnswer.push(data1.name)
			tmpAnswer = "Actor name:  " + data1.name
			tmpClassAnswer.push(tmpAnswer)
			tmpAnswer = ""
			if(data1.hasOwnProperty('ownedElements'))
			{
				data2 = data1.ownedElements
				//console.log(data2.type)
				for(let j = 0;j < Object.keys(data2).length;j++)
				{
					if(data1.ownedElements[j] instanceof type.UMLDependency)
					{
						tmpAnswer = "Dependency: Actor " + data1.ownedElements[j].source.name + " depends on " + data1.ownedElements[j].target.name
						tmpClassAnswer.push(tmpAnswer)
						tmpAnswer = ""
					}
					if(data2[j] instanceof type.UMLAssociation)
					{
						tmpAnswer = "Association: Actor " + data2[j].end1.reference.name + " can do operation " + data2[j].end2.reference.name
						tmpClassAnswer.push(tmpAnswer)
						tmpAnswer = ""
					}
					if(data2[j] instanceof type.UMLGeneralization)
					{
						tmpAnswer = "Generalization: Actor " + data2[j].source.name + " extends Actor " + data2[j].target.name
						tmpClassAnswer.push(tmpAnswer)
						tmpAnswer = ""
					}
				}
			}
		}
		if(data1 instanceof type.UMLUseCase)
		{
			tmpClassAnswer.push(data1.name)
			tmpAnswer = "UseCase name:  " + data1.name
			tmpClassAnswer.push(tmpAnswer)
			tmpAnswer = ""
			if(data1.hasOwnProperty('ownedElements'))
			{
				for(let j = 0;j < Object.keys(data1.ownedElements).length;j++)
				{
					if(data1.ownedElements[j] instanceof type.UMLExtend)
					{
						tmpAnswer = "Extend: UseCase " + data1.ownedElements[j].target.name + " extends " + data1.ownedElements[j].source.name
						tmpClassAnswer.push(tmpAnswer)
						tmpAnswer = ""
					}
					if(data1.ownedElements[j] instanceof type.UMLInclude)
					{
						tmpAnswer = "Include: UseCase " + data1.ownedElements[j].target.name + " includes " + data1.ownedElements[j].source.name
						tmpClassAnswer.push(tmpAnswer)
						tmpAnswer = ""
					}
					if(data1.ownedElements[j] instanceof type.UMLDependency)
					{
						tmpAnswer = "Dependency: UseCase " + data1.ownedElements[j].end1.reference.name + " depends on " + data1.ownedElements[j].end2.reference.name
						tmpClassAnswer.push(tmpAnswer)
						tmpAnswer = ""
					}
				}
			}
		}
		
		//copy tmpClassAnswer to studentAnswer
		studentAnswer.push(tmpClassAnswer)
        tmpClassAnswer = []
	}
	//console.log(studentAnswer)
	return studentAnswer;
}

function _abstract_OD_FromStudentAnswer(baseModel)
{
	var studentAnswer = []
	var tmpAnswer = ""
	var tmpClassAnswer = []
	var data1 = [], data2 = [], data3 = [],data4 = []
	
	var Class_count = Object.keys(baseModel.ownedElements).length
	
	//abstract the charactoristic from the base model
	for (i = 1; i < Class_count; i++)
	{
		data1 = baseModel.ownedElements[i]//abstract a class from base model
		tmpClassAnswer.push(data1.name)
		tmpAnswer = "ObjectName:  " + data1.name
		tmpClassAnswer.push(tmpAnswer)
		tmpAnswer = ""
		tmpAnswer = "ObjectClass:  " + data1.classifier
		tmpClassAnswer.push(tmpAnswer)
		tmpAnswer = ""
		
		//abstract links between objects
		if (data1.hasOwnProperty('ownedElements'))
		{
			data2 = data1.ownedElements
			for (j = 0;j < Object.keys(data2).length; j++)
			{
				if (data2[j] instanceof type.UMLLink)
				{
					tmpAnswer = "Indirect link:  " + data2[j].end1.reference.name + "--" + data2[j].end2.reference.name
					tmpClassAnswer.push(tmpAnswer)
					tmpAnswer = ""
				}
			}
		}
		
		//abstract slots from object
		if (data1.hasOwnProperty('slots'))
		{
			data3 = data1.slots
			for (j = 0; j < Object.keys(data3).length; j++)
			{
				tmpAnswer = "Slot:  " + data3[j].name + ": " + data3[j].type + " = " + data3[j].value
				tmpClassAnswer.push(tmpAnswer)
				tmpAnswer = ""
			}
		}
		
		//copy tmpClassAnswer to studentAnswer
		studentAnswer.push(tmpClassAnswer)
        tmpClassAnswer = []
	}
	//console.log(studentAnswer)
	return studentAnswer;
}

function _abstract_SD_FromStudentAnswer(baseModel)
{
	var studentAnswer = []
	var tmpAnswer = ""
	var tmpClassAnswer = []
	var data1 = [], data2 = [], data3 = [],data4 = []
	
	
	//abstract the charactoristic from the base model

	data1 = baseModel.ownedElements[0]//abstract a class from base model
	tmpClassAnswer.push(data1.name)
	tmpAnswer = "Interaction:  " + data1.name
	tmpClassAnswer.push(tmpAnswer)
	tmpAnswer = ""

	let j = Object.keys(data1.messages).length

	for(let i = 0;i < j;i++)
	{
		data2 = data1.messages[i]
		tmpAnswer = "Message " + (i+1) + ":  " + data2.messageSort + "  " + data2.name + "(" + data2.source.name + "->" + data2.target.name + ")"
		tmpClassAnswer.push(tmpAnswer)
		tmpAnswer = ""
	}
		
		
	//copy tmpClassAnswer to studentAnswer
	studentAnswer.push(tmpClassAnswer)
	tmpClassAnswer = []
	//console.log(studentAnswer)
	return studentAnswer;
}

function _abstract_FromDatabase(standardAnswers)
{
	
	//abstract the data from correct answer
	CorrectAnswer = []
	for (i = 0;i < Object.keys(standardAnswers.Answers).length; i++)
	{
		tmpClassofCorrecAnswer.push(standardAnswers.Answers[i].name)
		correctAnswerClass.push(standardAnswers.Answers[i].name)
		for (j = 0;j < Object.keys(standardAnswers.Answers[i].ownedAnswers).length; j++)
		{
			//tmpClassofCorrecAnswer.push(standardAnswers.Answers[i].ownedAnswers[j].name)
			tmpClassofCorrecAnswer.push(Object.values(standardAnswers.Answers[i].ownedAnswers[j]).toString())
			totalAnswers++;
		}
		CorrectAnswer.push(tmpClassofCorrecAnswer)
		tmpClassofCorrecAnswer = []
	}
	return CorrectAnswer;
}

function _judge(CorrectAnswer, studentAnswer, question, upload)
{
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
	
	tmpTimeStamp1 = getCurrentTime();
	console.log(tmpTimeStamp1)
	
	if (studentAnswer.length != CorrectAnswer.length)
	{
		//console.log("Wrong number of classes.")
		judgeResultsInClass_1 = "Wrong number of instances.";
		judgeResultsToBeShown.push(judgeResultsInClass_1)
		judgeResultsToBeSend.push(judgeResultsInClass_1)
		judgeResultsInClass_1 = []
	}
	else
	{
		for (i = 0;i < studentAnswer.length; i++)
		{
			if(correctAnswerClass.includes(studentAnswer[i][0]))
			{
				for (j = 0;j < CorrectAnswer.length; j++)
				{
					if ((studentAnswer[i][0] == CorrectAnswer[j][0]) && (studentAnswer[i].length >= CorrectAnswer[j].length))
					{
						console.log(studentAnswer[i][0] + ": Correct instance name.")
						judgeResultsInClass_2.push(studentAnswer[i][0] + ": Correct instance name." + "\n")
						for (k = 1;k < CorrectAnswer[j].length; k++)
						{
							if (CorrectAnswer[j].includes(studentAnswer[i][k]))
							{
								//console.log("\t" + studentAnswer[i][k] + " is Correct.")
								judgeResultsInClass_2.push("    " + studentAnswer[i][k] + " is Correct." + "\n")
								tmpCorrectedAnswers.push(studentAnswer[i][k])
								//if(CorrectAnswer[j])
								sumOfCorrectAnswers++
							}
							else 
							{
								wrongAnswersInClass.push(studentAnswer[i][k])
							}
						}
						tmpCorrectingAnswers = CorrectAnswer[j].slice(1)
						expectedAnswersInClass = $(tmpCorrectingAnswers).not(tmpCorrectedAnswers).toArray()
					}
					else if((studentAnswer[i][0] == CorrectAnswer[j][0]) && (studentAnswer[i].length != CorrectAnswer[j].length))
					{
						//console.log(studentAnswer[i][0] + ": The number of elements is wrong in this class.")
						judgeResultsInClass_1.push(studentAnswer[i][0] + ": The number of elements is wrong in this instance." + "\n")
						judgeResultsInClass_2.push(studentAnswer[i][0] + ": The number of elements is wrong in this instance." + "\n")
					}
				}
				//console.log(wrongAnswersInClass)
				//console.log(wrongAnswersInClass.length)
				if (wrongAnswersInClass.length != 0)
				{
					//console.log("It's something wrong in the diagram.")
					judgeResultsInClass_1.push("It's something wrong in instance " + studentAnswer[i][0] + ".\n")
					judgeResultsInClass_2.push("It's something wrong in instance " + studentAnswer[i][0] + ".\n")
					//console.log("Student's Answers which is wrong: ")
					judgeResultsInClass_1.push("Student's Unexpected Answers: " + "\n")
					judgeResultsInClass_2.push("Student's Unexpected Answers: " + "\n")
					for (l = 0;l < wrongAnswersInClass.length; l++)
					{
						//console.log("\t" + wrongAnswersInClass[l])
						judgeResultsInClass_1.push("    " + wrongAnswersInClass[l] + "\n")
						judgeResultsInClass_2.push("    " + wrongAnswersInClass[l] + "\n")
					}
					//console.log("Expected Answers: ")
					judgeResultsInClass_1.push("Expected Answers: ")
					judgeResultsInClass_2.push("Expected Answers: ")
					//console.log(expectedAnswersInClass)
					for (l = 0;l < expectedAnswersInClass.length; l++)
					{
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
			else if(correctAnswerClass.includes(studentAnswer[i][0]) == false)
			{
				//console.log(studentAnswer[i][0] + ": Wrong class name or no such class.")
				judgeResultsToBeShown.push(studentAnswer[i][0] + ": Wrong instance name or no such instance." + "\n")
				judgeResultsToBeSend.push(studentAnswer[i][0] + ": Wrong instance name or no such instance." + "\n")
			}
		}
	}
	
	tmpTimeStamp2 = getCurrentTime();
	
	//create a data set for grading
	var doubleTotalAnswers = parseFloat(totalAnswers)
	var doubleSumOfCorrectAnswers = parseFloat(sumOfCorrectAnswers)
	parseFloat(percent)
	percent = (doubleSumOfCorrectAnswers / doubleTotalAnswers) * 100.00;
	percent = percent.toFixed(2);
	
	//if it is All Pass
	if(percent == 100.00) tmpStatus = "All_Pass"
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
	app.dialogs.showInfoDialog(judgeResultsString)
	
	sql = 'SELECT MAX(`id`) FROM `result` AS maxCount_1'
	connection.query(sql,function (err, result) 
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
	sql = "INSERT INTO `result`(`id`, `pid`, `st_id`, `upload_count`, `score`, `total_pass`, `total_data`, `status`, `upload_time`, `judge_time`, `ip`) VALUES ('"+idCount+"','"+question+"','"+studentID+"','"+upload+"','"+percent+"','"+sumOfCorrectAnswers+"','"+totalAnswers+"','"+tmpStatus+"','"+tmpTimeStamp1+"','"+tmpTimeStamp2+"','"+tmpIP+"')";
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
	
	fs.mkdir(filePathToSend, 0666,  (err) => 
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
	}
	
	questionNumber = 0;
	totalAnswers = 0;
	sumOfCorrectAnswers = 0;
	percent = 0.00;
	
	
}

module.exports = command;