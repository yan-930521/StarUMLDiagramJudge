const command = {
    name: "make_question",
    superior: null,
    function: async () => {
        
        const { superior: diagramJudge} = command;

        let base = null;
		let b = null;

        app.elementPickerDialog.showDialog('Select a base model to make question', null, type.UMLModelElement).then(function ({buttonId, returnValue})
		{
			if (buttonId === 'ok') 
			{
				let c = []
				base = returnValue
                console.log(base)
                //console.log(_abstractFromStudentAnswer(base))
                //console.log(typeof(_abstractFromStudentAnswer(base)))
				if(base.ownedElements[0] instanceof type.UMLClassDiagram)
					{c = _make_CD_Question(base)}
				if(base.ownedElements[0] instanceof type.UMLUseCaseDiagram)
					{c = _make_UCD_Question(base)}
				if(base.ownedElements[0] instanceof type.UMLObjectDiagram)
					{c = _make_OD_Question(base)}
				if(base.ownedElements[0] instanceof type.UMLInteraction)
					{c = _make_SD_Question(base)}
				
                //console.log(c)
				c = JSON.stringify(c)
                    fetch("http://120.108.204.99:3000/api/make_question?" + `baseModel=${(c)}&p_num=${(b)}`, {
                        headers: {
                            'user-agent': 'Mozilla/4.0 MDN Example',
                            'content-type': 'application/json',
                            "Access-Control-Allow-Origin": "*"
                        },
                        method: "post"
                    }).then((res) => {
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

function _make_CD_Question(base)
{
	var sql = ''
	var QuestionText = ""
	var tmpQuestionText = ""
	var tmpQuestionTextInClass = ""
	var questionDescription = ""
	var questionCount = 0;
	
	
	//sql = 'SELECT MAX(`question_number`) FROM `uml_judge_questions` AS maxCount'
	//sql = 'SELECT MAX(`question_number`) FROM `uml_judge_questions_2` AS maxCount'

	/*connection.query(sql,function (err, result) 
	{
		if(err)
		{
			console.log('[SELECT ERROR] - ',err.message);
			return;
		}
		console.log(result)
		questionCount = result[0]['MAX(`question_number`)'] + 1
		console.log(questionCount)
	});*/		
		
	var c = _abstract_CD_FromStudentAnswer(base)
    //console.log(c)
	tmpQuestionText += '{"Answers":[';
	for (var i = 0; i < c.length; i++)
	{
		tmpQuestionText += '{"name":"' + c[i][0] + '","ownedAnswers":[';
		for(var j = 1; j < c[i].length; j++)
		{
			if(c[i][j].indexOf("Attribute") >= 0){tmpQuestionTextInClass += '{"Attribute":"' + c[i][j] + '"},';}
			else if(c[i][j].indexOf("Generalization") >= 0){tmpQuestionTextInClass += '{"Generalization":"' + c[i][j] + '"},';}
			else if(c[i][j].indexOf("Class") >= 0){tmpQuestionTextInClass += '{"Class":"' + c[i][j] + '"},';}
			else if(c[i][j].indexOf("Operation") >= 0){tmpQuestionTextInClass += '{"Operation":"' + c[i][j] + '"},';}
			//tmpQuestionTextInClass += '{"name":"' + c[i][j] + '"},';
		}
		tmpQuestionTextInClass = tmpQuestionTextInClass.slice(0,-1);
		tmpQuestionText += tmpQuestionTextInClass + ']},';
		tmpQuestionTextInClass = ''
	}
	tmpQuestionText = tmpQuestionText.slice(0,-1) + ']}';
	console.log(tmpQuestionText)
    return tmpQuestionText
	                /*app.dialogs.showTextDialog("Please input the description of the question. ", "").then(function ({buttonId, returnValue})
					{
						if(buttonId === 'ok')
						{
							questionDescription = returnValue
							
							console.log(questionCount)
							
							//sql = "INSERT INTO `uml_judge_questions_2` (question_number,standard_answers_text,question_description) VALUES (" + questionCount + ", '" + tmpQuestionText + "', '" + questionDescription/* + ', ' + questionFile + "')";
							sql = "INSERT INTO `uml_judge_questions` (question_number,standard_answers_text,question_description) VALUES (" + questionCount + ", '" + tmpQuestionText + "', '" + questionDescription/* + ', ' + questionFile + "')";
							console.log(sql)
							connection.query(sql,function (err, result) 
							{
								if(err)
								{
									console.log('[SELECT ERROR] - ',err.message);
									return;
								}
							});
						}
					})*/
}

function _make_UCD_Question(base)
{
	var sql = ''
	var QuestionText = ""
	var tmpQuestionText = ""
	var tmpQuestionTextInClass = ""
	var questionDescription = ""
	var questionCount = 0;
	
	
	//sql = 'SELECT MAX(`question_number`) FROM `uml_judge_questions` AS maxCount'
	//sql = 'SELECT MAX(`question_number`) FROM `uml_judge_questions_2` AS maxCount'

	/*connection.query(sql,function (err, result) 
	{
		if(err)
		{
			console.log('[SELECT ERROR] - ',err.message);
			return;
		}
		console.log(result)
		questionCount = result[0]['MAX(`question_number`)'] + 1
		console.log(questionCount)
	});*/		
		
	var c = _abstract_UCD_FromStudentAnswer(base)
    //console.log(c)
	tmpQuestionText += '{"Answers":[';
	for (var i = 0; i < c.length; i++)
	{
		tmpQuestionText += '{"name":"' + c[i][0] + '","ownedAnswers":[';
		for(var j = 1; j < c[i].length; j++)
		{
			if(c[i][j].indexOf("Association") >= 0){tmpQuestionTextInClass += '{"Association":"' + c[i][j] + '"},';}
			else if(c[i][j].indexOf("Generalization") >= 0){tmpQuestionTextInClass += '{"Generalization":"' + c[i][j] + '"},';}
			else if(c[i][j].indexOf("Dependency") >= 0){tmpQuestionTextInClass += '{"Dependency":"' + c[i][j] + '"},';}
			else if(c[i][j].indexOf("Include") >= 0){tmpQuestionTextInClass += '{"Include":"' + c[i][j] + '"},';}
            else if(c[i][j].indexOf("Extend") >= 0){tmpQuestionTextInClass += '{"Extend":"' + c[i][j] + '"},';}
			//tmpQuestionTextInClass += '{"name":"' + c[i][j] + '"},';
		}
		tmpQuestionTextInClass = tmpQuestionTextInClass.slice(0,-1);
		tmpQuestionText += tmpQuestionTextInClass + ']},';
		tmpQuestionTextInClass = ''
	}
	tmpQuestionText = tmpQuestionText.slice(0,-1) + ']}';
	console.log(tmpQuestionText)
    return tmpQuestionText
	                /*app.dialogs.showTextDialog("Please input the description of the question. ", "").then(function ({buttonId, returnValue})
					{
						if(buttonId === 'ok')
						{
							questionDescription = returnValue
							
							console.log(questionCount)
							
							//sql = "INSERT INTO `uml_judge_questions_2` (question_number,standard_answers_text,question_description) VALUES (" + questionCount + ", '" + tmpQuestionText + "', '" + questionDescription/* + ', ' + questionFile + "')";
							sql = "INSERT INTO `uml_judge_questions` (question_number,standard_answers_text,question_description) VALUES (" + questionCount + ", '" + tmpQuestionText + "', '" + questionDescription/* + ', ' + questionFile + "')";
							console.log(sql)
							connection.query(sql,function (err, result) 
							{
								if(err)
								{
									console.log('[SELECT ERROR] - ',err.message);
									return;
								}
							});
						}
					})*/
}

function _make_OD_Question(base)
{
	var sql = ''
	var QuestionText = ""
	var tmpQuestionText = ""
	var tmpQuestionTextInClass = ""
	var questionDescription = ""
	var questionCount = 0;
	
	
	//sql = 'SELECT MAX(`question_number`) FROM `uml_judge_questions` AS maxCount'
	//sql = 'SELECT MAX(`question_number`) FROM `uml_judge_questions_2` AS maxCount'

	/*connection.query(sql,function (err, result) 
	{
		if(err)
		{
			console.log('[SELECT ERROR] - ',err.message);
			return;
		}
		console.log(result)
		questionCount = result[0]['MAX(`question_number`)'] + 1
		console.log(questionCount)
	});*/		
		
	var c = _abstract_OD_FromStudentAnswer(base)
    //console.log(c)
	tmpQuestionText += '{"Answers":[';
	for (var i = 0; i < c.length; i++)
	{
		tmpQuestionText += '{"name":"' + c[i][0] + '","ownedAnswers":[';
		for(var j = 1; j < c[i].length; j++)
		{
			if(c[i][j].indexOf("ObjectClass") >= 0){tmpQuestionTextInClass += '{"ObjectClass":"' + c[i][j] + '"},';}
			else if(c[i][j].indexOf("Indirect link") >= 0){tmpQuestionTextInClass += '{"Indirect link":"' + c[i][j] + '"},';}
			else if(c[i][j].indexOf("Slot") >= 0){tmpQuestionTextInClass += '{"Class":"' + c[i][j] + '"},';}
			//tmpQuestionTextInClass += '{"name":"' + c[i][j] + '"},';
		}
		tmpQuestionTextInClass = tmpQuestionTextInClass.slice(0,-1);
		tmpQuestionText += tmpQuestionTextInClass + ']},';
		tmpQuestionTextInClass = ''
	}
	tmpQuestionText = tmpQuestionText.slice(0,-1) + ']}';
	console.log(tmpQuestionText)
    return tmpQuestionText
	                /*app.dialogs.showTextDialog("Please input the description of the question. ", "").then(function ({buttonId, returnValue})
					{
						if(buttonId === 'ok')
						{
							questionDescription = returnValue
							
							console.log(questionCount)
							
							//sql = "INSERT INTO `uml_judge_questions_2` (question_number,standard_answers_text,question_description) VALUES (" + questionCount + ", '" + tmpQuestionText + "', '" + questionDescription/* + ', ' + questionFile + "')";
							sql = "INSERT INTO `uml_judge_questions` (question_number,standard_answers_text,question_description) VALUES (" + questionCount + ", '" + tmpQuestionText + "', '" + questionDescription/* + ', ' + questionFile + "')";
							console.log(sql)
							connection.query(sql,function (err, result) 
							{
								if(err)
								{
									console.log('[SELECT ERROR] - ',err.message);
									return;
								}
							});
						}
					})*/
}

function _make_SD_Question(base)
{
	var sql = ''
	var QuestionText = ""
	var tmpQuestionText = ""
	var tmpQuestionTextInClass = ""
	var questionDescription = ""
	var questionCount = 0;
	
	
	//sql = 'SELECT MAX(`question_number`) FROM `uml_judge_questions` AS maxCount'
	//sql = 'SELECT MAX(`question_number`) FROM `uml_judge_questions_2` AS maxCount'

	/*connection.query(sql,function (err, result) 
	{
		if(err)
		{
			console.log('[SELECT ERROR] - ',err.message);
			return;
		}
		console.log(result)
		questionCount = result[0]['MAX(`question_number`)'] + 1
		console.log(questionCount)
	});*/		
		
	var c = _abstract_SD_FromStudentAnswer(base)
    //console.log(c)
	tmpQuestionText += '{"Answers":[';
	for (var i = 0; i < c.length; i++)
	{
		tmpQuestionText += '{"name":"' + c[i][0] + '","ownedAnswers":[';
		for(var j = 1; j < c[i].length; j++)
		{
			if(c[i][j].indexOf("Interaction") >= 0){tmpQuestionTextInClass += '{"Interaction":"' + c[i][j] + '"},';}
			else if(c[i][j].indexOf("Message") >= 0){tmpQuestionTextInClass += '{"Message":"' + c[i][j] + '"},';}
			//tmpQuestionTextInClass += '{"name":"' + c[i][j] + '"},';
		}
		tmpQuestionTextInClass = tmpQuestionTextInClass.slice(0,-1);
		tmpQuestionText += tmpQuestionTextInClass + ']},';
		tmpQuestionTextInClass = ''
	}
	tmpQuestionText = tmpQuestionText.slice(0,-1) + ']}';
	console.log(tmpQuestionText)
    return tmpQuestionText
	                /*app.dialogs.showTextDialog("Please input the description of the question. ", "").then(function ({buttonId, returnValue})
					{
						if(buttonId === 'ok')
						{
							questionDescription = returnValue
							
							console.log(questionCount)
							
							//sql = "INSERT INTO `uml_judge_questions_2` (question_number,standard_answers_text,question_description) VALUES (" + questionCount + ", '" + tmpQuestionText + "', '" + questionDescription/* + ', ' + questionFile + "')";
							sql = "INSERT INTO `uml_judge_questions` (question_number,standard_answers_text,question_description) VALUES (" + questionCount + ", '" + tmpQuestionText + "', '" + questionDescription/* + ', ' + questionFile + "')";
							console.log(sql)
							connection.query(sql,function (err, result) 
							{
								if(err)
								{
									console.log('[SELECT ERROR] - ',err.message);
									return;
								}
							});
						}
					})*/
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
		tmpClassAnswer.push(data1.name)
		tmpAnswer = "Class name:  " + data1.name
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
							tmpAnswer =  "Generalization:  " + data1.name + " extends " + baseModel.ownedElements[k].name
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
					tmpAnswer = "Attribute:  " + data3[j].type.name + " " + data3[j].name
					//console.log(tmpAnswer)
				}
				else
				{
					tmpAnswer = "Attribute:  " + data3[j].type + " " + data3[j].name
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
				tmpClassAnswer.push("Operation:  " + tmpAnswer)
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
			tmpAnswer = "UseCaseSubject  " + data1.name
			tmpClassAnswer.push(tmpAnswer)
			tmpAnswer = ""
		}
		if(data1 instanceof type.UMLActor)
		{
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

module.exports = command;