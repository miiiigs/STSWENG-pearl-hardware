const nextPage = document.querySelector('#nextPage');
const prevPage = document.querySelector('#prevPage');
const orderInstance = document.querySelectorAll('#orderInstance');
const title = document.querySelector('#title');

window.onload = function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const query = urlSearchParams.get('sortBy');
    const selectedOption = document.querySelector(`#sort option[value="${query}"]`);
    selectedOption.selected = true;
};

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

try{ //if sort box even exists
	const sortSelect = document.querySelector('#sort');
	sortSelect.addEventListener('change', async (e) => {
		e.preventDefault();
		var sortValue = sortSelect.value;
		const currentURL = window.location.pathname;
		var queryVal = document.querySelector('#product_query').value;
		const URLSplit = currentURL.split("/");
		console.log(currentURL);
		if(URLSplit[1] == "userpurchases"){
			var actionURL = '/.' + currentURL + '?sortBy=' + sortValue;
		}
		console.log(actionURL);
		
		const response = await fetch(actionURL, {
			method: 'GET',
		});
		
		window.location.href = actionURL; 
	});
}
catch{}

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

    const response = await fetch('/changePageUserPurchases/' + lastWord, {
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

    const response = await fetch('/changePageUserPurchases/' + lastWord, {
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

orderInstance.forEach(button => {
    button.addEventListener('click', async (e) => {
        const orderID = button.dataset.index;

        const response = await fetch('/userorderdetails/' + orderID, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(response.status == 200){
            window.location.href = '/userorderdetails/' + orderID;
        }else{
            console.log("error has occured");
        }

    });
});

title.addEventListener('click', async (e) => {
    e.preventDefault();

    window.location.href = '/';
})
