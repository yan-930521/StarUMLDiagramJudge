const command = {
    name: "judge",
    superior: null,
    function: async () => {

        const { superior: diagramJudge } = command;

        let base = null;
		let b = null;

        app.elementPickerDialog.showDialog('Select a base model to be judged', null, type.ExtensibleModel).then(function ({buttonId, returnValue})
		{
			if (buttonId === 'ok') 
			{
				let c = []
				let p = 0
				base = returnValue
                console.log(base)
                //console.log(_abstractFromStudentAnswer(base))
                //console.log(typeof(_abstractFromStudentAnswer(base)))
				if(base.ownedElements[0] instanceof type.UMLClassDiagram)
					{
						c = _abstract_CD_FromStudentAnswer(base)
						p = 1;
					}
				if(base.ownedElements[0] instanceof type.UMLUseCaseDiagram)
					{
						c = _abstract_UCD_FromStudentAnswer(base)
						p = 2;
					}
				if(base.ownedElements[0] instanceof type.UMLObjectDiagram)
					{
						c = _abstract_OD_FromStudentAnswer(base)
						p = 3;
					}
				if(base.ownedElements[0] instanceof type.UMLInteraction)
					{
						c = _abstract_SD_FromStudentAnswer(base)
						p = 4
					}
				if(base.ownedElements[0] instanceof type.ERDDiagram)
					{
						c = _abstract_ERD_FromStudentAnswer(base)
						p = 5
					}
				
                console.log(c)
				c = JSON.stringify(c)
				//c = c.replaceAll("\"", "\'");
				console.log(c)
                    //fetch("http://localhost:3000/api/judge?" + `st_id=1&baseModel=${(c)}&p_num=${(p)}`, 
					fetch(diagramJudge.getApi("judge") + `?st_id=1&baseModel=${(c)}&p_num=${(p)}`, 
					{
                        headers: {
                            'user-agent': 'Mozilla/4.0 MDN Example',
                            'content-type': 'application/json',
                            "Access-Control-Allow-Origin": "*"
                        },
                        method: "get"
                    }).then((res) => {
                        return res.json();
                    }).then((data) => {
                        console.log(data);
                        app.dialogs.showInfoDialog(data.answer.toString());
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

		tmpClassAnswer.push(data1.name)
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
				if(data3[j].value != "")
				{
					tmpAnswer = "Slot:  " + data3[j].name + ": " + data3[j].type + " = " + data3[j].value
					tmpClassAnswer.push(tmpAnswer)
					tmpAnswer = ""
				}
				else
				{
					tmpAnswer = "Slot:  " + data3[j].name + ": = " + data3[j].type
					tmpClassAnswer.push(tmpAnswer)
					tmpAnswer = ""
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

function _abstract_ERD_FromStudentAnswer(baseModel)
{
	var studentAnswer = []
	var tmpAnswer = ""
	var tmpClassAnswer = []
	var data1 = [], data2 = [], data3 = [],data4 = []

	var Entity_count = Object.keys(baseModel.ownedElements).length
	
	//abstract the charactoristic from the base model
	for (i = 1; i < Entity_count; i++)
	{
		data1 = baseModel.ownedElements[i]//abstract a class from base model
		//tmpClassAnswer.push(data1.type)

		tmpClassAnswer.push(data1.name)
		
		if(data1 instanceof type.ERDEntity)
		{
			tmpAnswer = "Entity name:  " + data1.name
			tmpClassAnswer.push(tmpAnswer)
			tmpAnswer = ""
			if(data1.hasOwnProperty('columns'))
			{
				data2 = data1.columns
				//console.log(data2.type)
				for(let j = 0;j < Object.keys(data2).length;j++)
				{
					if(data2[j] instanceof type.ERDColumn)
					{
						tmpAnswer = "Column: "
						if(data2[j].foreignKey == true) tmpAnswer += "FK,"
						if(data2[j].primaryKey == true) tmpAnswer += "PK,"
						if(data2[j].nullable == true) tmpAnswer += "N,"
						if(data2[j].unique == true) tmpAnswer += "U,"
						tmpAnswer += " | " + data2[j].name + " | " + data2[j].type + "(" + data2[j].length + ")"
						tmpClassAnswer.push(tmpAnswer)
						tmpAnswer = ""
					}
				}
			}
			if(data1.hasOwnProperty('ownedElements'))
			{
				data3 = data1.ownedElements
				for(let j = 0;j < Object.keys(data3).length;j++)
				{
					if(data3[j] instanceof type.ERDRelationship)
					{
						tmpAnswer = "Relationship: " + data3[j].end1.reference.name + "(" + data3[j].end1.cardinality + ") <--> " + data3[j].end2.reference.name + "(" + data3[j].end2.cardinality + ")"
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

module.exports = command;