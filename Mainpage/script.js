

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

async function getProductById(productId) {
    try {
        const response = await fetch(`../API/cartmodal.php?id=${productId}`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            return data.data[0]; 
        } else {
            console.error("Product not found or API error:", data.message);
            return null;
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

let cart = {};

addToCartButton.addEventListener("click", (event) => {
    const productId = event.target.dataset.productId;
    const quantity = parseInt(modalProductQuantity.value);

    if (productId && !isNaN(quantity) && quantity > 0) {
        if (cart[productId]) {
            cart[productId] += quantity;
        } else {
            cart[productId] = quantity;
        }

        updateCartItemCount();
        console.log(`Added ${quantity} product(s) with ID ${productId} to cart`);

        localStorage.setItem("cart", JSON.stringify(cart));

      
        const successMessage = document.getElementById("successMessage");
        successMessage.style.display = "block";
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 1000); 
    } else {
        console.error("Invalid product ID or quantity.");
    }

    updateCartItemCount();
});

function updateCartItemCount() {
    const cartItemCountElement = document.getElementById("cartItemCount");
    const totalItemsInCart = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
    cartItemCountElement.textContent = totalItemsInCart;

   
}

document.addEventListener("DOMContentLoaded", function () {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    cart = storedCart;

    updateCartItemCount();
});

const cartButton = document.getElementById("cart-button");
const cartModal = document.getElementById("cartModal");
const closeBtn = document.querySelector(".cartClose");
const cartItemList = document.getElementById("cartItemList");

cartButton.addEventListener("click", () => {
    cartModal.style.display = "block";
    populateCartModal();
});

closeBtn.addEventListener("click", () => {
    console.log("Close button clicked"); 
    cartModal.style.display = "none";
});



async function populateCartModal() {
    cartItemList.innerHTML = ""; 

    const cartData = JSON.parse(localStorage.getItem("cart")) || {};

    for (const productId in cartData) {
        if (cartData.hasOwnProperty(productId)) {
            const product = await getProductById(productId); 
            if (product) {
                addCartItem(product, cartData[productId]);
            }
        }
    }
   
}

function addCartItem(product, quantity) {
    const cartTableBody = document.getElementById("cartItemList");

    const row = document.createElement("tr");
    row.setAttribute("data-product-id", product.id);

    const productImageCell = document.createElement("td");
    const productImage = document.createElement("img");
    productImage.src = `../${product.productImage}`;
    productImage.alt = product.productName;
    productImage.style.maxWidth = "60px"; 
    productImageCell.appendChild(productImage);

    const productNameCell = document.createElement("td");
    productNameCell.textContent = product.productName;

    const productPriceCell = document.createElement("td");
    if (product.price !== undefined) {
        const formattedPrice = `&#8369;${parseFloat(product.price).toFixed(2)}`;
        productPriceCell.innerHTML = `Price: ${formattedPrice}`;
    } else {
        productPriceCell.textContent = 'Price: N/A';
    }

   

    const productQuantityCell = document.createElement("td");
    const minusButton = document.createElement("button");
    minusButton.textContent = "-";
    minusButton.classList.add("quantity-button", "minus-button");
    minusButton.dataset.productId = product.id;
    const plusButton = document.createElement("button");
    plusButton.textContent = "+";
    plusButton.classList.add("quantity-button", "plus-button");
    plusButton.dataset.productId = product.id;

    const quantityDisplay = document.createElement("span");
    quantityDisplay.textContent = quantity;
    
    productQuantityCell.appendChild(minusButton);
    productQuantityCell.appendChild(quantityDisplay);
    productQuantityCell.appendChild(plusButton);


    const productTotalCell = document.createElement("td");
    if (product.price !== undefined) {
        const total = product.price * quantity;
        productTotalCell.innerHTML = `&#8369;${total.toFixed(2)}`;
    } else {
        productTotalCell.textContent = 'Total: N/A';

    
    }



   
    const deleteButtonCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.dataset.productId = product.id; 
    deleteButtonCell.appendChild(deleteButton);
    
    deleteButton.addEventListener("click", () => {
        deleteCartItem(product.id); 
        populateCartModal(); 
    });

    
    row.appendChild(productImageCell);
    row.appendChild(productNameCell);
    row.appendChild(productPriceCell);
    row.appendChild(productQuantityCell);
    row.appendChild(productTotalCell);
    row.appendChild(deleteButtonCell);

    cartTableBody.appendChild(row);

    minusButton.addEventListener("click", () => {
        updateCartItemQuantity(product.id, Math.max(quantity - 1, 1));
    });
    
    plusButton.addEventListener("click", () => {
        updateCartItemQuantity(product.id, quantity + 1);
    });


    updateCartDisplay();

}



document.getElementById("cartItemList").addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-button")) {
        const productRow = event.target.closest("tr");
        const productId = productRow.getAttribute("data-product-id");

        
      

        deleteCartItem(productId, productRow);


       
        
    }
});

