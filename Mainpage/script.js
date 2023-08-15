window.onload = function() {
    $(document).ready(function() {
        // Fetch and display products using AJAX
        $.ajax({
            url: '../get_products.php', // Replace with your actual API endpoint
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    const productsContainer = $('#recentlyAddedProducts');
                    data.data.forEach(product => {
                        const productDiv = $('<div class="col-3"></div>');

                        // Construct the full image URL without an additional 'uploads/' segment
                        const fullImageUrl = `../${product.productImage}`; // Adjust this based on your folder structure

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