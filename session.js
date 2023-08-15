function checkSession() {
  fetch('session.php')
    .then(response => response.json())
    .then(data => {
      const userStatusDiv = document.getElementById('userStatusDiv');
      const logoutBtn = document.getElementById('logoutBtn');
      const dashboardBtn = document.querySelector('.dashboard-btn');

      if (data.isLoggedIn) {
        userStatusDiv.textContent = `Hello, ${data.username}!`;
        logoutBtn.style.display = 'block';
        dashboardBtn.style.display = 'inline-block';
      } else {
        userStatusDiv.textContent = 'Hello, Guest!';
        logoutBtn.style.display = 'none';
        dashboardBtn.style.display = 'none';
      }
    })
    .catch(error => console.error('Error:', error));
}

checkSession();