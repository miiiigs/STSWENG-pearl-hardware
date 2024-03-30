// add_to_cart.test.js

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Read the add_to_cart.js file
const add_to_cartScript = fs.readFileSync(path.resolve(__dirname, '../public/js/add_to_cart.js'), 'utf-8');

let window;
let document;

beforeEach(() => {
  // Setup JSDOM
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  window = dom.window;
  document = window.document;

  // Create necessary DOM elements
  const quantityInput = document.createElement('input');
  quantityInput.id = 'quantity';
  document.body.appendChild(quantityInput);

  const submitButton = document.createElement('button');
  submitButton.id = 'submitBtn';
  document.body.appendChild(submitButton);

  const errorElement = document.createElement('div');
  errorElement.id = 'err';
  document.body.appendChild(errorElement);

  // Execute the add_to_cart.js file
  eval(add_to_cartScript);

  // Now that add_to_cart.js is executed, quant_field should be defined
  const quant_field = document.querySelector("#quantity");

  // Check if quant_field is not null before adding event listener
  if (quant_field) {
    quant_field.addEventListener("change", checkQuantity);
  }
});

test('Check if add to cart button is disabled when quantity is less than or equal to 0', () => {
  document.querySelector('#quantity').value = 0;

  window.checkQuantity();

  expect(document.querySelector('#submitBtn').disabled).toBe(true);
  expect(document.querySelector('#err').textContent).toContain('Please input a quantity greater than 0');
});

test('Check if add to cart button is enabled when quantity is greater than 0', () => {
  document.querySelector('#quantity').value = 5;
  document.querySelector('#quantity').dataset.index = 10; // assuming dataset index is set

  window.checkQuantity();

  expect(document.querySelector('#submitBtn').disabled).toBe(false);
  expect(document.querySelector('#err').textContent).toBe('');
});

test('Check if error message is displayed when quantity exceeds available stock', () => {
  document.querySelector('#quantity').value = 15;
  document.querySelector('#quantity').dataset.index = 10; // assuming dataset index is set

  window.checkQuantity();

  expect(document.querySelector('#submitBtn').disabled).toBe(true);
  expect(document.querySelector('#err').textContent).toContain('order more than the current stock');
});
