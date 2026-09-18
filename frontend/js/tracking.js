const API_URL = "http://localhost:5000/api";

async function trackParcel() {

    const trackingNumber =
        document.getElementById(
            "trackingNumber"
        ).value.trim();

    if (!trackingNumber) {
        alert("Enter tracking number");
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/tracking/${trackingNumber}`
        );

        const data = await response.json();

        const result =
            document.getElementById("trackingResult");

        if (!data.success) {
            result.innerHTML =
                `<p>${data.message}</p>`;
            return;
        }

        const parcel = data.parcel;

        result.innerHTML = `
            <h3>Parcel Details</h3>

            <p>
                <strong>Tracking Number:</strong>
                ${parcel.tracking_number}
            </p>

            <p>
                <strong>Status:</strong>
                ${parcel.status}
            </p>

            <p>
                <strong>Receiver:</strong>
                ${parcel.receiver_name}
            </p>

            <h3>Tracking History</h3>

            ${
                data.trackingHistory.length
                ?
                data.trackingHistory.map(item => `
                    <div class="tracking-item">
                        <strong>${item.status}</strong>
                        <p>${item.location || ""}</p>
                        <p>${item.remarks || ""}</p>
                    </div>
                `).join("")
                :
                "<p>No tracking updates yet.</p>"
            }
        `;

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server");
    }
}