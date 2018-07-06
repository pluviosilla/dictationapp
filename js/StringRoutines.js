// JavaScript Document

// encode string to prevent problems with punctuation characters
function encodestring(str) {
	// String of length 22
	// var str = "Welcome to Jim's world";

	var ch = "";
	var i = 0;
	var code = 0;
	var op = "";
	var hexstring = "";
	// alert("In encodetest.");
	
	for (i = 0; i < str.length; i++) {
		ch = str.charAt(i);
		code = str.charCodeAt(i);
		// alert("str.charAt(" + i + ") = " + ch + ", unicode = " + code);
		hexString = code.toString(16);
		// alert("hexString = " + hexString);
		op = op + hexString;
	}
	// alert("Converted string: " + op);			
	
	return op;
};

function decodestring(content) {
	// var encodeddiv = document.getElementById("encodedtext");
	// var content = encodeddiv.innerHTML;
	var firstdigit = "";
	var seconddigit = "";		
	var op = "";

	// alert("content.length = " + content.length);
	
	for (i = 0; i < content.length; i += 2) {
		firstdigit = content.charAt(i);
		seconddigit = content.charAt(i+1);
		var code = firstdigit + seconddigit;
		// convert hex to decimal
		var decimalcode = parseInt(code, 16)
		ch = String.fromCharCode(decimalcode);
		op = op + ch;
	}
	
	return op;
};	

// escape punctuation characters
function escapepunctuation(str) {
	return str;
}

// Simplify strings by removing all punctuation except for quote (')
function simplify(str) {
	// return str.replace(/^\s+|\s+$/g,"");
	
	// ASCII characters are x00 - x7F
	// Printing characters start at x20 (space)
	// 7F is the DEL key
	
	// remove non-printing characters
	str = str.replace(/[^\x1F-\x7E]/g, "");
	
	// remove excess spaces
	str = str.replace(/\s+/g," ");
	
	// standardize use of single quote
	str = str.replace(/\']/g,"’");	

	// get rid of all punctuation other than single quote
	str = str.replace(/[\.,;\"\n\t\?\!]/g,"");
	
	// trim spaces from beginning and end of string
	str = str.trim();
		
	return str;
};

// get rid of **ALL** punctuation
function removepunctuation(str) {
	return str.replace(/[\.,;\"\n\t\'\’\?\!]/g,"");	
};

function removewhitespace(str) {
	// ASCII characters are x00 - x7F
	// Printing characters start at x20 (space)
	// 7F is the DEL key
		
	// remove non-printing characters
	str = str.replace(/[^\x1F-\x7E]/g, "");
		
	// remove spaces
	return str.replace(/[\s]+/g,"");	
};