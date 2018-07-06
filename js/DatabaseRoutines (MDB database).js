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
	
	var connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;";
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
			// Return ID of Test record with matching position
			return rec["TestID"];
		}
	}
	if (DEBUG != 0) { 
		alert("GetTestIDFromPosition: EOR in this group. Stop iterating."); 
	}
	rec = {"ActiveRecord" : false};		
	return rec;
};

// Returns a single test record for the indicated test ID
function TestRecord(TestID) {
	var DEBUG = 0;
	var nodeTree = [];
	var rec = {};

	if (DEBUG != 0) { 
		alert("In TestRecord: TestID = " + TestID); 
	}
	
	var ExerciseGroup = getExerciseGroup();
	if (DEBUG != 0) { 
		alert("TestRecord: ExerciseGroup returned = " + ExerciseGroup); 
	}		
	nodeTree = GetGroupRecords(ExerciseGroup);
	
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

function GetTestRecords() {
	var DEBUG = 0;
	var nodeTree = [];
	var node = {};

	// Do we have test records already?
	if (typeof GetTestRecords.TestRecords != 'undefined') {
		return GetTestRecords.TestRecords;		
	}
	
	try {
		var adoConn = new ActiveXObject("ADODB.Connection");
		var adoRS = new ActiveXObject("ADODB.Recordset");										
		
		// var path = getDatabasePath("database01.mdb");
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
			var TextContent = adoRS.Fields("TextContent").value;
			var Audio = adoRS.Fields("Audio").value;
			// var WordCount = adoRS.Fields("WordCount").value;
			
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
				alert("TextContent = " + TextContent)
			};
			if (DEBUG != 0) {alert("Audio = " + Audio)};
			// if (DEBUG != 0) {alert("WordCount = " + WordCount)};			
			
			node = {"TestID" : TestID,
					"PositionInTree" : PositionInTree,
					"Source" : Source,
					"Level" : Level, 
					"ExerciseGroup" : ExerciseGroup, 
					"TestName" : TestName, 
					"TextContent" : TextContent,
					"Audio" : Audio,
					// "WordCount" : WordCount,
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
				alert("Top of the loop. EOF = " + adoRS.EOF);
			}

			var TestID = adoRS.Fields("TestID").value;
			var PositionInTree = adoRS.Fields("PositionInTree").value;
			var Source = adoRS.Fields("Source").value;
			var Level = adoRS.Fields("Level").value;
			var ExerciseGroup = adoRS.Fields("ExerciseGroup").value;
			var TestName = adoRS.Fields("TestName").value;
			var TextContent = adoRS.Fields("TextContent").value;
			var Audio = adoRS.Fields("Audio").value;
			// var WordCount = adoRS.Fields("WordCount").value;
											
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
				alert("TextContent = " + TextContent)
			};
			if (DEBUG != 0) {alert("Audio = " + Audio)};
			// if (DEBUG != 0) {alert("WordCount = " + WordCount)};			
			
			node = {"TestID" : TestID,
					"PositionInTree" : PositionInTree,
					"Source" : Source,
					"Level" : Level, 
					"ExerciseGroup" : ExerciseGroup, 
					"TestName" : TestName, 
					"TextContent" : TextContent,
					"Audio" : Audio,
					// "WordCount" : WordCount,
					"ActiveRecord" : true};
			nodeTree.push(node);
			adoRS.MoveNext();
		}
		// If collection successfully constructed, just return				
		if (nodeTree.length != 0) {

			if (DEBUG != 0) {
				alert("GetGroupRecords: successful construction of rec collection. Return");
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
	
	try {
		var adoConn = new ActiveXObject("ADODB.Connection");
		var adoRS = new ActiveXObject("ADODB.Recordset");										
		
		var path = getDatabasePath();
		if (DEBUG != 0) {
			alert("GetScoreRecords: after getDatabasePath: path = " 
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
			alert("GetScoreRecords: before loop. adoRS.EOF = " + 
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
				alert("GetScoreRecords: ScoreResultID = " + ScoreResultID)
			};
			if (DEBUG != 0) {
				alert("GetScoreRecords: UID = " + UserID)
			};
			if (DEBUG != 0) {
				alert("GetScoreRecords: TestID = " + TestID)
			};
			if (DEBUG != 0) {
				alert("GetScoreRecords: BlankTestScores = " + BlankTestScores)
			};
			if (DEBUG != 0) {
				alert("GetScoreRecords: DictationScores = " + DictationScores)
			};
			rec = {"ScoreResultID" : ScoreResultID,
					"UID" : UserID,
					"TestID" : TestID, 
					"BlankTestScores" : BlankTestScores,
					"DictationScores" : DictationScores};
			Records.push(rec);
			adoRS.MoveNext();
		}				

		GetScoreRecords.ScoreRecords = Records;
		return Records;
		
	} catch (e) {
		alert("GetScoreRecords: caught exception while accessing Access database.");
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
		
/********************************************/
/*	Sample Delete and Edit Routines 		*/
/********************************************/

function DeleteRecord() {
	var adoConn = new ActiveXObject("ADODB.Connection");
	var adoRS = new ActiveXObject("ADODB.Recordset");
	
	var connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;";
	connectionString = connectionString + "Data Source='\\dbName.mdb'";
	adoConn.Open(connectionString);
	var fieldName = "Quentin";
	var sqlString = "Select * From tblName Where FieldName = '";
	sqlString = sqlString + fieldName + "'";
	adoRS.Open(sqlString, adoConn, 1, 3);
	adoRS.Delete;
	adoRS.Delete;
	
	adoRS.Close();
	adoConn.Close();
}; 

function EditRecord() {
	var adoConn = new ActiveXObject("ADODB.Connection");
	var adoRS = new ActiveXObject("ADODB.Recordset");

	var connectString = "Provider=Microsoft.Jet.OLEDB.4.0;";
	connectString = connectString + "Data Source='\\database01.mdb'";
	adoConn.Open(connectString);						
	var fieldName = "Quentin";
	var sqlString = "Select * From tblName Where FieldName = '";
	sqlString = sqlString + fieldName + "'";
	adoRS.Open(sqlString, adoConn, 1, 3);
	
	adoRS.Edit;
	adoRS.Fields("FieldName").value = "New Name";
	adoRS.Update;
	
	adoRS.Close();
	adoConn.Close();
}; 	

function AddRecord(dbName) {
				
	try {
		var adoConn = new ActiveXObject("ADODB.Connection");
		var adoRS = new ActiveXObject("ADODB.Recordset");	
															
		var path = getDatabasePath();
		var connectionString = getConnectionString(path);
		adoConn.Open(connectionString);		
		adoRS.Open("Select * From Students", adoConn, 1, 3);
		
		adoRS.AddNew;
		adoRS.Fields("FirstName").value = "Walter";
		adoRS.Fields("LastName").value = "White";
		adoRS.Update;
		
		adoRS.Close();
		adoConn.Close();

	} catch (e) {
		alert(e.message);
	}
};