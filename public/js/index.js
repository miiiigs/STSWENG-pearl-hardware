const registerSubmit = document.querySelector('#regsubmit');
const regName = document.querySelector('#regname');
const regEmail = document.querySelector('#regemail');
const regPassword = document.querySelector('#regpassword');
const errorDisplay = document.querySelector("#errors");

registerSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    console.log("Register button was pressed");

    const name = regName.value;
    const email = regEmail.value;
    const password = regPassword.value;

    const jString = JSON.stringify({name, email, password});

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
        regName.value = "";
        regEmail.value = "";
        regPassword.value = "";

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
    if(regName.value.trim() !== '' && regEmail.value.trim() !== '' && regPassword.value.trim() !== ''){
        registerSubmit.disabled = false;
        registerSubmit.textContent = "Submit";
        registerSubmit.style.color = "black";
    }else{
        registerSubmit.disabled = true;
        registerSubmit.textContent = "Fill out all inputs!";
        registerSubmit.style.color = "red";
    }
}

checkInputs() //call the function when first loading the page

regName.addEventListener('input', checkInputs); //everytime the user inputs a field it checks if all the fields are filled out
regEmail.addEventListener('input', checkInputs);
regPassword.addEventListener('input', checkInputs);