const loginForm = document.querySelector('.form-box.login form');
const errorMessage = document.getElementById('errorMessage');
const invalidMessage = document.getElementById('invalidMessage');
const successMessage = document.getElementById('successMessage');



function showAlert(alertId) {
    const alertElement = document.getElementById(alertId);
    alertElement.style.display = 'block';
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



    fetch('login.php', {
            method: 'POST',
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if (data.success) {
                showAlert('successMessage');
                window.location.href = 'dashboard.html';

            } else {
                showAlert('invalidMessage');


            }
            clearFieldsOnUnsuccessfulLogin();
        })
        .catch((error) => {
            showAlert('An error occurred during login. Please try again.');

        });





    setTimeout(() => {
        closeAlert('errorMessage');
        closeAlert('invalidMessage');
        closeAlert('successMessage');
    }, 1000);
});