// JavaScript Document

const MAXITERATIONS = 150;

function getDatabasePath() {
	var DEBUG = 0;
	
	var dbName = "database01.mdb";
	// var dbName = "database01.accdb";
	
	if (DEBUG != 0) {
		alert("In getDatabasePath: dbName = " + dbName)
	};			
	var rawpath = location.pathname;
	if (DEBUG != 0) {alert("The rawpath is: " + rawpath)};
	// replace URL char encodings like %20 for space
	var decoded = decodeURIComponent(rawpath);
	if (DEBUG != 0) {alert("Decoding of rawpath: " + decoded)};
	// get the name of the current HTML file
	// (slipt up path into a stack and pop the top element)
	var filename = decoded.split("/").pop();
	if (DEBUG != 0) {alert("The filename is: " + filename)};
	// remove the name of the current HTML file
	// and replace it with the database name					
	var rawdbpath = decoded.replace(filename, dbName);
	if (DEBUG != 0) {alert("The rawdbpath is: " + rawdbpath)};
	// Remove first slash
	var path = rawdbpath.replace("/", "");
	if (DEBUG != 0) {
		alert("The DB path without leading slash: " + path)
	};
	// Replace all remaining slashes with double back-slashes
	// (NOTE: the g indicates global replace)
	var path = path.replace(/\//g, "\\\\");				
	if (DEBUG != 0) {alert("The DB path is: " + path)};

	return path;
};

function getConnectionString(dataSource) {
	var DEBUG = 0;
	
	// Connection string for MDB database (Access 2007)
	var connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;";
	// Connection string for ACCDB database (Access 2010)
	// var connectionString = "Provider=Microsoft.ACE.OLEDB.14.0;";
	
	connectionString = connectionString + "Data Source='";
	connectionString = connectionString + dataSource + "'";
	
	if (DEBUG != 0) {
		alert("ADO connection string: " + connectionString)
	};				
	return connectionString;
};

function GetTestIDFromPosition(position) {
	var DEBUG = 0;
	var rec = {};						

	if (DEBUG != 0) { 
		alert("In GetTestIDFromPosition. position = " + position); 
	}

	if (GetGroupRecords.GroupRecords == undefined) {
		alert("GetTestIDFromPosition: ERROR - group records not defined.")
		return;
	}

	var GroupRecords = GetGroupRecords.GroupRecords;

	if (DEBUG != 0) { 
		alert("GetTestIDFromPosition. # of recs in this group = " + 
		GroupRecords.length); 
	}

	for (i = 0; i < GroupRecords.length; i++) {
		rec = GroupRecords[i];
		var pos = parseInt(rec["PositionInTree"]);
		if (DEBUG != 0) { 
			alert("GetTestIDFromPosition: Position of this rec = " + pos); 
		}		
		if (pos == position) {
			if (DEBUG != 0) { 
				alert("GetTestIDFromPosition: Found a matching position!"); 
			}
			// Update the current TestID before returning new Test record
			var TestID = rec["TestID"];
			getParameter.TestID = TestID;
			
			// Return ID of Test record with matching position
			return TestID;
		}
	}
	if (DEBUG != 0) { 
		alert("GetTestIDFromPosition: EOR in this group. Stop iterating."); 
	}
	rec = {"ActiveRecord" : false};		
	return rec;
};

// Returns a single test record for the indicated test ID
function DictationRecord(TestID) {
	var DEBUG = 0;
	var DictationRecords = [];
	var rec = {};

	if (DEBUG != 0) { 
		alert("In DictationRecord: TestID = " + TestID); 
	}
	
	DictationRecords = GetDictationRecords(TestID);
	
	if (DEBUG != 0) { 
		alert("TestRecord: # of recs in this ExerciseGroup = " + nodeTree.length); 
	}	
	for (i = 0; i < nodeTree.length; i++) {
		var rec = nodeTree[i];
		if (rec["ActiveRecord"] == false) {
			alert("TestRecord: record collection is empty.");
			break;
		}
		var currentRecordTestID = rec["TestID"];
		if (DEBUG != 0) { 
			alert("TestRecord: Current Rec TestID = " + currentRecordTestID); 
		}			
		if (TestID == currentRecordTestID) {
			if (DEBUG != 0) { 
				alert("TestRecord: Found matching TestID! - " + currentRecordTestID); 
			}
			TestRecord.CurrentRecord = rec;				
			return rec;
		}
	}

	if (DEBUG != 0) { 
		alert("TestRecord: ERROR. No record found with matching TestID"); 
	}	

	rec = {"ActiveRecord" : false};
	return rec;
};

function TestRecord(TestID) {
	var DEBUG = 0;
	var Records = [];
	var rec = {};	

	if (DEBUG != 0) { 
		alert("In TestRecord."); 
	}
	
	var Records = GetTestRecords();
	
	for (i = 0; i < Records.length; i++) {
		rec = Records[i];
		x = rec["TestID"]
		if (x == TestID) {
			TestRecord.CurrentRecord = rec;
			return rec;
		}
	}
	rec = {"ActiveRecord" : false};
	return rec;	
};

function GetTestRecords() {
	var DEBUG = 0;
	var nodeTree = [];
	var node = {};

	if (DEBUG != 0) { 
		alert("In GetTestRecords."); 
	}
	
	// Do we have test records already?
	if (typeof GetTestRecords.TestRecords != 'undefined') {
		return GetTestRecords.TestRecords;		
	}
	
	try {
		var adoConn = new ActiveXObject("ADODB.Connection");
		var adoRS = new ActiveXObject("ADODB.Recordset");										
		
		var path = getDatabasePath();
		if (DEBUG != 0) {alert("After getDatabasePath: path = " + path)};
		var connectionString = getConnectionString(path);
		adoConn.Open(connectionString);
		
		// Build query string				 
		// var fields = "Tests.*";
		// var table = "Tests";
		var fields = "Tests.* ";
		var table = "Tests";
		var sqlString = "Select " + fields + " From " + table;				
		adoRS.Open(sqlString, adoConn, 1, 3);
		
		if (DEBUG != 0) {
			alert("GetTestRecords: before loop. adoRS.EOF = " + adoRS.EOF);				
		}
		for(i = 0; (i < 1000) && (adoRS.EOF == false); i++) {
			if (DEBUG != 0) {
				alert("GetTestRecords: top of the loop. EOF = " + adoRS.EOF);
			}		

			var TestID = adoRS.Fields("TestID").value;
			var PositionInTree = adoRS.Fields("PositionInTree").value;
			var Source = adoRS.Fields("Source").value;
			var Level = adoRS.Fields("Level").value;
			var ExerciseGroup = adoRS.Fields("ExerciseGroup").value;
			var TestName = adoRS.Fields("TestName").value;
			var BlankTestContent = adoRS.Fields("BlankTestContent").value;
			var Audio = adoRS.Fields("Audio").value;
			var BlankTestWordCount = adoRS.Fields("BlankTestWordCountManualUpdate").value;
			var DictationWordCount = adoRS.Fields("DictationWordCountManualUpdate").value;

			if (DEBUG != 0) {alert("TestID = " + TestID)};
			if (DEBUG != 0) {
				alert("PositionInTree = " + PositionInTree)
			};
			if (DEBUG != 0) {alert("Source = " + Source)};
			if (DEBUG != 0) {alert("Level = " + Level)};
			if (DEBUG != 0) {
				alert("ExerciseGroup = " + ExerciseGroup)
			};
			if (DEBUG != 0) {alert("TestName = " + TestName)};
			if (DEBUG != 0) {
				alert("BlankTestContent = " + BlankTestContent)
			};
			if (DEBUG != 0) {alert("Audio = " + Audio)};
			if (DEBUG != 0) {alert("BlankTestWordCount = " + BlankTestWordCount)};			
			
			node = {"TestID" : TestID,
					"PositionInTree" : PositionInTree,
					"Source" : Source,
					"Level" : Level, 
					"ExerciseGroup" : ExerciseGroup, 
					"TestName" : TestName, 
					"BlankTestContent" : BlankTestContent,
					"Audio" : Audio,
					"BlankTestWordCount" : BlankTestWordCount,
					"DictationWordCount" : DictationWordCount,					
					"ActiveRecord" : true};
					
			nodeTree.push(node);
			adoRS.MoveNext();
		}
		
		if (i == 1000) {
			alert("Exiting infinite loop. (i = 1000)");
		}
		GetTestRecords.TestRecords = nodeTree;
		return nodeTree;
		
	} catch (e) {
		alert("GetTestRecords:  caught exception while accessing Access database.");
		alert(e.message);
	}
};

// Returns a single test record for the indicated test ID
function Group(TestID) {
	var DEBUG = 0;
	var nodeTree = [];
	var rec = {};

	if (DEBUG != 0) { 
		alert("In Group: TestID = " + TestID); 
	}
	
	var ExerciseGroup = getExerciseGroup();
	if (DEBUG != 0) { 
		alert("Group: ExerciseGroup returned = " + ExerciseGroup); 
	}		
	nodeTree = GetGroupRecords(ExerciseGroup);
	
	if (DEBUG != 0) { 
		alert("Group: # of recs in this ExerciseGroup = " + nodeTree.length); 
	}	
	for (i = 0; i < nodeTree.length; i++) {
		var rec = nodeTree[i];
		if (rec["ActiveRecord"] == false) {
			alert("Group: record collection is empty.");
			break;
		}
		var currentRecordTestID = rec["TestID"];
		if (DEBUG != 0) { 
			alert("Group: Current Rec TestID = " + currentRecordTestID); 
		}			
		if (TestID == currentRecordTestID) {
			if (DEBUG != 0) { 
				alert("Group: Found matching TestID! - " + currentRecordTestID); 
			}
			Group.CurrentRecord = rec;				
			return rec;
		}
	}

	if (DEBUG != 0) { 
		alert("Group: ERROR. No record found with matching TestID"); 
	}	

	rec = {"ActiveRecord" : false};
	return rec;
};

function GetGroupRecords(ExerciseGroup) {
	var DEBUG = 0;

	var nodeTree = [];
	var node = {};						

	if (DEBUG != 0) { 
		alert("In GetGroupRecords: ExerciseGroup = " + ExerciseGroup); 
	}
	
	// Do we have records for this group already?
	if (typeof GetGroupRecords.GroupRecords != 'undefined') {
		// Check the very first record to see if
		// it belongs to the group.
		var node = GetGroupRecords.GroupRecords[0];
		if (node["ExerciseGroup"] == ExerciseGroup) {
			// Yes, we already have them. 
			// Just return them to the caller.
			return GetGroupRecords.GroupRecords;
		}
	}
		
	try {
		var adoConn = new ActiveXObject("ADODB.Connection");
		var adoRS = new ActiveXObject("ADODB.Recordset");										
		
		var path = getDatabasePath();
		if (DEBUG != 0) {
			alert("After getDatabasePath: path = " + path)
		};
		var connectionString = getConnectionString(path);
		adoConn.Open(connectionString);
		
		// Build query string				 
		// var fields = "Tests.*";
		// var table = "Tests";
		var fields = "Tests.*";
		var table = "Tests";		
		var sqlString = "SELECT " + fields + 
						" FROM " + table +
						" WHERE (([Tests.ExerciseGroup]='" + ExerciseGroup + "'));";
		
		if (DEBUG != 0) {
			alert("SQL String = " + sqlString);
		}

		adoRS.Open(sqlString, adoConn, 1, 3);
		
		if (DEBUG != 0) {
			alert("GetGroupRecords: EOF = " + adoRS.EOF);				
		}

		for(i = 0; (i < 150) && (adoRS.EOF == false); i++) {
			if (DEBUG != 0) {
				alert("GetGroupRecords: Top of the loop. EOF = " + adoRS.EOF);
			}

			var TestID = adoRS.Fields("TestID").value;
			var PositionInTree = adoRS.Fields("PositionInTree").value;
			var Source = adoRS.Fields("Source").value;
			var Level = adoRS.Fields("Level").value;
			var ExerciseGroup = adoRS.Fields("ExerciseGroup").value;
			var TestName = adoRS.Fields("TestName").value;
			var BlankTestContent = adoRS.Fields("BlankTestContent").value;
			var Audio = adoRS.Fields("Audio").value;
			var BlankTestWordCount = adoRS.Fields("BlankTestWordCountManualUpdate").value;
			var DictationWordCount = adoRS.Fields("DictationWordCountManualUpdate").value;			
			
			// var WordCount = adoRS.Fields("WordCount").value;
											
			if (DEBUG != 0) {
				alert("GetGroupRecords: TestID = " + 
				TestID)
			};
			if (DEBUG != 0) {
				alert("GetGroupRecords: PositionInTree = " + 
				PositionInTree)
			};
			if (DEBUG != 0) {
				alert("GetGroupRecords: Source = " + Source)
			};
			if (DEBUG != 0) {
				alert("GetGroupRecords: Level = " + Level)
			};
			if (DEBUG != 0) {
				alert("GetGroupRecords: ExerciseGroup = " + 
				ExerciseGroup)
			};
			if (DEBUG != 0) {
				alert("GetGroupRecords: TestName = " + 
				TestName)
			};
			if (DEBUG != 0) {
				alert("GetGroupRecords: BlankTestContent = " + 
				BlankTestContent)
			};
			if (DEBUG != 0) {
				alert("GetGroupRecords: Audio = " + Audio)
			};
			if (DEBUG != 0) {
				alert("GetGroupRecords: BlankTestWordCount = " + BlankTestWordCount)
			};			
			if (DEBUG != 0) {
				alert("GetGroupRecords: DictationWordCount = " + DictationWordCount)
			};
			
			node = {"TestID" : TestID,
					"PositionInTree" : PositionInTree,
					"Source" : Source,
					"Level" : Level, 
					"ExerciseGroup" : ExerciseGroup, 
					"TestName" : TestName, 
					"BlankTestContent" : BlankTestContent,
					"Audio" : Audio,
					"BlankTestWordCount" : BlankTestWordCount,
					"DictationWordCount" : DictationWordCount,						
					"ActiveRecord" : true};
			nodeTree.push(node);
			adoRS.MoveNext();
		}
		// If collection successfully constructed, just return				
		if (nodeTree.length != 0) {

			if (DEBUG != 0) {
				alert("GetGroupRecords: rec collection constructed. Return");
			};

			GetGroupRecords.GroupRecords = nodeTree;
			return nodeTree;			
		} else {
			// no records found
			node = {"ActiveRecord" : false};		
		}		
	} catch (e) {
		alert("GetGroupRecords: caught exception while accessing Access database.");
		alert(e.message);
		// an error occurred
		node = {"ActiveRecord" : false};		
	}
	// no records found or an error occurred
	// return a single node indicating the 
	// record is inactive
	
	nodeTree.push(node);	
	return nodeTree;
};

// Check to see if a student is already in the database
function CheckForStudent(UID) {

	var Students = GetStudentRecords();
	for (i = 0; i < Students.length; i++) {
		var student = Students[i];
		if (student["UID"] == UID) {
			return true;
		}
	}
	// Didn't find anything
	return false;	
};

function AddStudent(UID, PWD, FirstName, LastName) {
	var DEBUG = 0;
	
	try {
		var adoConn = new ActiveXObject("ADODB.Connection");
		var adoRS = new ActiveXObject("ADODB.Recordset");	
		var path = getDatabasePath();
		var connectionString = getConnectionString(path);
		adoConn.Open(connectionString);

		var fields = "Students.*";
		var table = "Students";
		var sqlString = "SELECT " + fields + " FROM " + table;
		
		if (DEBUG != 0) {
			alert("SQL String = " + sqlString);
		}

		adoRS.Open(sqlString, adoConn, 1, 3);

		adoRS.AddNew;

		adoRS.Fields("UID").value = UID;
		adoRS.Fields("Password").value = PWD;
		adoRS.Fields("FirstName").value = FirstName;
		adoRS.Fields("LastName").value = LastName;

		adoRS.Update;		
		
	} catch (e) {
		alert("AddStudent: caught exception while accessing Access database.");
		alert(e.message);
	}

	/***
	adoRS.Close();
	adoConn.Close();
	****/
};

function GetStudentRecords() {
	var DEBUG = 0;
	
	var nodeTree = [];
	var node = {};						

	if (DEBUG != 0) { 
		alert("In GetStudentRecords."); 
	}
	
	try {
		var adoConn = new ActiveXObject("ADODB.Connection");
		var adoRS = new ActiveXObject("ADODB.Recordset");										
		
		var path = getDatabasePath();
		if (DEBUG != 0) {alert("After getDatabasePath: path = " + path)};
		var connectionString = getConnectionString(path);
		adoConn.Open(connectionString);
		
		// Build query string				 
		var fields = "Students.*";
		var table = "Students";
		var sqlString = "SELECT " + fields + 
						" FROM " + table;
	 
		if (DEBUG != 0) {
			alert("SQL String = " + sqlString);
		}

		adoRS.Open(sqlString, adoConn, 1, 3);
		
		if (DEBUG != 0) {
			alert("GetStudentRecords: before loop. adoRS.EOF = " + adoRS.EOF);				
		}
		for(i = 0; (i < 1000) && (adoRS.EOF == false); i++) {
			if (DEBUG != 0) {
				alert("Top of the loop. EOF = " + adoRS.EOF);
			}
			var UID = adoRS.Fields("UID").value;
			var FirstName = adoRS.Fields("FirstName").value;
			var LastName = adoRS.Fields("LastName").value;
			var Password = adoRS.Fields("Password").value;
			if (DEBUG != 0) {alert("UID = " + UID)};
			if (DEBUG != 0) {alert("FirstName = " + FirstName)};
			if (DEBUG != 0) {alert("LastName = " + LastName)};
			if (DEBUG != 0) {alert("Password = " + Password)};
			node = {"UID" : UID,
					"FirstName" : FirstName,
					"LastName" : LastName, 
					"Password" : Password};
			nodeTree.push(node);
			adoRS.MoveNext();
		}				
	
		return nodeTree;
		
	} catch (e) {
		alert("GetStudentRecords: caught exception while accessing Access database.");
		alert(e.message);
	}						
};

function GetScoreRecords(UserID) {
	var DEBUG = 0;
	
	var Records = [];
	var rec = {};			

	if (DEBUG != 0) { 
		alert("In GetScoreRecords: UserID = " + UserID); 
	}
	
	// Do we have records for this group already?
	if (typeof GetScoreRecords.ScoreRecords != 'undefined') {
		// Check the very first record to see if
		// it belongs to the group.
		var rec = GetScoreRecords.ScoreRecords[0];
		if (rec["UID"] == UserID) {
			// Yes, we already have them. 
			// Just return them to the caller.
			return GetScoreRecords.ScoreRecords;
		}
	}	
	
	return RefreshScoreRecords(UserID);
};

function RefreshScoreRecords(UserID) {
	var DEBUG = 0;
	
	var Records = [];
	var rec = {};			

	if (DEBUG != 0) { 
		alert("In RefreshScoreRecords: UserID = " + UserID); 
	}

	// Zero out saved records
	GetScoreRecords.ScoreRecord = Records;
		
	try {
		var adoConn = new ActiveXObject("ADODB.Connection");
		var adoRS = new ActiveXObject("ADODB.Recordset");										
		
		var path = getDatabasePath();
		if (DEBUG != 0) {
			alert("RefreshScoreRecords: after getDatabasePath: path = " 
			+ path)
		};
		var connectionString = getConnectionString(path);
		adoConn.Open(connectionString);
		
		// Build query string				 
		var fields = "StudentScores.*";
		var table = "StudentScores";
		var sqlString = "SELECT " + fields + 
						" FROM " + table +
						" WHERE (((StudentScores.UID)='" + 
						UserID + "'));";

		if (DEBUG != 0) {alert("sqlString = " + sqlString)};
		 
		if (DEBUG != 0) {
			alert("SQL String = " + sqlString);
		}

		adoRS.Open(sqlString, adoConn, 1, 3);
		
		if (DEBUG != 0) {
			alert("RefreshScoreRecords: before loop. adoRS.EOF = " + 
			adoRS.EOF);				
		}
		for(i = 0; (i < MAXITERATIONS) && (adoRS.EOF == false); i++) {
			if (DEBUG != 0) {
				alert("Top of the loop. EOF = " + 
				adoRS.EOF);
			}
			var ScoreResultID = adoRS.Fields("ScoreResultID").value;
			var UserID = adoRS.Fields("UID").value;
			var TestID = adoRS.Fields("TestID").value;
			var BlankTestScores = adoRS.Fields("BlankTestScores").value;
			var DictationScores = adoRS.Fields("DictationScores").value;
			if (DEBUG != 0) {
				alert("RefreshScoreRecords: ScoreResultID = " + ScoreResultID)
			};
			if (DEBUG != 0) {
				alert("RefreshScoreRecords: UID = " + UserID)
			};
			if (DEBUG != 0) {
				alert("RefreshScoreRecords: TestID = " + TestID)
			};
			if (DEBUG != 0) {
				alert("RefreshScoreRecords: BlankTestScores = " + BlankTestScores)
			};
			if (DEBUG != 0) {
				alert("RefreshScoreRecords: DictationScores = " + DictationScores)
			};
			rec = {"ScoreResultID" : ScoreResultID,
					"UID" : UserID,
					"TestID" : TestID, 
					"BlankTestScores" : BlankTestScores,
					"DictationScores" : DictationScores};
			Records.push(rec);
			adoRS.MoveNext();
		}				

		RefreshScoreRecords.ScoreRecords = Records;
		return Records;
		
	} catch (e) {
		alert("RefreshScoreRecords: caught exception while accessing Access database.");
		alert(e.message);
	}		
};

function GetDictationRecords(TestID) {
	var DEBUG = 0;
	var Records = [];
	var rec = {};			

	if (DEBUG != 0) { 
		alert("In GetDictationRecords: TestID = " + TestID); 
	}
	
	// Do we have records for this group already?
	if (typeof GetDictationRecords.DictationRecords != 'undefined') {
		// Check the very first record to see if
		// it belongs to the group.
		var rec = GetDictationRecords.DictationRecords[0];
		if (rec["TestID"] == TestID) {
			// Yes, we already have them. 
			// Just return them to the caller.
			return GetDictationRecords.DictationRecords;
		}
	}		
	
	try {
		var adoConn = new ActiveXObject("ADODB.Connection");
		var adoRS = new ActiveXObject("ADODB.Recordset");										
		
		var path = getDatabasePath();
		if (DEBUG != 0) {alert("After getDatabasePath: path = " + path)};
		var connectionString = getConnectionString(path);
		adoConn.Open(connectionString);
		
		// Build query string				 
		var fields = "DictationSentences.*";
		var table = "DictationSentences";
		var sqlString = "SELECT " + fields + 
						" FROM " + table +
						" WHERE (((DictationSentences.TestID)=" + 
						TestID + "));";
		 
		if (DEBUG != 0) {
			alert("SQL String = " + sqlString);
		}

		adoRS.Open(sqlString, adoConn, 1, 3);
		
		if (DEBUG != 0) {
			alert("GetDictationRecords: before loop. adoRS.EOF = " + adoRS.EOF);				
		}
		
		if (adoRS.EOF == true) {
			if (DEBUG != 0) {
				alert("GetDictationRecords: no dictation records found.");
			}
			rec = {"DictationActive" : false};
			Records.push(rec);
			return Records;
		}		
		
		for(i = 0; (i < MAXITERATIONS) && (adoRS.EOF == false); i++) {
			if (DEBUG != 0) {
				alert("Top of the loop. EOF = " + adoRS.EOF);
			}
			var SentenceContent = adoRS.Fields("SentenceContent").value;
			var Audio = adoRS.Fields("Audio").value;
			var TestID = adoRS.Fields("TestID").value;
			if (DEBUG != 0) {alert("SentenceContent = " + SentenceContent)};
			if (DEBUG != 0) {alert("Audio = " + Audio)};
			if (DEBUG != 0) {alert("TestID = " + TestID)};
			rec = {"SentenceContent" : SentenceContent,
					"Audio" : Audio,
					"TestID" : TestID,
					"DictationActive" : true};
			Records.push(rec);
			adoRS.MoveNext();
		}				

		GetDictationRecords.DictationRecords = Records;	
		return Records;
		
	} catch (e) {
		alert("GetDictationRecords: caught exception while accessing Access database.");
		alert(e.message);
	}						
};
		
