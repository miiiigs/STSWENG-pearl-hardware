document.addEventListener("DOMContentLoaded", async function () {
    const createBundleBtn = document.getElementById("createBundleBtn");
    const bundleModal = document.getElementById("bundleModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const bundlesForm = document.getElementById("bundlesForm");
    const productList = document.getElementById("productList");
    const createBundleSubmitBtn = document.getElementById("createBundleSubmitBtn");
    const updateBundleSubmitBtn = document.getElementById("updateBundleSubmitBtn");
    

    async function displayBundles() {
        try {
            const bundlesContainer = document.querySelector(".grid");
            bundlesContainer.innerHTML = ""; // Clear previous content
    
            const response = await fetch("/bundles");
            if (!response.ok) {
                throw new Error("Failed to fetch bundles");
            }
            const bundles = await response.json();
    
            bundles.forEach(bundle => {
                const bundleElement = document.createElement("div");
                bundleElement.classList.add("bg-white", "shadow-md", "rounded-lg", "p-4");
                bundleElement.innerHTML = `
                    <h2 class="text-lg font-semibold">${bundle.name}</h2>
                    <p class="text-gray-600">${bundle.description}</p>
                    <div class="mt-4">
                        <p class="text-gray-800 font-bold">Price: ${bundle.price}</p>
                        <button id="editBundleBtn_${bundle._id}" class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded mt-2 editBundleBtn" data-bundle-id="${bundle._id}">Edit Bundle</button>
                        <button id="deleteBundleBtn_${bundle._id}" class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded mt-2 deleteBundleBtn" data-bundle-id="${bundle._id}">Delete Bundle</button>
                    </div>
                `;
                bundlesContainer.appendChild(bundleElement);

    
        // Add event listener for "Edit Bundle" button
        const editButton = bundleElement.querySelector(`#editBundleBtn_${bundle._id}`);
        editButton.addEventListener('click', async function(event) {
            const bundleId = this.getAttribute('data-bundle-id');
            console.log('Clicked on Edit Bundle button with id:', this.id, 'for bundle ID:', bundleId);
            
            // Open edit form
            try {
                // Fetch the bundles again to get the latest data
                const response = await fetch("/bundles");
                if (!response.ok) {
                    throw new Error("Failed to fetch bundles for editing");
                }
                const bundles = await response.json();
                
                // Find the index of the bundle being edited
                const bundleIndex = bundles.findIndex(bundle => bundle._id === bundleId);
                if (bundleIndex === -1) {
                    throw new Error("Bundle not found for editing");
                }
                const bundleData = bundles[bundleIndex];
                
                // Populate form fields with bundle data
                document.getElementById("bundleName").value = bundleData.name;
                document.getElementById("bundleDescription").value = bundleData.description;
                document.getElementById("bundlePrice").value = bundleData.price;
                // Store bundleId as a data attribute on the form
                document.getElementById("bundlesForm").setAttribute('data-bundle-id', bundleId);
                // Change modal title to indicate editing
                document.getElementById("bundleModalTitle").textContent = "Edit Bundle";
                createBundleSubmitBtn.classList.add("hidden");
                updateBundleSubmitBtn.classList.remove("hidden");
                // Show the modal for editing bundle
                bundleModal.classList.remove("hidden");

                document.getElementById("updateBundleSubmitBtn").addEventListener("click", async function(event) {
                    event.preventDefault();
                    const formData = new FormData(document.getElementById("bundlesForm"));
                    const bundleId = document.getElementById("bundlesForm").getAttribute('data-bundle-id'); 
                
                    // Convert formData to JSON
                    const formDataJSON = Object.fromEntries(formData.entries());
                
                    try {
                        // Send form data to server to update the bundle
                        const response = await fetch(`/ebundles/${bundleId}`, {
                            method: "PUT",
                            body: JSON.stringify(formDataJSON), // Convert to JSON
                            headers: {
                                'Content-Type': 'application/json' // Specify content type
                            }
                        });
                
                        if (response.ok) {
                            window.location.reload(); // Reload the page to reflect changes
                        } else {
                            console.error("Failed to update bundle");
                        }
                    } catch (error) {
                        console.error("Error:", error);
                    }
                });
            } catch (error) {
                console.error("Error:", error);
            }
        });



                // Add event listener for "Delete Bundle" button
                const deleteButton = bundleElement.querySelector(`#deleteBundleBtn_${bundle._id}`);
                deleteButton.addEventListener('click', async function(event) {
                    const bundleId = this.getAttribute('data-bundle-id');
                    const confirmDelete = confirm("Are you sure you want to delete this bundle?");
                    if (confirmDelete) {
                        try {
                            const response = await fetch(`/dbundles/${bundleId}`, {
                                method: 'DELETE'
                            });
                            if (response.ok) {
                                console.log('Bundle deleted successfully');
                                displayBundles();
                            } else {
                                console.error('Failed to delete bundle');
                            }
                        } catch (error) {
                            console.error('Error deleting bundle:', error);
                        }
                    }
                });
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }
    
    
// Handle form submission for creating bundle
bundlesForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Retrieve form data
    const formData = new FormData(bundlesForm);

    // Collect IDs of selected products
    const selectedProducts = Array.from(productList.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

    // Add selected products to form data
    formData.append('products', selectedProducts);

    // Convert formData to JSON
    const formDataJSON = Object.fromEntries(formData.entries());

    try {
        // Send form data to server to create a new bundle
        const response = await fetch("/cbundles", {
            method: "POST",
            body: JSON.stringify(formDataJSON), // Convert to JSON
            headers: {
                'Content-Type': 'application/json' // Specify content type
            }
        });

        if (response.ok) {
            window.location.reload(); // Reload the page to reflect changes
        } else {
            console.error("Failed to create bundle");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});



    // Function to fetch and display products
    async function displayProducts() {
        try {
            // Fetch products from the server
            const response = await fetch("/bundleproducts");
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const products = await response.json();

            // Display each product in the product list
            products.forEach(product => {
                // Create container for product
                const productContainer = document.createElement("div");
                productContainer.classList.add("product");

                // Create image element for product picture
                const productImage = document.createElement("img");
                productImage.src = product.productpic;
                productImage.alt = product.name;
                productContainer.appendChild(productImage);

                // Create paragraph for product name
                const productName = document.createElement("p");
                productName.textContent = product.name;
                productContainer.appendChild(productName);

                // Create paragraph for product price
                const productPrice = document.createElement("p");
                productPrice.textContent = `${product.price}`;
                productContainer.appendChild(productPrice);

                // Create checkbox for product selection
                const productCheckbox = document.createElement("input");
                productCheckbox.type = "checkbox";
                productCheckbox.name = "products";
                productCheckbox.value = product._id;
                productContainer.appendChild(productCheckbox);

                // Append product container to product list
                productList.appendChild(productContainer);
            });
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    // Show modal when "Create New Bundle" button is clicked
    createBundleBtn.addEventListener("click", function () {
        bundleModal.classList.remove("hidden");
        createBundleSubmitBtn.classList.remove("hidden");
        updateBundleSubmitBtn.classList.add("hidden");
        // Reset modal title to default for creating new bundle
        document.getElementById("bundleModalTitle").textContent = "Create New Bundle";
        // Reset bundle ID in form data
        bundlesForm.querySelector('input[name="bundleId"]').value = "";
    });

    // Close modal when "Cancel" button is clicked
    closeModalBtn.addEventListener("click", function () {
        bundleModal.classList.add("hidden");
    });

    // Display existing bundles and products when the page is loaded
    await displayBundles();
    await displayProducts();
});
