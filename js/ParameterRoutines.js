// JavaScript Document

function getValueInQueryString(name) {
	var DEBUG = 0;
	
	if (DEBUG != 0) {
		alert("In getValueInQueryString.");
	}
	var query_string = {};
	var query = window.location.search.substring(1);
	if (DEBUG != 0) {
		alert("getValueInQueryString: query string = " + query);
	}	
	var vars = query.split("&");
	for (var i=0; i<vars.length; i++) {
		var pair = vars[i].split("=");
		query_string[pair[0]] = decodeURIComponent(pair[1]);
	}
	
	if (DEBUG != 0) {
		alert("getValueInQueryString: query_string[" + 
		name + "] = " + query_string[name]);
	}
	
	return query_string[name];								
};

function getParameter(param) {
	var DEBUG = 0;
	
	if (DEBUG != 0) {
		alert("In getParameter.");
	}

	switch(param) {
		case "UID":    
			return getParameter.UID;	
			break;
		case "Password":
			return getParameter.Password;	
			break;
		case "FirstName":
			return getParameter.FirstName;
			break;
		case "LastName":
			return getParameter.LastName;
			break;
		case "TestID":
			return getParameter.TestID;	
			break;
		case "Source":
			return getParameter.Source;	
			break;
		case "Position":
			return getParameter.Position;
			break;
		case "Level":
			return getParameter.Level;	
			break;
		case "ExerciseGroup":									
			return getParameter.ExerciseGroup;	
			break;
		default:
			alert("Unrecognized parameter: " + paramname);
			return;
	}				
};

function getUID() {

	var DEBUG = 0;

	if (DEBUG != 0) { 
		alert("In getUID."); 
	}
	
	if ( typeof getParameter.UID == 'undefined' ) {
		// If parameter not yet defined, fetch it from
		// the parameter string
		
		var UID = getValueInQueryString("UID");
		
		if (typeof UID == 'undefined' || UID == "") {
			// If the UID is not defined in the query string
			// just set it to 'guest'.
			getParameter.UID = 'jane.wilson';
		} else {
			getParameter.UID = getValueInQueryString("UID");
		}	
	}			
	
	return getParameter.UID;				
};

function getPassword() {

	var DEBUG = 0;

	if (DEBUG != 0) { 
		alert("In getPassword."); 
	}

	if ( typeof getParameter.Password == 'undefined' ) {
		// If parameter not yet defined, fetch it from
		// the parameter string
		
		var Password = getValueInQueryString("Password");

		if (typeof Password == 'undefined' || Password == "") {
			// If the password is not provided in the query string
			// just set it to 'guest'
			getParameter.Password = 'austin';	
		} else {
			getParameter.Password = Password;
		}
	}			
	
	return getParameter.Password;
};

function getFirstName() {

	var DEBUG = 0;

	if (DEBUG != 0) { 
		alert("In getFirstName."); 
	}

	if ( typeof getParameter.FirstName == 'undefined' ) {
		// If parameter not yet defined, fetch it from
		// the parameter string
		
		var FirstName = getValueInQueryString("FirstName");

		if (typeof FirstName == 'undefined' || FirstName == "") {
			// If the password is not provided in the query string
			// just set it to 'guest'
			getParameter.FirstName = 'Jane';	
		} else {
			getParameter.FirstName = FirstName;
		}
	}			
	
	return getParameter.FirstName;
};

function getLastName() {

	var DEBUG = 0;

	if (DEBUG != 0) { 
		alert("In getLastName."); 
	}

	if ( typeof getParameter.LastName == 'undefined' ) {
		// If parameter not yet defined, fetch it from
		// the parameter string
		
		var LastName = getValueInQueryString("LastName");

		if (typeof LastName == 'undefined' || LastName == "") {
			// If the password is not provided in the query string
			// just set it to 'guest'
			getParameter.LastName = 'Wilson';	
		} else {
			getParameter.LastName = LastName;
		}
	}			
	
	return getParameter.LastName;
};

function getCurrentTestID() {

	var DEBUG = 0;

	if (DEBUG != 0) { 
		alert("In getCurrentTestID."); 
	}

	if ( typeof getParameter.TestID == 'undefined' ) {
		// If parameter not yet defined, fetch it from
		// the parameter string
		
		var TestID = getValueInQueryString("TestID");

		if (DEBUG != 0) { 
			alert("getCurrentTestID: TestID in query string = " + TestID);
		}
		
		if (typeof TestID == 'undefined' || TestID == "") {
			// If the TestID is not provided in the query string
			// just set it to '2'
			getParameter.TestID = '1';
		} else {
			getParameter.TestID = TestID;
		}
	}

	if (DEBUG != 0) { 
		alert("getCurrentTestID: getParameter.TestID = " + getParameter.TestID);
	}
						
	return getParameter.TestID;				
};

