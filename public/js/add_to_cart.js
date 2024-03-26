const quant_field = document.querySelector("#quantity");
const btn = document.querySelector("#submitBtn");
const err = document.querySelector("#err");

quant_field.addEventListener("change", checkQuantity);

function checkQuantity() { //this function disables the add to cart button until a quantity (greater than 0) has been filled in
	console.log(quant_field.dataset.index);
    if(quant_field.value <= 0 || quant_field.value > parseInt(quant_field.dataset.index)){
		btn.disabled = true;
		console.log("button disabled!");
        err.textContent = "Please input a quantity greater than 0. Or if you want to order more than the current stock please contact the company for further details";
    }else{
        console.log("button enabled!");
        btn.disabled = false;
		err.textContent="";
	}
}

checkQuantity();

btn.addEventListener('click', async (e) => {
    e.preventDefault();

    console.log("Submit button was clicked");
    
	const quant = quant_field.value;
	const id = document.querySelector("#p_id").value;

	const jString = JSON.stringify({quant, id});

	const response = await fetch('/add-to-cart', {
		method: "POST",
		body: jString,
		headers: {
			"Content-Type": "application/json"
		}
	});
	window.location.href=("/cart");
})
