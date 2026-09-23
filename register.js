const API_URL = "http://localhost:5000/api";

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const full_name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value;

        // Check required fields
        if (!full_name || !email || !phone || !password) {
            alert("Please fill all required fields");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    full_name: full_name,
                    email: email,
                    phone: phone,
                    password: password,
                    role: "Sender"
                })
            });

            const data = await response.json();

            console.log("Registration response:", data);

            alert(data.message);

            if (data.success) {
                window.location.href = "login.html";
            }

        } catch (error) {
            console.error("Registration error:", error);
            alert("Unable to connect to server");
        }
    });
}