function getCurrentSource() {

	var DEBUG = 0;

	if (DEBUG != 0) { 
		alert("In getCurrentSource."); 
	}
	
	if ( typeof getParameter.Source == 'undefined' ) {
		// If parameter not yet defined, fetch it from
		// the parameter string

		if (DEBUG != 0) { 
			alert("getParameter.Source was undefined"); 
		}

		// WARNING !!!!!
		// SPACES IN RONG CHANG MIGHT CAUSE TROUBLE 
		// IN QUERY STRING!!!!!!!!
		
		var Source = getValueInQueryString("Source");

		if (DEBUG != 0) { 
			alert("getParameter: value returned by getValueInQueryString = " +
			Source); 
		}
		
		if (typeof Source == "undefined" || Source == "") {
			// If Source is not defined in the query string
			// just set it to Rong Chang
			getParameter.Source = "Rong Chang";
			if (DEBUG != 0) { 
				alert("(ck. pt. 1). getParameter.Source = " +
						getParameter.Source); 
			}			
		} else {
			getParameter.Source = Source;
			if (DEBUG != 0) { 
				alert("(ck. pt. 2). getParameter.Source = " +
						getParameter.Source); 
			}			
		}
	}			
	
	return getParameter.Source;				
};

function getCurrentLevel() {

	var DEBUG = 0;

	if (DEBUG != 0) { 
		alert("In getCurrentLevel."); 
	}

	getParameter.Level = "Kids";
	return "Kids";
	
	if ( typeof getParameter.Level == 'undefined' ) {
		// If parameter not yet defined, fetch it from
		// the parameter string
		getParameter.Level = getValueInQueryString("Level");
	}			
	
	return getParameter.Level;				
};

function getCurrentPositionInTree() {

	var DEBUG = 0;

	if (DEBUG != 0) { 
		alert("In getCurrentPositionInTree."); 
	}
	
	if ( typeof getParameter.Position == 'undefined' ) {
		// If parameter not yet defined, fetch it from
		// the parameter string

		var Position = getValueInQueryString("Position");
	
		if (DEBUG != 0) { 
			alert("getCurrentPositionInTree: value returned by getValueInQueryString = " +
			Position); 
		}
			
		if (typeof Position == 'undefined' || Position == "") {
			// If Source is not defined in the query string
			// just set it to Rong Chang
			getParameter.Position = 101;
			if (DEBUG != 0) { 
				alert("(ck. pt. 1). getParameter.Position = " +
						getParameter.Position); 
			}			
		} else {
			getParameter.Position = Position;
			if (DEBUG != 0) { 
				alert("(ck. pt. 2). getParameter.Position = " +
						getParameter.Position); 
			}			
		}		
	}				
	return getParameter.Position;				
};

function getExerciseGroup() {

	var DEBUG = 0;

	if (DEBUG != 0) { 
		alert("In getExerciseGroup."); 
	}
	
	if ( typeof getParameter.ExerciseGroup == 'undefined' ) {
		// If parameter not yet defined, fetch it from
		// the parameter string

		if (DEBUG != 0) { 
			alert("getParameter.ExerciseGroup was undefined"); 
		}
		
		var ExerciseGroup = getValueInQueryString("ExerciseGroup");

		if (DEBUG != 0) { 
			alert("getParameter: value for ExerciseGroup returned by getValueInQueryString = " +
			ExerciseGroup); 
		}
		
		if (typeof ExerciseGroup == 'undefined' || ExerciseGroup == "") {
			// If Source is not defined in the query string
			// just set it to Rong Chang
			getParameter.ExerciseGroup = "Start Reading 1";
			if (DEBUG != 0) { 
				alert("(ck. pt. 1). getParameter.ExerciseGroup = " +
						getParameter.ExerciseGroup); 
			}			
		} else {
			getParameter.ExerciseGroup = ExerciseGroup;
			if (DEBUG != 0) { 
				alert("(ck. pt. 2). getParameter.ExerciseGroup = " +
						getParameter.ExerciseGroup); 
			}			
		}
	}			
	return getParameter.ExerciseGroup;				
};
