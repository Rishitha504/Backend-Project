// Delivery Agent Login

const deliveryLoginForm = document.getElementById("deliveryLoginForm");

deliveryLoginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Check input
    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    try {
        // Send login request to backend
        const response = await fetch(
            "http://localhost:5000/api/delivery-agents/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        console.log("Delivery Login Response:", data);

        // Login successful
        if (data.success) {

            // Save delivery agent information
            localStorage.setItem(
                "deliveryAgent",
                JSON.stringify(data.user)
            );

            alert(
                "Login successful!\n\n" +
                "Welcome " +
                data.user.full_name
            );

            // Your project has dashboard.html
            window.location.href = "delivery-dashboard.html";

        } else {

            // Login failed
            alert(
                data.message ||
                "Delivery Agent Login Failed"
            );
        }

    } catch (error) {

        console.error(
            "DELIVERY LOGIN ERROR:",
            error
        );

        alert(
            "Unable to connect to the server.\n\n" +
            "Please make sure the backend server is running."
        );
    }
});