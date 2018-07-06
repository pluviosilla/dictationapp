// JavaScript Document

function CheckAnswers() {
	var DEBUG = 0;
	
	var inputs = document.getElementsByTagName('input');
	var totalNumberOfWords = 0;
	var incrementValue = 0;
	var countCorrectWords = 0;
	var countWrongWords = 0;
	var xPercent = 0.0;
	
	if (DEBUG != 0) {
		alert("In CheckAnswers.");
		alert("CheckAnswers: Num of <input> boxes = " + 
				inputs.length);
	}

	// Increment counter countCorrectWords by the following amounts
	// for each correct response:
	//
	// Blank test: 		increment counter by 1 
	// Dictation test:	increment count by number of words in the audio	
	
	for (var i = 0; i < inputs.length; i += 1) {
		var box = inputs[i];
		
		// Ignore hidden input boxes and input boxes in the header
		if (box.id == "gbv" || box.id == "toggle") {
			continue;
		}

		if (DEBUG != 0) {
			alert("CheckAnswers: box[" + i + "] = " + 
					box.value);
		}				

		var correctAnswer = "";
		var studentAnswer = "";
		
		if(Group.PageState == "Dictation") {

			// On dictation tes pages answer is encoded 
			// in unicode hexidecimal. Decode it.
			correctAnswer = decodestring(box.name);
			correctAnswer = simplify(correctAnswer);
				
			// var wordcount = box.wordcnt;
			var wordcount = document.getElementById(box.id).getAttribute("wordcnt");
			incrementValue = parseInt(wordcount);

			if (DEBUG != 0) {
				alert("CheckAnswers: word count = " + 
					incrementValue + ", for correctAnswer =" + 
					correctAnswer);
			}
			
		} else {

			// On blank test pages, for now, the answer
			// is not encoded. It is stored as is, verbatim,
			// in the name attribute. May decide to encode
			// later. We'll see.
			// correctAnswer = simplify(box.name);					
			correctAnswer = decodestring(box.name);
			correctAnswer = simplify(correctAnswer);			

			// For blanks tests each correct answer 
			// contains just one word
			incrementValue = 1;
		}

		studentAnswer = simplify(box.value);

		if (DEBUG != 0) {
			alert("CheckAnswers: box.name = " + box.name);
			alert("CheckAnswers: Correct Answer = " + correctAnswer);
			alert("CheckAnswers: Student Answer = " + studentAnswer);
		}	

		totalNumberOfWords = 	parseInt(totalNumberOfWords) + 
								parseInt(incrementValue);
		
		var stuAnswer = studentAnswer.toUpperCase();
		var corAnswer = correctAnswer.toUpperCase();
		// trim the strings just in case they picked up some leading
		// or trailing spaces during enconding & decoding
		stuAnswer = stuAnswer.trim();
		corAnswer = corAnswer.trim();		

		if (DEBUG != 0) {
			alert("CheckAnswers: student answer (upper case) = " + stuAnswer);
			alert("CheckAnswers: correct answer (upper case) = " + corAnswer);
		}

		if (stuAnswer == corAnswer) {
			countCorrectWords = parseInt(countCorrectWords) + 
								parseInt(incrementValue);
			if (DEBUG != 0) {
				alert("CheckAnswers: found a match.");
			}
			if (DEBUG != 0) {
				alert("CheckAnswers: box.value = " + 
						box.value + ", Name = " + box.name +
						", No. correct = " + parseInt(countCorrectWords));			
			}
			box.style.backgroundColor = "#CCFFE5"; // light green							
		} else {
			if (DEBUG != 0) {
				alert("CheckAnswers: value does NOT match.");
			}
			if (DEBUG != 0) {
				alert("CheckAnswers: box.value = " + 
						box.value + ", Name = " + box.name);
			}
			box.style.backgroundColor = "#F68787"; // light red
		}
	}	

	if (DEBUG != 0) {
		alert("CheckAnswers: number of correct answers = " +
				countCorrectWords);
		// alert("CheckAnswers: number of incorrect answers = " +
		//		countNumberWrong);
	}

	var TestID = getCurrentTestID();

	if (DEBUG != 0) { 
		alert("CheckAnswers: before call to UpdateScore."); 
	}	
	UpdateScore(TestID, countCorrectWords);	
	// UpdateScore(TestID, xPercent);
};

