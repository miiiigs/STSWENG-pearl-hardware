const regLog = document.querySelector('#regLog');
const myAccount = document.querySelector('#myAccount');
const bundleContainer = document.querySelector('#bundleContainer');

async function initializeUserStatus() {
    try {
        // Fetch user status
        const response = await fetch('/getUser', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 200) {
            // User is logged in
            // Show user-related elements (e.g., myAccount)
            // regLog.style.visibility = "hidden";
            // myAccount.style.visibility = "visible";      
        } else if (response.status === 400) {
            // User is not logged in
            // Show login/register elements (e.g., regLog)
            // regLog.style.visibility = "visible";
            // myAccount.style.visibility = "hidden";
        }
    } catch (error) {
        console.error("Failed to get current user:", error);
    }
}

async function displayBundles() {
    try {
        const response = await fetch('/bundles');
        if (response.ok) {
            const bundles = await response.json();
            bundles.forEach(bundle => {
                const bundleBox = document.createElement('div');
                bundleBox.classList.add('bundle-box'); 
                bundleBox.innerHTML = `
                    <h2>${bundle.name}</h2>
                    <p>${bundle.description}</p>
                    <p>Price: ₱${bundle.price}</p>
                    <a href="/bundle/${bundle._id}" class="btn btn-primary mt-2">View Details</a>
                `;
                bundleContainer.appendChild(bundleBox);
            });
        } else {
            console.error("Failed to fetch bundles:", response.statusText);
        }
    } catch (error) {
        console.error("Failed to fetch bundles:", error);
    }
}


// Call functions to initialize user status and display bundles
initializeUserStatus();
displayBundles();
