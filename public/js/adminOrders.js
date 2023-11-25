const cancel = document.querySelectorAll('#cancel');
const AP = document.querySelectorAll('#AP');
const PS = document.querySelectorAll('#PS');
const OP = document.querySelectorAll('#OP');
const IT = document.querySelectorAll('#IT');
const D = document.querySelectorAll('#D');
const orderInstance = document.querySelectorAll('#orderInstance');
const title = document.querySelector('#title');
const nextPage = document.querySelector('#nextPage');
const prevPage = document.querySelector('#prevPage');

console.log(cancel)

cancel.forEach(button => { button.addEventListener('click', async (e) => {
        e.preventDefault();

        const id = button.dataset.index;
        //console.log(id);

        const jString = JSON.stringify({id});

        const response = await fetch('/cancelChange', {
            method: "POST",
            body: jString,
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(response.status == 200){
            location.reload(true);
        }else{
            console.log("error has occured");
        }


    })
})

AP.forEach(button => {
    button.addEventListener('click', async (e) => {
        const orderID = e.target.closest('#dropdownMenu').dataset.index;
        const status = "awaitingPayment";

        const jString = JSON.stringify({orderID, status});

        const response = await fetch('/statusChange', {
            method: "POST",
            body: jString,
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(response.status == 200){
            location.reload(true);
        }else{
            console.log("error has occured");
        }
    });
});

PS.forEach(button => {
    button.addEventListener('click', async (e) => {
        const orderID = e.target.closest('#dropdownMenu').dataset.index;
        const status = "succeeded";

        const jString = JSON.stringify({orderID, status});

        const response = await fetch('/statusChange', {
            method: "POST",
            body: jString,
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(response.status == 200){
            location.reload(true);
        }else{
            console.log("error has occured");
        }
    });
});

OP.forEach(button => {
    button.addEventListener('click', async (e) => {
        const orderID = e.target.closest('#dropdownMenu').dataset.index;
        const status = "orderPacked";

        const jString = JSON.stringify({orderID, status});

        const response = await fetch('/statusChange', {
            method: "POST",
            body: jString,
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(response.status == 200){
            location.reload(true);
        }else{
            console.log("error has occured");
        }
    });
});

IT.forEach(button => {
    button.addEventListener('click', async (e) => {
        const orderID = e.target.closest('#dropdownMenu').dataset.index;
        const status = "inTransit";

        const jString = JSON.stringify({orderID, status});

        const response = await fetch('/statusChange', {
            method: "POST",
            body: jString,
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(response.status == 200){
            location.reload(true);
        }else{
            console.log("error has occured");
        }
    });
});

D.forEach(button => {
    button.addEventListener('click', async (e) => {
        const orderID = e.target.closest('#dropdownMenu').dataset.index;
        const status = "delivered";

        const jString = JSON.stringify({orderID, status});

        const response = await fetch('/statusChange', {
            method: "POST",
            body: jString,
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(response.status == 200){
            location.reload(true);
        }else{
            console.log("error has occured");
        }
    });
});

orderInstance.forEach(button => {
    button.addEventListener('click', async (e) => {
        const orderID = button.dataset.index;

        const response = await fetch('/adminOrderDetails/' + orderID, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(response.status == 200){
            window.location.href = '/adminOrderDetails/' + orderID;
        }else{
            console.log("error has occured");
        }

    });
});

title.addEventListener('click', async (e) => {
    e.preventDefault();

    console.log("TITLE CLICKED");

    const response = await fetch('/getUser', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(response.status == 200){
        window.location.href = '/admin';
    }else{
        console.log("error has occured");
    }

})

nextPage.addEventListener('click', async (e) => {
    e.preventDefault();

    console.log("Next Page");

    const currentURL = window.location.pathname;
    const parts = currentURL.split('/'); // Split the URL by '/'
    const lastPart = parts[parts.length - 1]; // Get the last part after the last '/'

    // If there's a query string, remove it
    const lastWord = lastPart.split('?')[0];
    console.log(lastWord);

    const change = "next";

    const jString = JSON.stringify({change});

    const response = await fetch('/changePageAdminCategory/' + lastWord, {
        method: "POST",
        body: jString,
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(response.status == 200){
        //console.log(currentURL);
        window.location.href = currentURL;
    }else{
        console.log("error next page");
    }
})

prevPage.addEventListener('click', async (e) => {
    e.preventDefault();

    console.log("Prev Page");

    const currentURL = window.location.pathname;
    const parts = currentURL.split('/'); // Split the URL by '/'
    const lastPart = parts[parts.length - 1]; // Get the last part after the last '/'

    // If there's a query string, remove it
    const lastWord = lastPart.split('?')[0];
    console.log(lastWord);

    const change = "prev";

    const jString = JSON.stringify({change});

    const response = await fetch('/changePageAdminCategory/' + lastWord, {
        method: "POST",
        body: jString,
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(response.status == 200){
        window.location.href = currentURL;
    }else{
        console.log("error next page");
    }
})

