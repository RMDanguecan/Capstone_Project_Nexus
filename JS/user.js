document.getElementById("addUserBtn").addEventListener("click", function() {
    document.getElementById("addUserFormPopup").style.display = "block";
});

document.getElementById("closeUserForm").addEventListener("click", function() {
    document.getElementById("addUserFormPopup").style.display = "none";
});

$(document).ready(function() {
    fetchCombinedUserData();
});


function initializeDataTable(data) {
    if ($.fn.DataTable.isDataTable('#combine')) {
        $('#combine').DataTable().destroy();
    }
    $('#combine').DataTable({
        data: data,
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'username', title: 'Username' },
            { data: 'email', title: 'Email' },
            { data: 'role_name', title: 'Role' },
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



function fetchCombinedUserData() {
    fetch('./API/combined_user_data.php')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                initializeDataTable(data);
            } else {
                console.error('No combined user data found.');
            }
        })
        .catch(error => console.error('Error fetching combined user data:', error));
}

function displayUsers(users) {
    $('#combine').DataTable().clear().rows.add(users).draw();
}


$("#userForm").submit(function(event) {
    event.preventDefault(); 

    
    const formData = new FormData(this);

    
    formData.append("add", "true");

    
    console.log(formData);

    
    fetch('./API/adduser.php', {
        method: 'POST',
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            fetchCombinedUserData();
            alert('User added successfully!');
            document.getElementById("addUserFormPopup").style.display = "none"; 
        } else {
            console.error('Error adding user:', data.message);
            alert('Failed to add user. Please try again.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while adding the user. Please try again.');
    });
});


function getUserDataById(userId) {
    return fetch(`./API/getusersID.php?userId=${userId}`)
        .then(response => response.json())
        .catch(error => null);
}

$(document).ready(function() {
    
    $(document).on("click", ".update-button", async function() {
        const userId = $(this).data("id");
        const userData = await getUserDataById(userId);
        console.log("User ID:", userId);

        if (userData) {
            $("#updateUserId").val(userData.userData.id);  
            $("#updateUserName").val(userData.userData.username);
            $("#updateEmail").val(userData.userData.email);
            $("#updateRole").val(userData.userData.role_id);
            $("#userType").val(userData.userType); 
            console.log("User Data:", userData);
            $("#updateUserFormPopup").css("display", "block");
        } else {
            console.error("User data not found for update.");
        }
    });
});






$("#closeUserFormUpdate").click(function() {
    $("#updateUserFormPopup").css("display", "none");
});


$("#updateUserForm").submit(function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    formData.append("update", true); 

    fetch("./API/updateUser.php", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchCombinedUserData(); 
            alert("User updated successfully!");
            $("#updateUserFormPopup").css("display", "none"); 
        } else {
            console.error("Error updating user:", data.message);
            alert("Failed to update user. Please try again.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while updating the user. Please try again.");
    });
});









fetch('./API/combined_user_data.php')
    .then(response => response.json())
    .then(data => {
        
        initializeDataTable(data); 
        
        
        $('#combine').on('click', '.delete-button', async function() {
            const deleteButton = $(this);
            const row = deleteButton.closest('tr');
            const rowData = $('#combine').DataTable().row(row).data();
            const rowId = rowData.id;

            const confirmed = window.confirm('Are you sure you want to delete this row?');

            if (confirmed) {
                try {
                    const response = await fetch(`./API/delete_users.php?userId=${rowId}`, {
                        method: 'DELETE'
                    });

                    const deleteResult = await response.json(); 

                    if (deleteResult.success) {
                        console.log('Row deleted successfully.');
                        $('#combine').DataTable().row(row).remove().draw(false);
                        alert('Row deleted successfully!');
                    } else {
                        console.error('Error deleting row:', deleteResult.message);
                        alert('Failed to delete row. Please try again.');
                    }
                } catch (error) {
                    console.error(error);
                    alert('An error occurred while deleting the row. Please try again.');
                }
            }
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });


