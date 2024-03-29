document.addEventListener("DOMContentLoaded", async function () {
    const createBundleBtn = document.getElementById("createBundleBtn");
    const bundleModal = document.getElementById("bundleModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const bundlesForm = document.getElementById("bundlesForm");
    const productList = document.getElementById("productList");


    // Handle form submission
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
            window.location.reload(); 
        } else {
            console.error("Failed to create bundle");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});


    // Function to fetch and display existing bundles
    async function displayBundles() {
        try {
            // Fetch existing bundles from the server
            const response = await fetch("/bundles");
            if (!response.ok) {
                throw new Error("Failed to fetch bundles");
            }
            const bundles = await response.json();

            // Display each bundle
            const bundlesContainer = document.querySelector(".grid");
            bundlesContainer.innerHTML = ""; // Clear previous content
            bundles.forEach(bundle => {
                const bundleElement = document.createElement("div");
                bundleElement.classList.add("bg-white", "shadow-md", "rounded-lg", "p-4");
                bundleElement.innerHTML = `
                    <h2 class="text-lg font-semibold">${bundle.name}</h2>
                    <p class="text-gray-600">${bundle.description}</p>
                    <div class="mt-4">
                        <p class="text-gray-800 font-bold">Price: ${bundle.price}</p>
                        <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded mt-2">Edit Price</button>
                    </div>
                `;
                bundlesContainer.appendChild(bundleElement);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }

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
    });

    // Close modal when "Cancel" button is clicked
    closeModalBtn.addEventListener("click", function () {
        bundleModal.classList.add("hidden");
    });

    // Display existing bundles and products when the page is loaded
    await displayBundles();
    await displayProducts();
});
