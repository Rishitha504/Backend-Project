const API_URL = "http://localhost:5000/api";

const bookingForm =
    document.getElementById("bookingForm");

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const user =
                JSON.parse(localStorage.getItem("user"));

            if (!user) {
                alert("Please login first");
                window.location.href = "login.html";
                return;
            }

            const parcelData = {
                sender_id: user.id,
                receiver_name:
                    document.getElementById(
                        "receiverName"
                    ).value,

                receiver_phone:
                    document.getElementById(
                        "receiverPhone"
                    ).value,

                receiver_address:
                    document.getElementById(
                        "receiverAddress"
                    ).value,

                parcel_type:
                    document.getElementById(
                        "parcelType"
                    ).value,

                weight:
                    document.getElementById(
                        "weight"
                    ).value,

                delivery_type:
                    document.getElementById(
                        "deliveryType"
                    ).value,

                amount:
                    document.getElementById(
                        "amount"
                    ).value
            };

            try {

                const response = await fetch(
                    `${API_URL}/parcels`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(parcelData)
                    }
                );

                const data =
                    await response.json();

                if (data.success) {

                    alert(
                        `Parcel booked!\nTracking Number: ${data.trackingNumber}`
                    );

                    bookingForm.reset();

                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.error(error);
                alert("Server connection failed");
            }
        }
    );
}