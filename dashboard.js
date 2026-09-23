const user = JSON.parse(
    localStorage.getItem("user")
);

if (!user) {
    window.location.href = "login.html";
}

const userName =
    document.getElementById("userName");

if (userName && user) {
    userName.textContent = user.name;
}

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}