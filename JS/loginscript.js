const loginForm = document.querySelector('.form-box.login form');
const errorMessage = document.getElementById('errorMessage');
const invalidMessage = document.getElementById('invalidMessage');
const successMessage = document.getElementById('successMessage');



function showAlert(messageElementId) {
    var messageElement = document.getElementById(messageElementId);
    if (messageElement) {
        messageElement.style.display = 'block'; // Show the alert element
    }
}

function clearFieldsOnUnsuccessfulLogin() {
    const inputFields = document.querySelectorAll('.form-box input');
    inputFields.forEach((input) => {
        input.value = '';
    });
}

function closeAlert(alertId) {
    const alert = document.getElementById(alertId);
    alert.style.display = 'none';
}




loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');
    if (!username || !password) {
        showAlert('errorMessage');
        setTimeout(() => {
            closeAlert('errorMessage');
        }, 1000);
        return;
    }

    console.log('Starting login process...');
    fetch('./API/login.php', {
        method: 'POST',
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('Data from server:', data);
        if (data.success) {
            console.log('Login successful.');
            if (data.role === 'admin') {
                window.location.href = './dashboard.html'; // Redirect to admin dashboard
            } else if (data.role === 'user') {
                window.location.href = './Mainpage/index.html'; // Redirect to user dashboard
            } else {
                console.log('Unknown role.');
            }
        } else {
            console.log('Login unsuccessful.');
            // Rest of your code for handling unsuccessful login
        }
    })
    .catch((error) => {
        console.log('Error:', error);
    });


    setTimeout(() => {
        closeAlert('errorMessage');
        closeAlert('invalidMessage');
        closeAlert('successMessage');
    }, 1000);
});


registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);

    fetch('./API/register.php', {
        method: 'POST',
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert('Registration successful!');
                registerPopup.style.display = 'none';
            } else {
                alert('Registration failed. Please try again.');
            }
        })
        .catch((error) => {
            alert('An error occurred during registration. Please try again.');
        });
});