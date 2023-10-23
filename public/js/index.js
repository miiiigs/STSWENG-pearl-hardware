
const registerSubmit = document.querySelector('#regsubmit');
const regFName = document.querySelector('#regfname');
const regLName = document.querySelector('#reglname');
const regEmail = document.querySelector('#regemail');
const regPassword = document.querySelector('#regpassword');
const errorDisplay = document.querySelector("#errors");

const loginSubmit = document.querySelector('#logsubmit');
const logEmail = document.querySelector('#logemail');
const logPassword = document.querySelector('#logpassword');
const logErrorDisplay = document.querySelector('#login_errors');

registerSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    console.log("Register button was pressed");

    const fname = regFName.value;
    const lname = regLName.value;
    const email = regEmail.value;
    const password = regPassword.value;

    const jString = JSON.stringify({fname,lname, email, password});

    const response = await fetch('/register', {
        method: "POST",
        body: jString,
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(response.status == 200){ //registers user and clears input fields
        console.log("register success!");
        errorDisplay.textContent = "Register Success!";
        errorDisplay.style.color = "green";
        regFName.value = "";
        regLName.value = "";
        regEmail.value = "";
        regPassword.value = "";
        checkInputs();

    }else if(response.status == 405) { //displays email already taken message
        console.error(`An error has occurred, Status code = ${response.status}`);
        errorDisplay.textContent = "Email already Exists!";
        errorDisplay.style.color = "red";
    }else if(response.status == 406){ //displays invalid email format message
        console.error(`An error has occurred, Status code = ${response.status}`);
        errorDisplay.textContent = "Invalid email format!";
        errorDisplay.style.color = "red";
    }
})

function checkInputs() { //this function disables the register submit button until all fields have values
    if(regFName.value.trim() !== '' && regLName.value.trim() !== '' && regEmail.value.trim() !== '' && regPassword.value.trim() !== ''){
        registerSubmit.disabled = false;
        registerSubmit.textContent = "Submit";
        registerSubmit.style.color = "black";
    }else{
        registerSubmit.disabled = true;
        registerSubmit.textContent = "Fill out all inputs!";
        registerSubmit.style.color = "red";
    }
}

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

        if(response.status == 200){ //registers user and clears input fields
            logErrorDisplay.textContent = "Login Success!";
            logErrorDisplay.style.color = "green";
            logEmail.value = "";
            logPassword.value = "";
        }
        else if(response.status == 500){ 
            logErrorDisplay.textContent = "Invalid email or password";
            logErrorDisplay.style.color = "red";
            console.log("login error!");
        }
    }
    

})

checkInputs() //call the functions when first loading the page
checkInputsLog(); 

regFName.addEventListener('input', checkInputs); //everytime the user inputs a field it checks if all the fields are filled out
regLName.addEventListener('input', checkInputs)
regEmail.addEventListener('input', checkInputs);
regPassword.addEventListener('input', checkInputs);

logEmail.addEventListener('input', checkInputsLog);
logPassword.addEventListener('input', checkInputsLog);

async function getSort(sortButton) {
    
    const sortValue = sortButton.value;
    console.log(sortValue);
    const jString = JSON.stringify({sortValue});
    const response = await fetch('/?sortBy=' + sortValue, {
        method: 'GET',
    });
    window.location.href = '/?sortBy=' + sortValue;

}
