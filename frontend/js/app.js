const AUTH_URL = "http://localhost:5000/auth";

const loginForm = document.getElementById("loginForm");
const logoutLinks = document.querySelectorAll(".logout-link");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${AUTH_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Login successful");
    window.location.href = "dashboard.html";
  });
}

logoutLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
  });
});
