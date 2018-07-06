// JavaScript Document

function BlanksExercise() {
	var DEBUG = 0;			
	var nodeTree = [];
	var testRecord = {};
	
	// var currentPositionInTree = getCurrentPositionInTree();
	// var rec = Group.CurrentRecord;
	// var currentPositionInTree = rec["Position"];
	var currentPositionInTree = Group.CurrentRecord.PositionInTree;
	
	if (DEBUG != 0) {
		alert("NextExercise: currentPositionInTree = " + 
		currentPositionInTree);
	}
	var nextPosition = parseInt(currentPositionInTree) + 1;
	if (DEBUG != 0) {
		alert("NextExercise: nextPosition = " + nextPosition);
	}
	TestID = GetTestIDFromPosition(nextPosition);
	if (DEBUG != 0) {
		alert("NextExercise: TestID for next position = " + TestID);
	}			
	testRecord = Group(TestID);
				
	if (testRecord.ActiveRecord == true) {	
		if (DEBUG != 0) {
			alert("NextExercise: record is active.");
		}
		DisplayBlanksTest(testRecord); 
		var audiopath = testRecord["Audio"];

		if (DEBUG != 0) {
			alert("NextExercise: audio path = " + audiopath);
		}			
		LoadAudioForBlanksTest(audiopath);
		getParameter.Position = nextPosition;			
	} else {
		if (DEBUG != 0) {
			alert("NextExercise: no test record found");
		}
		// We've run out of exercises in this Exercise Group. 
		// Return to dashboard.
		GoToDashboard();
	}
};

function DictationExercise() {
	var DEBUG = 0;
	var DictationRecords = [];
	var rec = {};
	var CurrentTestRec = Group.CurrentRecord;
	var TestID = CurrentTestRec.TestID;

	if (DEBUG != 0) {
		alert("In DictationExercise.");
	}
	
	DictationRecords = GetDictationRecords(TestID);			
	
	// Check to see if dictation records were found
	rec =  DictationRecords[0];
	if (rec["DictationActive"] == false) {
		// No records found display the next Blanks test instead

		if (DEBUG != 0) {					
			alert("DictationExercise: no dictation records found.");
			alert("DictationExercise: rec[DictationActive] = " + 
				   rec["DictationActive"]);
		}
		// Could not find dictation dta, set page stage back to "Blanks"
		Group.PageState = "Blanks";	
		BlanksExercise();
		return;
	}

	// Zero-out (empty) the audio section from the previous test
	var audiodiv = document.getElementById("audiodiv");
	audiodiv.innerHTML = "";

	var textdiv = document.getElementById("txtarea");
	textdiv.innerHTML = "";
	
	var dictdiv = document.getElementById("dictdiv");
	dictdiv.innerHTML = "";

	var str = "";
	var tabindex = 1;
	for (i = 0; i < DictationRecords.length; i++) {
		var dictationRecord = DictationRecords[i];
		var SentenceContent = dictationRecord["SentenceContent"];
		var words = [];
		// words = SentenceContent.split(" ");
		// words = SentenceContent.split(/[\t\s\n\r\?\!\.\"\',;]+/g);
		// Leave in the apostrophes so that a word like Laura's
		// won't count as two words.
		var prunedSentenceContent = simplify(SentenceContent);
		// words = SentenceContent.split(/[\t\s\n\r\?\!\.\",;]+/g);
		words = prunedSentenceContent.split(/\s+/g);
		// var wordcnt = words.length - 1;
		var wordcnt = words.length;

		if (DEBUG != 0) {
			alert("DictationExercise: # words in SentenceContent = " + wordcnt);
		}

		var AudioPath = dictationRecord["Audio"];	
		var audiotagprefix = "<p style='text-align:left'>" +
							 "<audio id='audio" + i + "' src='audio/";

		// Tried to include audio control in the tabindex
		// but that didn't work out too well. When you tab
		// onto the audio control, subsequent tab presses
		// move to others parts of the same control instead
		// of preceding to the <input> box as desired.
		/** 
		var audiotagprefix = "<p style='text-align:left'>" +
							 "<audio id='audio" + i + "' tabindex='" +
						  		tabindex + "' src='audio/";								
		tabindex = tabindex + 1;
		**/

		var audiotagsuffix = " controls oncontextmenu='return false;'>"
		var audioendtag = "</audio></p>";
		var audiotag = 	audiotagprefix + AudioPath + "'" + 
						audiotagsuffix +
						audioendtag;
		
		var inputBox = "";
		var inputPrefix = " <p style='text-align:left'>" +
						  "<input id='ip" + i + "' tabindex='" +
						  tabindex + "' ";
		tabindex = tabindex + 1;
		/***
		var inputAttributes = " class='GapBox' " + " align='left' " +
							  " type='text' size='40' name='";				
		***/
		
		var EncodedSentenceContent = encodestring(SentenceContent);
		
		var inputAttributes = " class='DictationBox'" + " align='left' " +
							  " type='text' size='40' wordcnt='" + 
							    wordcnt + "' name='";				
		var inputSuffix = EncodedSentenceContent + "'></input></p>";
		inputBox = inputPrefix + inputAttributes + inputSuffix;
		if (DEBUG != 0) {
			alert("DictationExercise: input box = " + inputBox);
		}		   
		
		str = str + " " + audiotag + " " + inputBox;	
	}
	// textdiv.innerHTML = str;
	dictdiv.innerHTML = str;
};

