<!-- saved from url=(0014)about:internet -->
<!-- First line is a MOTW (mark of the web) that indicates security zone -->
/*!
 * Sign Up/Login Box v0.0.1 (http://codepen.io/koheishingai/FLvgs)
 * Copyright 2014 Kohei Shingai.
 * Licensed under MIT 
 */

$(function () {
	var DEBUG = 0;
	
    var user = {},
        flg = {};
    init();
    $('.upload').click(function () {
        if (flg.upd == 0) {
			if (DEBUG != 0) {
				alert("ck. pt. 1");
			}
            upd('upload');
            flg.upd = 1
        } else {
			if (DEBUG != 0) {
				alert("ck. pt. 2");
			}
            upd('');
            flg.upd = 0
        }
    });
    $('#login').click(function () {

		if (DEBUG != 0) {
			alert("ck. pt. 3");
		}		
        initub();
        $('#logmsk').fadeIn();
        ub(0)
    });
	
	// **********************************
	// Switching between Login and Signup
	// **********************************
    $('#logint').click(function () {
		
		// Initialize placeholder text and static UserInfo data
		if (DEBUG != 0) {
			alert("Switching between Login and Signup.");
		}
		UserInfo.UID = "";
		UserInfo.PWD = "";
		$('#name').attr('placeholder', 'ID');
		$('#pass').attr('placeholder', 'Password');	
					
        initub();

		// logt flag:
		// 0: login		
		// 1: signup		
        if (flg.logt == 0) {
			// Current state is login,
			// so we're switching to signup
			if (DEBUG != 0) {
				alert("ck. pt. 4");
			}		
            ub(1);
            flg.logt = 1
        } else {
			// Current state is signup,
			// so we're switching to login
			if (DEBUG != 0) {
				alert("ck. pt. 5");
			}
			document.getElementById('pass').type = 'password';				
            ub(0);
            flg.logt = 0
        }
    });
    $("#name").keyup(function () {
        var len = $('#name').val().length;
        if (len > 13 || len == 0) {
            $('#name').css('background', 'rgb(255, 214, 190)');
            blsp();
            if (len != 0) {
                $('#nameal').css('color', 'rgb(255, 57, 19)').text('ID: Too long').fadeIn()
            } else {
                $('#nameal').css('color', 'rgb(255, 57, 19)').text('ID: Null').fadeIn()
            }
            flg.name = 1
        } else {
            $('#name').css('background', 'rgb(255, 255, 255)');
            $('#nameal').css('color', 'rgb(17, 170, 42)').text('ID: Ok').fadeIn();
            flg.name = 0;
            tcheck()
        }
    });
    $("#pass").keyup(function () {
        var len = $('#pass').val().length;
        if (len > 10 || len == 0) {
            $('#pass').css('background', 'rgb(255, 214, 190)');
            blsp();
            if (len != 0) {
                $('#passal').css('color', 'rgb(255, 57, 19)').text('Password: Too long').fadeIn()
            } else {
                $('#passal').css('color', 'rgb(255, 57, 19)').text('Password: Null').fadeIn()
            }
            flg.pass = 1
        } else {
            $('#pass').css('background', 'rgb(255, 255, 255)');
            $('#passal').css('color', 'rgb(17, 170, 42)').text('Password: Ok').fadeIn();
            flg.pass = 0;
            tcheck()
        }
    });
	
	function UserInfo(UID, PWD) {
		UserInfo.UID = UID;
		UserInfo.PWD = PWD;
	};

    function tcheck() {
        if (flg.name == 0 && flg.pass == 0) {
            $('#signupb').css('opacity', '1').css('cursor', 'pointer')
        } else {
            blsp()
        }
    }
	// ****************************************************
	// This function called when you click the Login button
	// ****************************************************
    $('#signupb').click(function () {
		var DEBUG = 0;
		var queryString = 0;
		var FirstName = "";
		var LastName = "";		
		
		if (DEBUG != 0) {
			alert("ck. pt. 11");
		}
        if (flg.name == 0 && flg.pass == 0) {
            $('#sumsk').fadeIn();
            $('#name, #pass, #logint, #nameal, #passal, #signupb').css('opacity', '0.2');
            $('#close').fadeIn()
        }
		
		// logt flag:
		// 0: login		
		// 1: signup
		if (flg.logt == 1) {
			if (DEBUG != 0) {
				alert("Looks like this is a sign up.");
			}
			
			// FirstName = prompt("Please enter your first name: ");
			// LastName = prompt("Please enter your last name: ");
						
			if (UserInfo.UID == undefined || UserInfo.UID == "") {
				var UID = $('#name').val();
				var PWD = $('#pass').val();

				// Before adding the new student, make sure
				// they are not not already in the system
				
				if (CheckForStudent(UID)) {
					alert("Student already registered.");
					
					// $('#name').attr('placeholder', 'ID');
					// $('#pass').attr('placeholder', 'Password');
					// document.getElementById('pass').type = 'password';
					
					// toggle state to indicate login screen
					// flg.logt = 0;			
	
					UserInfo.UID = "";
					UserInfo.PWD = "";
									
					initub();
					$('#close').hide()	
							
					return false;
				}

				UserInfo.UID = UID;
				UserInfo.PWD = PWD;
				
				// ub(1);
				// flg.logt = 1;
				
				initub();
				$('#close').hide()	
								
				$('#name').attr('placeholder', 'First Name');
				$('#pass').attr('placeholder', 'Last Name');
				document.getElementById('pass').type = 'text';
		
				return false;					
			}

			var FirstName = $('#name').val();
			var LastName = $('#pass').val();
			var UID = UserInfo.UID;
			var PWD = UserInfo.PWD;
			
			if (DEBUG != 0) {
				alert("UID = " + UID);
				alert("PWD = " + PWD);
				alert("FirstName = " + FirstName);
				alert("LastName = " + LastName);			
			}
			
			AddStudent(UID, PWD, FirstName, LastName);

			queryString =	"dashboard.html?UID=" + UID +
								"&Password=" + PWD +
								"&FirstName=" + FirstName +
								"&LastName=" + LastName;

			window.location.href = queryString;						

		} else {
			if (DEBUG != 0) {
				alert("Looks like this is a Login.");
			}

			var UID = $('#name').val();
			var PWD = $('#pass').val();
							
			var Students = GetStudentRecords();
			for (i = 0; i < Students.length; i++) {
				var student = Students[i];
				if (student["UID"] == UID) {
					if (student["Password"] == PWD) {
						FirstName = student["FirstName"];
						LastName = student["LastName"];

						queryString =	"dashboard.html?UID=" + UID +
											"&Password=" + PWD +
											"&FirstName=" + FirstName +
											"&LastName=" + LastName;

						window.location.href = queryString;

					} else {
						alert("Password incorrect");
					}
					break;
				}
			}
			if (i == Students.length) {
				alert("User not found.");
			}				
		}
		
		// Hide the popup with the X on it
		// $('#sumsk').hide();
		// We're done on this screen so get rid of the "Send" screen
		// by simply reinitializing. The following three calls are the
		// same as what you get by clicking on the X, i.e. the click
		// event for #close
		
        init();
        initub();
        $('#close').hide()		
    });
	// Click event for the giant X you see after
	// submitting a UID and PWD
    $('#close').click(function () {
		if (DEBUG != 0) {
			alert("ck. pt. 12");
		}
        init();
        initub();
        $('#close').hide()
    });

    function init() {
        flg.logt = 0
    }

    function initub() {
        flg.name = -1;
        flg.pass = -1;
        $('#sumsk').hide();
        $('#nameal').hide();
        $('#passal').hide();
        $('#name, #pass, #logint, #nameal, #passal, #signupb').css('opacity', '1');
        $('#name').css('background', 'rgb(255, 255, 255)');
        $('#pass').css('background', 'rgb(255, 255, 255)');
        $('#signupb').css('opacity', '0.2').css('cursor', 'default');
        $('#name, #pass').val('');
        /* $('#name, #pass').val(''); */
        /* $('#name').val(''); */
        /* $('#pass').val(''); */       
	}

    function upd(button) {
        location.hash = button;
        if (flg.upd == 0) {
            $('#drop').fadeIn()
        } else {
            $('#drop').fadeOut()
        }
    }

    function ub(flg) {
        if (flg == 0) {
            $('#signup').text('Login').css('background', '#FFA622');
            $('#signupb').text('Login');
            $('#logint').text('Sign up as a new user')			
        } else {
            $('#signup').text('Sign up').css('background', '#76ABDB');
            $('#signupb').text('Sign up');
            $('#logint').text('Login as an existing user')
        }
    }

    function blsp() {
        $('#signupb').css('opacity', '0.2').css('cursor', 'default')
    }	
	
});

