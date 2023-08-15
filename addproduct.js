function showForm(isUpdating) {
    const addProductForm = document.getElementById('addProductForm');
    addProductForm.style.display = 'block';
    addProductForm.classList.add('show-form');
    console.log('Add Product button clicked');

    if (isUpdating) {

        const closeButton = document.createElement('span');
        closeButton.classList.add('close');
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', hideForm);
        addProductForm.appendChild(closeButton);
    } else {

        const closeButton = document.querySelector('.close');
        if (closeButton) {
            closeButton.remove();
        }
    }

}

function clearFields() {
    const productNameInput = document.getElementById('productName');
    const categoryInput = document.getElementById('category');
    const priceInput = document.getElementById('price');
    const authorInput = document.getElementById('author');
    const productImageInput = document.getElementById('productImage');
    const selectedImageContainer = document.getElementById('selectedImageContainer');

    productNameInput.value = '';
    categoryInput.value = '';
    priceInput.value = '';
    authorInput.value = '';
    productImageInput.value = '';
    selectedImageContainer.innerHTML = '';
}

function hideForm() {
    const addProductForm = document.getElementById('addProductForm');
    addProductForm.style.display = 'none';
    addProductForm.classList.remove('show-form');


    const closeButton = document.getElementById('closeForm');
    if (closeButton) {
        closeButton.removeEventListener('click', hideForm);
        console.log('Close button clicked');
    }

    clearFields();
}

window.onload = function() {
    const addProductBtn = document.getElementById('addProductBtn');
    const closeButton = document.getElementById('closeForm');
    const addProductForm = document.getElementById('addProductForm');

    function handleFormSubmission(event) {
        event.preventDefault();
        addProduct();
    }


    document.getElementById('productForm').addEventListener('submit', handleFormSubmission);



    const closeImageModalButton = document.getElementById('closeImageModal');
    if (closeImageModalButton) {
        closeImageModalButton.addEventListener('click', () => {
            const modal = document.getElementById('imageModal');
            modal.style.display = 'none';
            addProductForm.style.display = 'block';
        });
    }


    const closeEnlargedImageButton = document.getElementById('closeEnlargedImage');
    if (closeEnlargedImageButton) {
        closeEnlargedImageButton.addEventListener('click', () => {
            const modal = document.getElementById('imageModal');
            modal.style.display = 'none';
            addProductForm.style.display = 'block';
        });
    }


    addProductBtn.addEventListener('click', showForm);


    if (closeButton) {
        closeButton.addEventListener('click', hideForm);
    }




    document.getElementById('productForm').addEventListener('submit', (event) => {
        event.preventDefault();
        hideForm();

    });
};

// ADD IMAGEclosecloseForm
document.getElementById('addImageBtn').addEventListener('click', () => {
    document.getElementById('productImage').click();
});

document.getElementById('productImage').addEventListener('change', (event) => {
    const reader = new FileReader();
    const input = event.target;

    if (input.files && input.files[0]) {
        const selectedImage = input.files[0];
        reader.onload = () => {
            const imageContainer = document.getElementById('selectedImageContainer');
            const image = new Image();

            image.src = reader.result;
            image.setAttribute('id', 'selectedImage');
            image.style.maxWidth = '150px';
            imageContainer.innerHTML = '';
            imageContainer.appendChild(image);


            image.addEventListener('click', () => {
                const modal = document.getElementById('imageModal');
                const enlargedImage = document.getElementById('enlargedImage');
                const formContainer = document.querySelector('.popup-form');
                const closeEnlargedImageButton = document.getElementById('closeEnlargedImage');

                modal.style.display = 'block';
                enlargedImage.src = image.src;
                formContainer.style.display = 'none';


                closeEnlargedImageButton.style.display = 'block';
            });


            const modal = document.getElementById('imageModal');
            modal.style.display = 'none';
            const addProductForm = document.getElementById('addProductForm');
            addProductForm.style.display = 'block';
        };

        reader.readAsDataURL(selectedImage);
    }
});

