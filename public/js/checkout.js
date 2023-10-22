
const priceHBS = document.querySelector('#price');
const amountHBS = document.querySelector('#amount');
const submit = document.querySelector('#submit');

submit.addEventListener('click', async function (){

    items = ['651d0b1f95c615eb89ebcaf1',  '651d0b1f95c615eb89ebcaf2', '651d0b1f95c615eb89ebcaef']
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