function UpdateScore(TestID, newScore) {
															
	var DEBUG = 0;				

	if (DEBUG != 0) { 
		alert("In UpdateScore: TestID = " + TestID); 
	}
	
	try {
		var adoConn = new ActiveXObject("ADODB.Connection");
		var adoRS = new ActiveXObject("ADODB.Recordset");										
		
		var path = getDatabasePath();
		if (DEBUG != 0) {
			alert("UpdateScore: after getDatabasePath: " +
				   "path = " + path);
		};
		var connectionString = getConnectionString(path);
		adoConn.Open(connectionString);
		
		// Build query string
		var UID = getUID();
		if (DEBUG != 0) {
			alert("UpdateScore: UID = " + UID);
		};			 
		var fields = "StudentScores.*";
		var table = "StudentScores";
		var sqlString = "SELECT " + fields + 
						" FROM " + table +
						" WHERE (" + 
						"([StudentScores.TestID]=" + 
						   TestID + ") AND " +
						"([StudentScores.UID]='" + 
						   UID + "')" +						   
						");";
		
		if (DEBUG != 0) {
			alert("UpdateScore: SQL String = " + sqlString);
		}

		adoRS.Open(sqlString, adoConn, 1, 3);

		if (adoRS.EOF == true) {
			if (DEBUG != 0) {
				alert("UpdateScore: no record found, " +
					  "adding record ..");
			}
			adoRS.AddNew;

			// var ScoreResultID = adoRS.Fields("ScoreResultID").value;
			adoRS.Fields("UID").value = UID;
			adoRS.Fields("TestID").value = TestID;

		} else {
			if (DEBUG != 0) {
				alert("UpdateScore: record found ..");					
			}
			var ScoreResultID = adoRS.Fields("ScoreResultID").value;
			var UID = adoRS.Fields("UID").value;
			var TestID = adoRS.Fields("TestID").value;
			var BlankTestScore = adoRS.Fields("BlankTestScores").value;
			var DictationScore = adoRS.Fields("DictationScores").value;			
								
			if (DEBUG != 0) {
				alert("UpdateScore: ScoreResultID = " + 
				ScoreResultID)
			};
			if (DEBUG != 0) {alert("UpdateScore: UID = " + UID)};
			if (DEBUG != 0) {alert("UpdateScore: TestID = " + TestID)};
			if (DEBUG != 0) {
				alert("UpdateScore: Current BlankTestScore = " + 
				BlankTestScore)
			};
			if (DEBUG != 0) {
				alert("UpdateScore: Current DictationScore = " + 
				DictationScore)
			};
		}

		switch (Group.PageState) {			
			case "Blanks":    
				// We're in the Blanks state. 
				if (DEBUG != 0) {
					alert("UpdateScore: New BlankTestScore = " + 
					newScore)
				};
				adoRS.Fields("BlankTestScores").value = newScore;
				break;
			case "Dictation":
				// We're in the Dictation state. 
				if (DEBUG != 0) {
					alert("UpdateScore: New DictationScore = " + 
					newScore)
				};
				adoRS.Fields("DictationScores").value = newScore;
				break;
			default:
				alert("UpdateScore: Unrecognized Page State: " + 
				TestRecord.PageState);
				return;
		}

		if (DEBUG != 0) {
			alert("UpdateScore: right before call to update method.");
		}		
		adoRS.Update;
		
		adoRS.Close();
		adoConn.Close();								
					
	} catch (e) {
		alert("UpdateScore: caught exception while accessing Access database.");
		alert(e.message);
	}	
};				

function StatsByGroup() {
	var GroupStats = {empty : true, group : "", correct : 0, attempted : 0};
	var StatsArray = [];
	if (StatsByGroup.StatsArray == undefined) {
		StatsArray.push(GroupStats);
		StatsByGroup.StatsArray = StatsArray;
	}
	return StatsByGroup.StatsArray;
}

// *************************************************************************
// AddScoresToGree:
//
// Values needed for this function:
//		Value:							Location:				Constraint:
// 		BlankTestScores					StudentScores			UID & TestID
//		DictationScores					StudentScores			UID & TestID
//		BlankTestWordCountManualUpdate	Tests					TestID
//		NumberOfBlanks					Calculated				(BlankTestWordCount / 5)
// 		DictationWordCountManualUpdate	Tests					TestID
//
// The TestID will be specified by the tree node, but the UID must be fetched
// or passed in as a parameter.
// 
// NOTE on architecture:
//
// Counting the number of words in the blank test requires an SQL trick that uses
// the Replace function. It works fine in Access SQL but when you try to read it
// in Javascript using the Jet Database Engine you get an error, because Jet cannot
// process the Replace function. Therefore, it was necessary to create queries in 
// Access and copy their results manually to the Tests table using the table 
// architecture described below.
//
// Table architecture: TestStats and Test
//
// > BlankTestWordCount is calculated in TestStats and copied manually to 
//   BlankTestWordCountManualUpdate
// > DictationWordCount is calculated in DictationWordCounts which in turn relies on
//   DictationStats and is copied manually to
//   DictationWordCountManualUpdate
//
// Conclusion: thanks to manual preparation, we only need two tables:
// (1) StudentScores, and
// (2) Tests
//
// *************************************************************************

