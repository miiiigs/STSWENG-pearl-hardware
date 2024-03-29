const loginSubmit = document.querySelector('#logsubmit');
const logEmail = document.querySelector('#logemail');
const logPassword = document.querySelector('#logpassword');
const errorDisplay = document.querySelector("#errors");
//const logErrorDisplay = document.querySelector('#login_errors');

const regLog = document.querySelector('#regLog'); //we remove the myaccount and register buttons in the register/login pages
const myAccount = document.querySelector('#myAccount')
try{
    regLog.style.visibility = "hidden";
    myAccount.style.visibility = "hidden"; 
} catch{};

function checkInputsLog() { //this function disables the register submit button until all fields have values
    if(logEmail.value.trim() !== '' && logPassword.value.trim() !== ''){
        loginSubmit.disabled = false;
        loginSubmit.textContent = "Submit";
        loginSubmit.style.color = "black";
    }else{
        loginSubmit.disabled = true;
        loginSubmit.textContent = "Fill out all inputs!";
        loginSubmit.style.color = "red";
    }
}

loginSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    console.log("Login button was clicked");
    if(logEmail.value === "" || logPassword.value === ""){
        logErrorDisplay.textContent = "Invalid input";
        logErrorDisplay.style.color = "red";
    }
    else{
        const email = logEmail.value;
        const password = logPassword.value;

        const jString = JSON.stringify({email, password});

        const response = await fetch('/login', {
            method: "POST",
            body: jString,
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(response.status == 200){ 
            /*
            logErrorDisplay.textContent = "Login Success!";
            logErrorDisplay.style.color = "green";
            logEmail.value = "";
            logPassword.value = "";
            */
            window.location.href = '/';
        }else if(response.status == 201){
            window.location.href = '/admin';
        }
        else if(response.status == 500){ 
            console.error(`An error has occurred, Status code = ${response.status}`);
            errorDisplay.textContent = "Incorrect email or password!";
            errorDisplay.style.color = "red";
        }
    }
    

})

checkInputsLog();

logEmail.addEventListener('input', checkInputsLog);
logPassword.addEventListener('input', checkInputsLog);
