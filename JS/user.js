
document.getElementById("addUserBtn").addEventListener("click", function() {
    document.getElementById("addUserFormPopup").style.display = "block";
});

document.getElementById("closeUserForm").addEventListener("click", function() {
    document.getElementById("addUserFormPopup").style.display = "none";
});


















$(document).ready(function() {
    fetchUserData(); // Call the function to fetch user data when the page loads
});

function fetchUserData() {
    fetch('./API/user_management.php') // Make sure this path is correct
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                displayUsers(data);
            } else {
                console.error('No users found.');
            }
        })
        .catch(error => console.error('Error fetching user data:', error));
}

function displayUsers(users) {
    $('#userstable').DataTable({
        data: users,
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'username', title: 'Username' },
            { data: 'email', title: 'Email' },
            { data: 'created_at', title: 'Created at' },
            { data: 'updated_at', title: 'Updated at' },
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
        ]
    });
}