function AddScoresToTree(UID, tree) {
	var DEBUG = 0;
	var flg = 0;
	var GroupStats = {empty : true, group : "", correct : 0, attempted : 0};
	var StatsArray = [];
	var pointsattempted = 0;
	var pointsaccumulated = 0;
	
	if (DEBUG != 0) {
		alert("In AddScoresToTree.");
	}
	
	// ********************
	// FETCH CURRENT SCORES
	// ********************
	if (DEBUG != 0) {
		alert("AddScoresToTree: before call to GetScoreRecords: UID = " + UID);
	}

	// Fetch only those scores belonging to the current user
	scoresTest = GetScoreRecords(UID);

	// **********************
	// ADD NEW SCORES to TREE
	// **********************
	if (DEBUG != 0) {
		alert("AddScoresToTree: before loop listing scores: tree.length = " + 
			   tree.length);
	}
	for (i = 0; i < tree.length; i++) {
		var y = tree[i];
		TestID = y["TestID"];
		TestName = y["TestName"];		
		// ExerciseGroup = y["ExerciseGroup"];
		if (DEBUG != 0) {
			alert("AddScoresToTree: TESTID = " + TestID);
			alert("AddScoresToTree: scoresTest.length = " + scoresTest.length);
		}					
		for (j = 0; j < scoresTest.length; j++) {
			var score = scoresTest[j];
			if (TestID == score["TestID"]) {

				// Found a matching Test ID in the Scores record
				if (DEBUG != 0) {
					alert("AddScoresToTree: Found TESTID " + TestID + " in Student Scores.");
				}

				BlankTestScores = score["BlankTestScores"];
				DictationScores = score["DictationScores"];
				BlankTestScores = (BlankTestScores != undefined)?
									BlankTestScores : 0;
				DictationScores = (DictationScores != undefined)?
									DictationScores : 0;
				
				// Fetch the corresponding test record
				
				var testRecord = TestRecord(TestID);

				var ExerciseGroup = testRecord["ExerciseGroup"];
				if (GroupStats.empty == true) {
					GroupStats.group = ExerciseGroup;
					GroupStats.empty = false;
					if (DEBUG != 0) {
						alert("AddScoresToTree: GroupStats was empty.");
						alert("AddScoresToTree: Set group to: " + ExerciseGroup);
					}					
				} else {
					if (GroupStats.group != ExerciseGroup) {
						
						// Save stats for the previous group and
						// Start monitoring stats for a new group

						if (DEBUG != 0) {
							alert("AddScoresToTree: groups don't match.");
							alert("AddScoresToTree: GroupStats.group = " + 
									GroupStats.group);
							alert("AddScoresToTree: ExerciseGroup = " +
									ExerciseGroup);
						}	

						StatsArray = StatsByGroup();
						StatsArray.push(GroupStats);
						StatsByGroup.StatsArray = StatsArray;

						GroupStats = {empty		: false, 
									  group		: ExerciseGroup, 
									  correct	: 0, 
									  attempted	: 0};		
					}
				}
				
				BlankTestWordCount = testRecord["BlankTestWordCount"];
				DictationWordCount = testRecord["DictationWordCount"];
				if (DEBUG != 0) {
					alert("AddScoresToTree: BlankTestWordCount = " + 
					BlankTestWordCount);
					alert("AddScoresToTree: DictationWordCount = " + 
					DictationWordCount);
				}
				
				BlankTestWordCount = (BlankTestWordCount != undefined)?
										BlankTestWordCount : 0;
				DictationWordCount = (DictationWordCount != undefined)?
										DictationWordCount : 0;
																				
				// Assume a blank every 5 words
				// NOTE: Need something more precise than this, if we
				//       are going to color code complete & incomplete tests
				NumberOfBlanks = Math.floor(BlankTestWordCount / 5);
				
				if (DEBUG != 0) {
					alert("AddScoresToTree: Found matching TESTID = " + TestID);
					alert("AddScoresToTree: TestName = " + TestName);
					alert("AddScoresToTree: BlankTestWordCount = " +
							BlankTestWordCount);
					alert("AddScoresToTree: DictationWordCount = " +
							DictationWordCount);
					alert("AddScoresToTree: NumberOfBlanks = " + NumberOfBlanks);									
				}

				GroupStats.attempted = parseInt(GroupStats.attempted) + 
						parseInt(NumberOfBlanks) + parseInt(DictationWordCount);
				GroupStats.correct = parseInt(GroupStats.correct) + 
						parseInt(BlankTestScores) + parseInt(DictationScores);

				pointsattempted = parseInt(pointsattempted) + 
						parseInt(NumberOfBlanks) + parseInt(DictationWordCount);
				pointsaccumulated = parseInt(pointsaccumulated) + 
						parseInt(BlankTestScores) + parseInt(DictationScores);

				if (DEBUG != 0) {
					alert("AddScoresToTree: pointsattempted = " + 
						pointsattempted);
					alert("AddScoresToTree: pointsaccumulated = " +
						pointsaccumulated);
				}

				var blk = BlankTestScores + "/" + NumberOfBlanks;

				// If the score was perfect, color it blue, otherwise green
				if (BlankTestScores == NumberOfBlanks) {
					blk = "<font color='blue'>" + blk + "</font>"
				} else {
					blk = "<font color='green'>" + blk + "</font>"					
				}

				var dict = DictationScores + "/" + DictationWordCount;

				// If the score was perfect, color it blue, otherwise green
				if (DictationScores == DictationWordCount) {
					dict = "<font color='blue'>" + dict + "</font>"
				} else {
					dict = "<font color='green'>" + dict + "</font>"					
				}

				var ScoreSummary = blk + "<font color='black'> : </font>" + dict;

				// remove **all** punctuation from node ID name
				var nodeID = removepunctuation(TestName);
				nodeID = removewhitespace(nodeID);
				
				if (DEBUG != 0) {
					alert("AddScoresToTree: blk = " + blk);
					alert("AddScoresToTree: dict = " + dict);
					alert("AddScoresToTree: ScoreSummary = " + ScoreSummary);
					alert("AddScoresToTree: TestName = " + TestName);					
					alert("AddScoresToTree: nodeID = " + nodeID);
				}				
								
				$("#tree").jstree("check_node", "#" + nodeID);
				$("#tree").jstree("set_text", "#" + nodeID,
					"<font color='black'>" + TestName + 
					" (<b>Score: </font>" +
					ScoreSummary + "</b><font color='black'>)</font>");				  
				// change node text color
				$("#" + nodeID).css("color","blue");
			}
		}
	}
	StatsArray = StatsByGroup();
	StatsArray.push(GroupStats);
	StatsByGroup.StatsArray = StatsArray;
	
	AggregateScoreReport(pointsattempted, pointsaccumulated);	
};

