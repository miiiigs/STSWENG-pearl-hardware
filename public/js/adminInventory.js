const title = document.querySelector('#title');

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