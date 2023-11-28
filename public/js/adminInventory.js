const title = document.querySelector('#title');
const nextPage = document.querySelector('#nextPage');
const prevPage = document.querySelector('#prevPage');

function checkPages() {
    if(nextPage.dataset.index == "false"){
        console.log("FALSE");
        nextPage.style.visibility = "hidden";
    }else{
        console.log("TRUE");
        nextPage.style.visibility = "visible";
    }
    if(prevPage.dataset.index == "false"){
        console.log("FALSE");
        prevPage.style.visibility = "hidden";
    }else{
        console.log("TRUE");
        prevPage.style.visibility = "visible";
    }
}

checkPages();

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

    const response = await fetch('/changePageStore/' + lastWord, {
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

    const response = await fetch('/changePageStore/' + lastWord, {
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