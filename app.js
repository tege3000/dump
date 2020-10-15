const programsUri = "/api/programs/";
const graduationYearsUri = "/api/graduationYears/";
const registerUri = "/api/register/";
const loginUri = "/api/login/";
var body = document.getElementsByTagName("body")[0];
var signUpForm = document.getElementById("signupForm");
var loginForm = document.getElementById("loginForm");

body.onload = () => {
    if(document.cookie) {
        const uidCookie = document.cookie.split(';').find(row => row.startsWith('uid')).split('=')[1];
        var usersUri = `/api/users/${uidCookie}`;

        fetch(usersUri)
            .then((response) => {        
                return response.json(); 
            })
            .then((data) => {
                // console.log(data);

                let navRight = document.getElementsByClassName("navbar-nav float-right")[0];
                navRight.childNodes[1].style.display = "none";
                navRight.childNodes[3].style.display = "none";

                let l1 = document.createElement("li");
                l1.className = "nav-item";

                let l2 = document.createElement("li");
                l2.className = "nav-item";

                let a1 = document.createElement("a");
                a1.className = "nav-link";
                a1.id = "logout";
                a1.href = "#";
                a1.innerHTML = "Logout";

                let a2 = document.createElement("a");
                a2.className = "nav-link";
                a2.id = "username";
                a2.innerHTML = "Hi, " + data.firstname;

                l1.appendChild(a1);
                l2.appendChild(a2);

                navRight.appendChild(l1);
                navRight.appendChild(l2);

                let logoutBtn = document.getElementById("logout");
                
                logoutBtn.addEventListener("click", () => {
                    document.cookie += "; expires=Thu, 01 Jan 1970 00:00:01 GMT"; 

                    window.location.href = window.location.origin + "/project-explorer/index.html";
                });
            })
            .catch((error) => {
                // handling errors
                console.log(error);
            })

    }
    else {
        console.log("no cookie");
    }
};

fetch(programsUri)
    .then((response) => {        
        return response.json(); 
    })
    .then((data) => {
        // console.log(data);

        let programs = document.getElementById("inputProgram");

        for(let i = 0; i < data.length; i++) {
            programs[i].value = data[i];
            programs[i].innerHTML = data[i];
        }

    })
    .catch((error) => {
        // handling errors
        console.log("ERROR:", error);
    });


fetch(graduationYearsUri)
    .then((response) => {        
        return response.json(); 
    })
    .then((data) => {
        // console.log(data);

        let graduationYears = document.getElementById("inputGraduationYear");
        if(data.length != graduationYears.length) {
            graduationYears.length = data.length;
        }

        for(let i = 0; i < data.length; i++) {
            graduationYears[i].value = data[i];
            graduationYears[i].innerHTML = data[i];
    
            graduationYears.append(data[i]);
     
        }

    })
    .catch((error)=> {
        // handling errors
        console.log("ERROR:", error);
    });

signUpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-danger"; 

    let firstName = document.getElementById("inputFirstName").value;
    let lastName = document.getElementById("inputLastName").value;
    let email = document.getElementById("inputEmailAddress").value;
    let password = document.getElementById("inputPassword").value;
    let matricNumber = document.getElementById("inputMatricNumber").value;
    let program = document.getElementById("inputProgram").value;
    let graduationYear = document.getElementById("inputGraduationYear").value;

    let signUpDetails = { 
        "firstname": firstName,
        "lastname": lastName,
        "email": email,
        "password": password,
        "matricNumber": matricNumber,
        "program": program,
        "graduationYear": graduationYear 
    };

    console.log(signUpDetails);

    fetch(registerUri, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(signUpDetails)
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if(data.status == "ok") {
                let key = "uid";
                let value = data.data.id;
                document.cookie = `${key}= ${value}`;
                window.location.href = window.location.origin + "/project-explorer/index.html";
            }
            else {
                let n = data.errors.length;
                for(let i = 0; i < n; i++) {
                    let alertBody = document.createElement("p");

                    alertBody.textContent = data.errors[i];
                    alertDiv.appendChild(alertBody);
                    
                }
                signUpForm.prepend(alertDiv);
            }
            
        })
        .catch((error) => {
             // handling errors
            console.log("ERROR:", error);
        });
    
});

console.log(loginForm);

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-danger"; 

    let email = document.getElementById("exampleInputEmail1").value;
    let password = document.getElementById("exampleInputPassword1").value;

    let loginDetails = { 
        "email": email,
        "password": password
    };

    console.log(loginDetails);
    fetch(loginUri, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(loginDetails)
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // console.log(data);

            if(data.status == "ok") {
                let key = "uid";
                let value = data.data.id;
                document.cookie = `${key}= ${value}`;
                window.location.href = window.location.origin + "/project-explorer/index.html";
            }
            else {
                let alertBody = document.createElement("p");

                alertBody.textContent = "Invalid email/password";
                alertDiv.appendChild(alertBody);
                loginForm.prepend(alertDiv);
            }
        })
        .catch((error) => {
            console.log("ERROR", error);
        });
});






