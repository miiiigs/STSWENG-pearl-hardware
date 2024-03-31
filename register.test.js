global.fetch = jest.fn(() => Promise.resolve({ status: 200 }));

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Read the register.js file
const registerScript = fs.readFileSync(path.resolve(__dirname, '../public/js/register.js'), 'utf-8');

let window;
let document;

beforeEach(() => {
    // Create a new JSDOM instance before each test
    const dom = new JSDOM(`<!DOCTYPE html><html><body>
        <form>
            <input id="regfname" type="text" value="">
            <input id="reglname" type="text" value="">
            <input id="regemail" type="email" value="">
            <input id="regpassword" type="password" value="">
            <input id="regline1" type="text" value="">
            <input id="regline2" type="text" value="">
            <input id="regcity" type="text" value="">
            <input id="regstate" type="text" value="">
            <input id="regpostalcode" type="text" value="">
            <input id="regsubmit" type="submit" value="Register">
        </form>
        <div id="errors"></div>
    </body></html>`);
    window = dom.window;
    document = window.document;
    global.document = document; // Expose document to global scope
    global.window = window; // Expose window to global scope
    window.eval(registerScript); // Evaluate the script in the context of the new window
});

test('Register submit button should be disabled when any field is empty', () => {
    const registerSubmit = document.querySelector('#regsubmit');
    const regFName = document.querySelector('#regfname');
    const regLName = document.querySelector('#reglname');
    const regEmail = document.querySelector('#regemail');
    const regPassword = document.querySelector('#regpassword');
    const regLine1 = document.querySelector('#regline1');
    const regLine2 = document.querySelector('#regline2')
    const regCity = document.querySelector('#regcity');
    const regState = document.querySelector('#regstate');
    const regPostalCode = document.querySelector('#regpostalcode');

    // Make sure register submit button is initially disabled
    expect(registerSubmit.disabled).toBe(true);

    // Simulate user filling out some fields
    regFName.value = 'John';
    regLName.value = 'Doe';
    regEmail.value = 'john.doe@example.com';
    regPassword.value = '';
    regLine1.value = '123 Main St';
    regCity.value = 'Anytown';
    regState.value = 'CA';
    regPostalCode.value = '12345';

    checkInputs();
    // Check if the register submit button is still disabled
    expect(registerSubmit.disabled).toBe(true);
});

test('Register submit button should be enabled when all fields are filled properly', () => {
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

    // Fill out all fields
    regFName.value = 'John';
    regLName.value = 'Doe';
    regEmail.value = 'john.doe@example.com';
    regPassword.value = 'password';
    regLine1.value = '123 Main St';
    regLine2.value = '456 Road';
    regCity.value = 'Anytown';
    regState.value = 'CA';
    regPostalCode.value = '12345';

    checkInputs();
    // Check if the register submit button is enabled
    expect(registerSubmit.disabled).toBe(false);
});
