// JavaScript Document


function BaseTree(node) {
	var DEBUG = 0;
				
	if (DEBUG != 0) {
		alert("In BaseTree. node to push = " + node);
	}
	
	if (BaseTree.IDS == undefined) {
		BaseTree.IDS = [];
	} 
	
	BaseTree.IDS.push(node);
	
	if (DEBUG != 0) {
		alert("BaseTree.IDS.length = " + BaseTree.IDS.length);
	}
};

function AddNode(parentID, childID, tID) {
	var DEBUG = 0;
	
	if (DEBUG != 0) {
		alert("In AddNode: childID = " + childID);
		alert("In AddNode: TestID = " + tID);
	}

	// Save child name in original form to use in the node's
	// label before removing spaces and punctuation
	var nodeLabel = childID;
	
	// simplify childid by removing punctuation, 
	// non-printing characters and spaces
	childID = removepunctuation(childID);
	childID = removewhitespace(childID);
		
	// this works
	// BUT will only create a leaf node that I am unable
	// to check or uncheck programmatically.
	// $('#tree').jstree("create_node", parentID, childID, "last");

	// This doesn't work:
	// var node = { id:childID, text:childID, attr: {testID:tID} };
	// This doesn't work either:
	// var node = { attr: {id:childID, text:childID, testID:tID} };
	// This doesn't work either:
	// var node = { "data" : childID, attr: {text:childID, testID:tID} };
	// This doesn't work either:
	// node.data("testID", tID);

	var childnode = { 
		"id":childID, "text":nodeLabel, "data":{"TestID":tID, "ExerciseGroup":parentID} 
	};
	// var node = { id:childID, text:childID };
	if (DEBUG != 0) {
		// alert("Just stored testID attribute.");								
	}
	$('#tree').jstree("create_node", parentID, childnode, "last");	
	
};		