function AggregateScoreReport(pointsattempted, pointsaccumulated) {
	var DEBUG = 0;
	var StatsArray = [];
	var scores = GetScoreRecords();
	var UID = getUID();
	
	if (DEBUG != 0) {
		alert("In AggregateScoreReport.");
		alert("AggregateScoreReport: pointsattempted = " + pointsattempted);
		alert("AggregateScoreReport: pointsaccumulated = " + pointsaccumulated);				
	}
	// aggregatestats
	var report = "";
	report =	"<p><font color='turquoise'>" +
				"<b>Aggregate Statistics:</b></font></p>" +
				"<p></p>" + 
				"<p style='padding-left:30px;'>" +
				"Number of words correctly guessed: " + 
				pointsaccumulated + "</p>";
	report = 	report + 
				"<p style='padding-left:30px;'>" +
				"Number of words attempted: " + 
				pointsattempted + "</p>";

	var groupstats = "";
	var group = ""
	var attempted = 0;
	var correct = 0;
	StatsArray = StatsByGroup();
	if (DEBUG != 0) {
		alert("AggregateScoreReport: StatsArray.length = " + StatsArray.length);
	}
	for (i = 0; i < StatsArray.length; i++) {
		y = StatsByGroup.StatsArray[i];
		if (y.empty == true) {
			continue;
		}
		group = y["group"];
		if (DEBUG != 0) {
			alert("AggregateScoreReport: Group = " + group);
		}		
		attempted = y["attempted"];
		correct = y["correct"];
		groupstats = 	groupstats + "<p><font color='turquoise'>" +
						"<b>Group: " + group + "</b></font></p>";
		groupstats = 	groupstats + "<p style='padding-left:30px;'>" +
						"Number of words correctly guessed: " + 
						correct + "</p>";
		groupstats = 	groupstats + "<p style='padding-left:30px;'>" +
						"Number of words attempted: " + 
						attempted + "</p>";
		var percent = Math.round(100 * (correct / attempted));
		groupstats = 	groupstats + "<p style='padding-left:30px;'>" +
				"Percentage correct: " + 
				percent + "%</p>";

	}
	report = report + groupstats;
	var aggregatestats = document.getElementById("aggregatestats");
	aggregatestats.innerHTML = report;	
};