function updateCartItemQuantity(productId, newQuantity) {
    cart[productId] = newQuantity;
    updateCartItemCount();
    localStorage.setItem("cart", JSON.stringify(cart));
    populateCartModal(); 
 


    updateCartDisplay();
}


function deleteCartItem(productId) {
    
    
    
    delete cart[productId];
    updateCartItemCount(); 
    localStorage.setItem("cart", JSON.stringify(cart));

   
    

    updateCartDisplay();
}

async function calculateCartTotal() {
    let totalAmount = 0;

    for (const productId in cart) {
        const product = await getProductById(productId); 
        const quantity = cart[productId];

        

        if (product && product.price !== undefined) {
            totalAmount += product.price * quantity;
        }
    }

   

    return totalAmount;
}


function calculateTotalItemCount() {
    let totalCount = 0;

    for (const productId in cart) {
        totalCount += cart[productId];
    }

    return totalCount;
}

async function updateCartDisplay() {
    const totalAmount = await calculateCartTotal();
    const totalItemCount = calculateTotalItemCount();

    const totalAmountElement = document.getElementById("totalAmount");
    const totalItemCountElement = document.getElementById("totalItemCount");

    totalAmountElement.innerHTML = `Total Amount: &#8369;${totalAmount.toFixed(2)}`;
    totalItemCountElement.textContent = `Total Items: ${totalItemCount}`;
}

window.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});





const checkoutModal = document.getElementById("checkoutModal");


const fullNameInput = document.getElementById("fullName");
const contactNumberInput = document.getElementById("contactNumber");
const shippingAddressInput = document.getElementById("shippingAddress");
const modalTotalItems = document.getElementById("modalTotalItems");
const modalTotalAmount = document.getElementById("modalTotalAmount");


const checkoutButton = document.getElementById("checkoutButton");
checkoutButton.addEventListener("click", async () => {
    // Populate modal data
    const totalAmount = await calculateCartTotal();
    const totalItems = calculateTotalItemCount();
    
    console.log("Total Amount:", totalAmount.toFixed(2));
    console.log("Total Items:", totalItems);

    modalTotalItems.textContent = totalItems;
    modalTotalAmount.textContent = totalAmount.toFixed(2);

   
    document.getElementById("modalTotalAmountInput").value = totalAmount.toFixed(2);
    document.getElementById("modalTotalItemsInput").value = totalItems;

    cartModal.style.display = "none";
    checkoutModal.style.display = "block";
});


const modalCloseShipping = checkoutModal.querySelector(".modal-close-shipping");
modalCloseShipping.addEventListener("click", () => {
    checkoutModal.style.display = "none";
});


const confirmShippingButton = document.getElementById("confirmShipping");
confirmShippingButton.addEventListener("click", () => {
    const fullName = fullNameInput.value;
    const contactNumber = contactNumberInput.value;
    const shippingAddress = shippingAddressInput.value;

    console.log("Full Name:", fullName);
    console.log("Contact Number:", contactNumber);
    console.log("Shipping Address:", shippingAddress);



    checkoutModal.style.display = "none";

   


 
    alert("Thank you for purchasing!");
});

$(document).ready(function() {
    $("#confirmShipping").click(function(e) {
        e.preventDefault(); 

      
        var formData = $("#shippingForm").serialize();
       
        
      
        console.log("Form Data:", formData);

        $.ajax({
            type: "POST",
            url: "../API/checkout.php",
            data: formData,
            dataType: "json",
            success: function(response) {
            
            },
            error: function(xhr, status, error) {
           
            }
        });
    });
});
