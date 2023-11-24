
window.onload = function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const query = urlSearchParams.get('sortBy');
    const selectedOption = document.querySelector(`#sort option[value="${query}"]`);
    selectedOption.selected = true;
  };

const sortSelect = document.querySelector('#sort');
sortSelect.addEventListener('change', async (e) => {
    e.preventDefault();
    var sortValue = sortSelect.value;
	const searchValue = document.querySelector('#product_query').value;
    const currentURL = window.location.pathname;
    //console.log('.' + currentURL + '?sortBy=' + sortValue);
	//console.log(currentURL);
	if(currentURL == "/adminInventory"){
		console.log("I am in admin");
		var actionURL = '/.' + currentURL + '?sortBy=' + sortValue;
	}
	else if(currentURL == "/searchInventory"){
		console.log("I am in search");
		var actionURL = '/.' + currentURL + '?product_query=' + searchValue + '&sortBy=' + sortValue;
		
	}
	console.log(actionURL);
	const response = await fetch(actionURL, {method: 'GET'});
	window.location.href = actionURL;    
});
