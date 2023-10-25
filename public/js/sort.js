const regLog = document.querySelector('#regLog');
const myAccount = document.querySelector('#myAccount')

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
    selectedOption.selected = true;
  };

const sortSelect = document.querySelector('#sort');
sortSelect.addEventListener('change', async (e) => {
    e.preventDefault();
    var sortValue = sortSelect.value;
    const currentURL = window.location.pathname;
    console.log('.' + currentURL + '?sortBy=' + sortValue);
    const response = await fetch('/.' + currentURL + '?sortBy=' + sortValue, {
        method: 'GET',
    });
    

    window.location.href = '/.' + currentURL + '?sortBy=' + sortValue;

    
});