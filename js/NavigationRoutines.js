// JavaScript Document

function NextExercise() {
	
	switch (Group.PageState) {			
		case "Blanks":    
			// We're in the Blanks state. 
			// Toggle to Dictation and render test.
			Group.PageState = "Dictation";	
			DictationExercise();
			break;
		case "Dictation":
			// We're in the Dictation state. 
			// Toggle to Blanks and render test.
			Group.PageState = "Blanks";	
			BlanksExercise();	
			break;
		default:
			alert("Unrecognized Page State: " + Group.PageState);
			return;
	}				
};

function GoToDashboard() {
	var DEBUG = 0;
	
	var UID = getUID();
	var PWD = getPassword();
	var FirstName = getFirstName();
	var LastName = getLastName();
	if (DEBUG != 0) {
		alert("GoToDashboard: UID = " + UID);
		alert("GoToDashboard: PWD = " + PWD);
		alert("GoToDashboard: FirstName = " + FirstName);
		alert("GoToDashboard: LastName = " + LastName);
	}	
	
	var queryString =	"dashboard.html?UID=" + UID +
						"&Password=" + PWD +
						"&FirstName=" + FirstName +
						"&LastName=" + LastName;

	// Refresh score data before navigating back to dashboard
	RefreshScoreRecords(UID);

	window.location.href = queryString;
};

function Logout() {
	// alert("In Logout.");
	var queryString =	"index.html";
	window.location.href = queryString;
};

