const priceHBS = document.querySelector('#price');
const amountHBS = document.querySelector('#amount');
const submit = document.querySelector('#submit');

submit.addEventListener('click', async function (){

    items = []
    amount = [];

    const cart = await fetch('/getCartItems' , {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(cart.status == 200){
        //console.log(await cart.json());
        const theCart = await cart.json();
        console.log(theCart);

        for(let x = 0; x < theCart.length; x++){
            items.push(theCart[x].product._id);
            amount.push(parseInt(theCart[x].quantity));
        }

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
            submit.textContent = "Checkout"
        }
        if(response.status == 401){
            submit.textContent = "Amount needs to be greater than 20 pesos"
        }
    }
    
})