function DisplayBlanksTest(testRecord) {
	var DEBUG = 0;
	
	var textdiv = document.getElementById("txtarea");
	var dictdiv = document.getElementById("dictdiv");
	var testheader = document.getElementById("testheader");
	var BlankTestContent = testRecord["BlankTestContent"];
	var testName = testRecord["TestName"];
	
	if (DEBUG != 0) {
		alert("DisplayBlanksTest: Test Content = " + BlankTestContent);
		alert("Ready DisplayBlanksTest: Test Name = " + testName);
	}
	
	var words = [];
	// words = BlankTestContent.split(" ");
	// words = BlankTestContent.split(/[\t\s\n\r\?\!\.\"\',;]+/g);	
	words = BlankTestContent.split(/[\t\s\n\r]+/g);	
	if (DEBUG != 0) {
		alert("DisplayBlanksTest: words.length = " + words.length);
	}
	
	var testContent = "";

	var inputBox = "";
	var inputPrefix =     "<input id='"; 
	var inputAttributes = " class='GapBox' " +
						  " type='text' size='6' name='";
	var wrd = "";
	var wrdpruned = "";
	var wrdlength = 0;
	var pos = 0;

	// var str = "Mr. Blue has a blue house";
	// var n = str.search(/blue/i);
	// string.substring(start,end)
	// var str = "Hello world!";
	// var res = str.substr(1, 4);
	// yields "ello"
	
	for (i = 0; i < words.length; i++) {
		wrd = words[i];
		
		if (i % 5 == 4) {

			// sort the word from the punctuation
			
			wrdpruned = wrd;
			// wrdpruned = wrdpruned.replace(/[\t\s\n\r\?\.\"\',;]+/g, "");
			// leave quote (') character in the pruned word in order
			// to handle words like: o'clock, Jim's, etc.
			wrdpruned = wrdpruned.replace(/[\t\s\n\r\?\.\",;]+/g, "");
			wrdlength = wrdpruned.length;
			pos = wrd.indexOf(wrdpruned);
			
			// var prm = prompt("Enter prompt value: ");
			
			if (DEBUG != 0) {
				alert("wrd = " + wrd);
				alert("wrdpruned = " + wrdpruned);
				alert("wrdlength = " + wrdlength);
				alert("pos = " + pos);
			}

			wrdprefix = wrd.substring(0, pos - 1);
			wrdsuffix = wrd.substring(pos + wrdlength);

			if (DEBUG != 0) {
				alert("wrdprefix = " + wrdprefix);
				alert("wrdsuffix = " + wrdsuffix);
			}
			var inboxID = removepunctuation(wrdpruned);
			var encodedWord = encodestring(wrd);
			inputBox = wrdprefix + " <span>" + inputPrefix + 
			           "'ip" + i + inboxID + "'" +
					   inputAttributes + encodedWord + 
					   "' </input></span>" + wrdsuffix;
			
			if (DEBUG != 0) {
				alert("inputBox = " + inputBox);
			}
			testContent = testContent + inputBox;     
		} else {
			testContent = testContent + " " + wrd;
		}
	}

	if (DEBUG != 0) {
		alert("DisplayBlanksTest: test content with <input> boxes = " +
				testContent);
	}
	// insert name of test
	testheader.innerHTML = testName;
	// insert content of test
	// textdiv.innerHTML = testContent;
	dictdiv.innerHTML = testContent;
};		

function LoadAudioForBlanksTest(path) {
	var DEBUG = 0;

	var audiotagprefix = "<audio id='audio' src='audio/";
	var audiotagsuffix = " controls oncontextmenu='return false;'>"
	var audioendtag = "</audio>";
	var audiotag = 	audiotagprefix + path + "'" + 
					audiotagsuffix +
					audioendtag;
							
	var audiodiv = document.getElementById("audiodiv");
	audiodiv.innerHTML = audiotag;
	
	if (DEBUG != 0) {
		alert("LoadAudioForBlanksTest: audiotag = " + audiotag);
		alert("LoadAudioForBlanksTest: path = " + path);
	}
};

function toggleLoop(checkbox) {
	var audio = document.getElementById("audio"); 
	var loop = checkbox.checked; 
	if (typeof audio.loop == "boolean") {
		audio.loop = true;
	} else {
		audio.addEventListener("ended", function() {
			this.currentTime = 0; 
			this.play(); 
		}, false); 
	} 
}; 