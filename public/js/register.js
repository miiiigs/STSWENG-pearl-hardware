const registerSubmit = document.querySelector('#regsubmit');
const regFName = document.querySelector('#regfname');
const regLName = document.querySelector('#reglname');
const regEmail = document.querySelector('#regemail');
const regPassword = document.querySelector('#regpassword');
const regLine1 = document.querySelector('#regline1');
const regLine2 = document.querySelector('#regline2');
const regCity = document.querySelector('#regcity');
const regState = document.querySelector('#regstate');
const regPostalCode = document.querySelector('#regpostalcode');
const errorDisplay = document.querySelector("#errors");

const regLog = document.querySelector('#regLog'); //we remove the myaccount and register buttons in the register/login pages
const myAccount = document.querySelector('#myAccount')
try{
    regLog.style.visibility = "hidden";
    myAccount.style.visibility = "hidden"; 
} catch{};

registerSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    console.log("Register button was pressed");

    const fname = regFName.value;
    const lname = regLName.value;
    const email = regEmail.value;
    const password = regPassword.value;
    const line1 = regLine1.value;
    const line2 = regLine2.value;
    const state = regState.value;
    const city = regCity.value;
    const postalCode = regPostalCode.value;

    const jString = JSON.stringify({fname,lname, email, password, line1, line2, state, city, postalCode});

    const response = await fetch('/register', {
        method: "POST",
        body: jString,
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(response.status == 200){ //registers user and clears input fields
        console.log("register success!");

        const jString = JSON.stringify({email, password});
        const response = await fetch('/login', {
            method: "POST",
            body: jString,
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(response.status == 200){ 
            window.location.href = '/';
        }
        else if(response.status == 500){ 
            console.log("login error! Status code 500");
        }

    }else if(response.status == 405) { //displays email already taken message
        console.error(`An error has occurred, Status code = ${response.status}`);
        errorDisplay.textContent = "Email already exists!";
        errorDisplay.style.color = "red";
    }else if(response.status == 406){ //displays invalid email format message
        console.log("OKAY")
        console.error(`An error has occurred, Status code = ${response.status}`);
        errorDisplay.textContent = "Invalid email format!";
        errorDisplay.style.color = "red";
    }else if(response.status == 410){ //displays invalid email format message
        console.log("OKAY")
        console.error(`An error has occurred, Status code = ${response.status}`);
        errorDisplay.textContent = "Invalid postal code!";
        errorDisplay.style.color = "red";
    }
})

function checkInputs() { //this function disables the register submit button until all fields have values
    if(regFName.value.trim() !== '' && regLName.value.trim() !== '' && regEmail.value.trim() !== '' && regPassword.value.trim() !== '' && regLine1.value.trim() !== '' && regCity.value.trim() !== '' && regState.value.trim() !== '' && regPostalCode.value.trim() !== ''){
        registerSubmit.disabled = false;
        registerSubmit.textContent = "Submit";
        registerSubmit.style.color = "black";
    }else{
        registerSubmit.disabled = true;
        registerSubmit.textContent = "Fill out all inputs!";
        registerSubmit.style.color = "red";
    }
}

checkInputs() //call the functions when first loading the page

regFName.addEventListener('input', checkInputs); //everytime the user inputs a field it checks if all the fields are filled out
regLName.addEventListener('input', checkInputs)
regEmail.addEventListener('input', checkInputs);
regPassword.addEventListener('input', checkInputs);
regLine1.addEventListener('input', checkInputs);
regCity.addEventListener('input', checkInputs);
regState.addEventListener('input', checkInputs);
regPostalCode.addEventListener('input', checkInputs);