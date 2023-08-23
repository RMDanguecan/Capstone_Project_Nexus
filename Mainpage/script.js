window.onload = function() {
    $(document).ready(function() {
       
        $.ajax({
            url: '../API/get_products.php', 
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    const productsContainer = $('#recentlyAddedProducts');
                    data.data.forEach(product => {
                        const productDiv = $('<div class="col-3"></div>');

                       
                        const fullImageUrl = `../${product.productImage}`; 

                        productDiv.html(`
                            <img src="${fullImageUrl}" alt="${product.productName}">
                            <h4>${product.productName}</h4>
                        `);
                        productsContainer.append(productDiv);
                    });
                } else {
                    console.error('Failed to fetch products:', data.message);
                }
            },
            error: function(error) {
                console.error('Error fetching products:', error);
            }
        });
    });
};



document.addEventListener("DOMContentLoaded", function() {
    const logoutLink = document.querySelector('.logout');
    logoutLink.addEventListener('click', function(event) {
        event.preventDefault();
        logout();
    });
});

function logout() {
    $.ajax({
        url: '../API/logout.php',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                sessionStorage.setItem('loggedOut', 'true');
                window.location.replace('../index.html');
            } else {
                console.error('Logout failed.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}








