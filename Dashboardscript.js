const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');


allSideMenu.forEach(item => {
    const li = item.parentElement;

    item.addEventListener('click', function() {
        allSideMenu.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});








document.addEventListener("DOMContentLoaded", function() {
    const profileLink = document.querySelector('.profile-link');
    profileLink.addEventListener('click', function(event) {
        event.preventDefault();
        this.classList.toggle('active');
    });
});


// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function() {
    sidebar.classList.toggle('hide');
})





// FOR DASHBOARD


const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function(e) {
    if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
        }
    }
})





if (window.innerWidth < 768) {
    sidebar.classList.add('hide');
} else if (window.innerWidth > 576) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    searchForm.classList.remove('show');
}


window.addEventListener('resize', function() {
    if (this.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
})







// LOGOUT



// dashboard.js
document.addEventListener("DOMContentLoaded", function() {

    const logoutLink = document.querySelector('.logout');
    logoutLink.addEventListener('click', function(event) {
        event.preventDefault();
        logout();
    });
});

function logout() {
    $.ajax({
        url: 'logout.php',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data.success) {


                sessionStorage.setItem('loggedOut', 'true');

                window.location.replace('index.html');
            } else {
                console.error('Logout failed.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

function preventBack() {

    if (sessionStorage.getItem('loggedOut')) {


        sessionStorage.removeItem('loggedOut');
        window.location.replace('index.html');
    } else {

        window.history.forward(null, null, 'dashboard.html');
    }
}


preventBack();


setTimeout(preventBack, 500);


window.onunload = null;






// TODO


// const addTodoBtn = document.getElementById("addTodoBtn");
// const popupInput = document.getElementById("popupInput");
// const newTodoInput = document.getElementById("newTodoInput");
// const addNewTodoBtn = document.getElementById("addNewTodoBtn");
// const todoList = document.querySelector(".todo-list");
// const closePopupBtn = document.getElementById("closePopupBtn");

// // Function to show the popup input bar when the "plus" button is clicked
// function showPopupInput() {
//   popupInput.classList.add("show");
//   newTodoInput.focus();
// }

// // Function to hide the popup input bar
// function hidePopupInput() {
//   popupInput.classList.remove("show");
//   newTodoInput.value = ""; // Clear the input field
// }

// // Function to add a new todo item when the "Add" button is clicked
// function addTodo() {
//   const task = newTodoInput.value;
//   if (task.trim() !== "") {
//     // Create a new list item for the todo
//     const todoItem = document.createElement("li");
//     todoItem.textContent = task;
//     todoItem.innerHTML += '<button class="delete-button" onclick="deleteTodoItem(this)">Delete</button>';
//     todoList.appendChild(todoItem);
//     hidePopupInput();
//   }
// }
// closePopupBtn.addEventListener("click", hidePopupInput);
// // Event listener for the "plus" button to show the popup input bar
// addTodoBtn.addEventListener("click", showPopupInput);

// // Event listener for the "Add" button to add the new todo
// addNewTodoBtn.addEventListener("click", addTodo);

// // Event listener for the Enter key to add the new todo (when the input field is focused)
// newTodoInput.addEventListener("keydown", (event) => {
//   if (event.key === "Enter") {
//     addTodo();
//   }
// });

// // Function to handle the delete button click and remove the todo item from the list
// function deleteTodoItem(button) {
//   const todoItem = button.parentElement;
//   todoItem.remove();
// }