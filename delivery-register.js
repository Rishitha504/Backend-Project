const API_URL = "http://localhost:5000/api";

const deliveryRegisterForm =
    document.getElementById("deliveryRegisterForm");

if (deliveryRegisterForm) {

    deliveryRegisterForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const agentData = {

                full_name:
                    document.getElementById(
                        "fullName"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "phone"
                    ).value.trim(),

                email:
                    document.getElementById(
                        "email"
                    ).value.trim(),

                password:
                    document.getElementById(
                        "password"
                    ).value,

                vehicle_type:
                    document.getElementById(
                        "vehicleType"
                    ).value,

                vehicle_number:
                    document.getElementById(
                        "vehicleNumber"
                    ).value.trim()
            };

            try {

                const response = await fetch(
                    `${API_URL}/delivery-agents/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(agentData)
                    }
                );

                const data =
                    await response.json();

                console.log(
                    "Registration response:",
                    data
                );

                if (data.success) {

                    alert(
                        "Registration successful!\n\n" +
                        "Employee Code: " +
                        data.employee_code
                    );

                    deliveryRegisterForm.reset();

                    window.location.href =
                        "delivery-login.html";

                } else {

                    alert(
                        data.message ||
                        "Registration failed"
                    );
                }

            } catch (error) {

                console.error(
                    "DELIVERY REGISTRATION ERROR:",
                    error
                );

                alert(
                    "Unable to connect to server"
                );
            }
        }
    );
}