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

