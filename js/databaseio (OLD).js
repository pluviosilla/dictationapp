/*!
 * Database routines
 */

$(function () {

	function AddRecord() {
					
		/** if (window.ActiveXObject) { **/
		try {
			var adoConn = new ActiveXObject("ADODB.Connection");
			var adoRS = new ActiveXObject("ADODB.Recordset");										
			
			var rawpath = location.pathname;
			alert("The rawpath is: " + rawpath);					
			var filename = rawpath.split("/").pop();
			alert("The filename is: " + filename);					
			var rawdbpath = rawpath.replace(filename, "database01.mdb");
			alert("The rawdbpath is: " + rawdbpath);
			// Remove first slash
			var path = rawdbpath.replace("/", "");
			alert("The DB path without leading slash: " + path);
			// Do global replace of %20 with spaces
			var path = path.replace(/%20/g, " ");
			alert("The DB path with space instead of %20: " + path);
			// Replace all remaining slashes with double back-slashes
			var path = path.replace(/\//g, "\\\\");				
			alert("The DB path is: " + path);
	
			/** absolute path
			adoConn.Open("Provider=Microsoft.Jet.OLEDB.4.0;Data Source='G:\\DATA\\EDUCATION\\ENGLISH\\Rong Chang\\database01.mdb'");
			 **/
			var connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source='"
			connectionString = connectionString + path + "'";
			alert("ADO connection string: " + connectionString);
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
		/***
		} else {
			alert ("Your browser does not support creating a database connection.");
		} ***/			
	}

	function DeleteRecord() {
		var adoConn = new ActiveXObject("ADODB.Connection");
		var adoRS = new ActiveXObject("ADODB.Recordset");
		
		adoConn.Open("Provider=Microsoft.Jet.OLEDB.4.0;Data Source='\\dbName.mdb'");
		adoRS.Open("Select * From tblName Where FieldName = 'Quentin'", adoConn, 1, 3);
		adoRS.Delete;
		adoRS.Delete;
		
		adoRS.Close();
		adoConn.Close();
	} 

	function EditRecord() {
		var adoConn = new ActiveXObject("ADODB.Connection");
		adoConn.Open("Provider=Microsoft.Jet.OLEDB.4.0;Data Source='\\database01.accdb'");

		var adoRS = new ActiveXObject("ADODB.Recordset");		

		adoRS.Open("Select * From tblName Where FieldName = 'Quentin'", adoConn, 1, 3);
		
		adoRS.Edit;
		adoRS.Fields("FieldName").value = "New Name";
		adoRS.Update;
		
		adoRS.Close();
		adoConn.Close();
	} 	
	
});// JavaScript Document