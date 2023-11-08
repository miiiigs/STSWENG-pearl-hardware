
const priceHBS = document.querySelector('#price');
const amountHBS = document.querySelector('#amount');
const submit = document.querySelector('#submit');

submit.addEventListener('click', async function (){

    items = ['65398c317e23cd12376c2d9b',  '65398c317e23cd12376c2d9c', '65398c317e23cd12376c2d99']
    amount = [1,2,3];


    const jString = JSON.stringify({items, amount});

    const response = await fetch('/postCheckout', {
        method: "POST",
        body: jString,
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(response.status == 200){
        const checkout_url = await response.text();
        window.location.href = checkout_url
    }
    
})