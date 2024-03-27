const regLog = document.querySelector('#regLog');
const myAccount = document.querySelector('#myAccount')
const nextPage = document.querySelector('#nextPage');
const prevPage = document.querySelector('#prevPage');

function checkPages() {
	try{
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
	}catch{}
}

checkPages();

async function initializeUserStatus(){
    const response = await fetch('/getUser', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(response.status == 200){
        regLog.style.visibility = "hidden";
        myAccount.style.visibility = "visible";      
    }else if(response.status == 400){
        console.log("failed to get current user")
        regLog.style.visibility = "visible";
        myAccount.style.visibility = "hidden";
    }
}

initializeUserStatus();


window.onload = function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const query = urlSearchParams.get('sortBy');
    const selectedOption = document.querySelector(`#sort option[value="${query}"]`);
    if (selectedOption) {
        selectedOption.selected = true;
    }
};

const sortSelect = document.querySelector('#sort');
sortSelect.addEventListener('change', async (e) => {
    e.preventDefault();
    var sortValue = sortSelect.value;
    const currentURL = window.location.pathname;
    var queryVal = document.querySelector('#product_query').value;
    let actionURL;
    if (currentURL == "/searchProducts") {
        actionURL = '/.' + currentURL + '?product_query=' + queryVal + '&sortBy=' + sortValue;
    } else {
        actionURL = '/.' + currentURL + '?sortBy=' + sortValue;
    }
    console.log(actionURL);

    const response = await fetch(actionURL, {
        method: 'GET',
    });

    window.sessionStorage.setItem('sortOption', sortValue); // Store selected sorting option in session storage

    window.location.href = actionURL;
});

// Function to get sort option from session storage
function getSortOptionFromStorage() {
    return window.sessionStorage.getItem('sortOption');
}

// Function to set sort option in select dropdown
function setSortOptionInDropdown() {
    const sortOption = getSortOptionFromStorage();
    if (sortOption) {
        const selectedOption = document.querySelector(`#sort option[value="${sortOption}"]`);
        if (selectedOption) {
            selectedOption.selected = true;
        }
    }
}

window.onload = function() {
    setSortOptionInDropdown();
};

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
    const parts = currentURL.split('/'); 
    const lastPart = parts[parts.length - 1]; 


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
