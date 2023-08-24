$(document).ready(function() {
    
    $.ajax({
        url: './API/orders.php', 
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            populateTable(data);
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });

   
    function populateTable(data) {
        var table = $('#ordersTable').DataTable({
            data: data,
            columns: [
                { data: 'OrderID', title: 'Order ID' },
                { data: 'UserID', title: 'User ID' },
                { data: 'FullName', title: 'Full Name' },
                { data: 'ContactNumber', title: 'Contact Number' },
                { data: 'ShippingAddress', title: 'Shipping Address' },
                { data: 'TotalAmount', title: 'Total Amount' },
                { data: 'TotalItems', title: 'Total Item' },
                { data: 'OrderDate', title: 'Order Date' }
            ]
        });
    }
});