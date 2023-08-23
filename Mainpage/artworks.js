

window.onload = function () {
    $(document).ready(function () {

        $.ajax({
            url: '../API/get_products.php',
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    const productsContainer = $('#artworks');
                    data.data.forEach(product => {
                        const productDiv = $(`<div class="col-3" data-product-id="${product.id}"></div>`);

                        const fullImageUrl = `../${product.productImage}`;
                        productDiv.html(`
                            <img src="${fullImageUrl}" alt="${product.productName}">
                            <h4>${product.productName}</h4> 
                        `);

                        productDiv.click(() => {
                            const productId = product.id;
                            console.log("Clicked productId:", productId);

                            fetch(`../API/cartmodal.php?id=${productId}`)
                                .then(response => response.json())
                                .then(productData => {
                                    console.log("Product data:", productData);
                                    const product = productData.data[0];
                                    openModal(product);
                                })
                                .catch(error => {
                                    console.error("Error fetching product details:", error);
                                });
                        });

                        productsContainer.append(productDiv);
                    });

                   
                    
                } else {
                    console.error('Failed to fetch products:', data.message);
                }
            },
            error: function (error) {
                console.error('Error fetching products:', error);
            }
        });
     });

    
                
 
    

    
    
    document.addEventListener("DOMContentLoaded", function () {
        const logoutLink = document.querySelector('.logout');
        logoutLink.addEventListener('click', function (event) {
            event.preventDefault();
            logout();
        });
    });
    
    function logout() {
        $.ajax({
            url: '../API/logout.php',
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    sessionStorage.setItem('loggedOut', 'true');
                    window.location.replace('../index.html');
                } else {
                    console.error('Logout failed.');
                }
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }
    
    
    
    
  
    const modal = document.getElementById("productModal");
    const modalProductName = document.getElementById("modalProductName");
    const modalProductDescription = document.getElementById("modalProductDescription");
    const modalProductPrice = document.getElementById("modalProductPrice");
    const modalProductImage = document.getElementById("modalProductImage");
    const addToCartButton = document.getElementById("addToCartButton");
    
    function openModal(product) {
        modalProductName.textContent = product.productName;
        modalProductDescription.textContent = product.description;
        
        if (product.price !== undefined) {
            const formattedPrice = `&#8369;${parseFloat(product.price).toFixed(2)}`;
            modalProductPrice.innerHTML = `Price: ${formattedPrice}`;
        } else {
            modalProductPrice.textContent = 'Price: N/A';
        }
    
        modalProductImage.src =  `../${product.productImage}`;
        addToCartButton.dataset.productId = product.id;
        modal.style.display = "block";
    }
    
    
    modal.querySelector(".close").addEventListener("click", () => {
        modal.style.display = "none";
    });
    
 
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
    
    
    addToCartButton.addEventListener("click", (event) => {
        const productId = event.target.dataset.productId;
       
        console.log(`Adding product with ID ${productId} to cart`);
    });
    
}
    
const modalProductQuantity = document.getElementById("modalProductQuantity");
const minusBtn = document.querySelector(".quantity-btn.minus");
const plusBtn = document.querySelector(".quantity-btn.plus");

minusBtn.addEventListener("click", () => {
    if (modalProductQuantity.value > 1) {
        modalProductQuantity.value--;
    }
});

plusBtn.addEventListener("click", () => {
    modalProductQuantity.value++;
});


let cart = {}; // Change const to let

addToCartButton.addEventListener("click", (event) => {
    const productId = event.target.dataset.productId;
    const quantity = parseInt(modalProductQuantity.value);

    if (productId && !isNaN(quantity) && quantity > 0) {
        if (cart[productId]) {
            cart[productId] += quantity;
        } else {
            cart[productId] = quantity;
        }

        updateCartItemCount(); // Update cart icon item count
        console.log(`Added ${quantity} product(s) with ID ${productId} to cart`);

        // Save updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
    } else {
        console.error("Invalid product ID or quantity.");
    }

    updateCartItemCount(); // Update cart icon item count to 1
});

function updateCartItemCount() {
    const cartItemCountElement = document.getElementById("cartItemCount");
    const totalItemsInCart = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
    cartItemCountElement.textContent = totalItemsInCart;
}

// Load cart contents from localStorage and update cart item count on page load
document.addEventListener("DOMContentLoaded", function () {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    cart = storedCart;

    updateCartItemCount();
});