// ADD
function addProduct() {
    const formData = new FormData(document.getElementById('productForm'));
    const priceInput = document.getElementById("price");
    const priceValue = priceInput.value;
    const numericPrice = priceValue.replace(/[^0-9.]/g, "");
    const price = parseFloat(numericPrice);
    formData.append("price", price);


    const selectedImage = document.getElementById('selectedImage');
    if (selectedImage) {
        const dataURL = selectedImage.src;
        formData.append('productImage', dataURL);
    }

    fetch('add.php', {
            method: 'POST',
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {

                fetchProductData();
                alert('Product added successfully!');
            } else {
                console.error('Error adding product:', data.message);
                alert('Failed to add product. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while adding the product. Please try again.');
        });
}

let table;

function fetchProductData() {
    fetch('get_products.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayProducts(data.data);
            } else {
                console.error('Error fetching product data:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

// datatables
function displayProducts(products) {
    if (!table) {
        table = $('#productTable').DataTable({
            data: products,
            columns: [{
                    data: 'id',
                    title: 'ID'
                },
                {
                    data: 'productName',
                    title: 'Product Name'
                },
                {
                    data: 'category',
                    title: 'Category'
                },
                {
                    data: 'author',
                    title: 'Author'
                },
                {
                    data: 'price',
                    title: 'Price',
                    render: function(data, type, row) {
                        return '₱' + data; // Add the peso sign before the price value
                    }
                },
                {
                    data: 'productImage',
                    title: 'Product Image',
                    render: function(data, type, row) {
                        return '<img src="' + data + '" alt="Product Image" height="50">';
                    }
                },
                {
                    data: null,
                    title: 'Actions',
                    render: function(data, type, row) {
                        return `
                            <button class="update-button" data-id="${row.id}">Update</button>
                            <button class="delete-button" data-id="${row.id}">Delete</button>
                        `;
                    }
                }
            ],

        });
    } else {
        table.clear().rows.add(products).draw();
    }
}




function populateFormFields(productData) {
    if (!productData) {
        $('#id').val('');
        $('#productName').val('');
        $('#category').val('');
        $('#author').val('');
        $('#price').val('');
        $('#selectedImageContainer').empty();
    } else {
        console.log('Populating form fields with data:', productData);
        $('#id').val(productData.id);
        $('#productName').val(productData.productName);
        $('#category').val(productData.category);
        $('#author').val(productData.author);
        $('#price').val(productData.price);


        if (productData.productImage) {

            $('#selectedImageContainer').html(`<img src="${productData.productImage}" alt="Product Image" height="50">`);
        } else {

            const reader = new FileReader();
            reader.onload = () => {
                const imageContainer = document.getElementById('selectedImageContainer');
                const image = new Image();

                image.src = reader.result;
                image.setAttribute('id', 'selectedImage');
                image.style.maxWidth = '150px';
                imageContainer.innerHTML = '';
                imageContainer.appendChild(image);


            };

            reader.readAsDataURL(productData.productImageBinary);
        }


    }


}




$(document).ready(function() {


    async function getProductData(productId) {
        try {
            const response = await fetch(`getdata.php?id=${encodeURIComponent(productId)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product data');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);

        }
    }





    $(document).on('click', '.update-button', async function() {

        const productId = $(this).data('id');
        console.log('Edit button clicked. Product ID:', productId);


        const productData = await getProductData(productId);
        console.log('Product Data:', productData.data);

        if (productData && productData.success && productData.data) {

            populateFormFields(productData.data);


            showForm(true);
        } else {
            console.error('Product data not found or invalid:', productData);
        }
    });


    $('#productForm').on('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(document.getElementById('productForm'));


        const productId = formData.get('id');
        if (productId) {


        } else {

            formData.delete('id');


            fetch('add.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {

                        fetchProductData();
                        alert('Product added successfully!');
                    } else {
                        console.error('Error adding product:', data.message);
                        alert('Failed to add product. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while adding the product. Please try again.');
                });

            hideForm();
        }
    });



    console.log("DOM is ready. You can start manipulating DOM elements here.");
    fetchProductData();
});



// DELETE







document.getElementById('productTable').addEventListener('click', async function(event) {
    const deleteButton = event.target;
    if (deleteButton.classList.contains('delete-button')) {
        const productId = deleteButton.getAttribute('data-id');
        console.log('Delete button clicked. Product ID:', productId);


        const confirmed = window.confirm('Are you sure you want to delete this product?');

        if (confirmed) {
            try {

                const deleteResult = await deleteProduct(productId);

                if (deleteResult && deleteResult.success) {

                    console.log('Product deleted successfully.');
                    fetchProductData();
                    alert('Product deleted successfully!');
                } else {
                    console.error('Error deleting product:', deleteResult.message);
                    alert('Failed to delete product. Please try again.');
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred while deleting the product. Please try again.');
            }
        }
    }
});

async function deleteProduct(productId) {
    try {
        const response = await fetch(`delete_product.php?id=${encodeURIComponent(productId)}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete product');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}