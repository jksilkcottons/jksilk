// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const productName = urlParams.get('name');
const productPrice = urlParams.get('price');

// Display selected product details
const productDetailsDiv = document.getElementById('productDetails');
productDetailsDiv.innerHTML = `
    <h2 class="text-xl font-bold">Product: ${productName}</h2>
    <p class="text-gray-600">Price: Rs.${productPrice}</p>
`;

// Form submission handling
document.getElementById('userInfoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fullname = document.getElementById('fullname').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    // Send email using SMTP.js
    Email.send({
            Host : "smtp.elasticemail.com",
            Username : "jksilkcottons@gmail.com",
            Password : "EBE84C3C97D31862DC311E6287D8CDACDC66",
            To : 'jksilkcottons@gmail.com',
            From : "jksilkcottons@gmail.com",
        Subject: "New Order from Cart",
        Body: `
            New order details:
            Name: ${fullname}
            Phone: ${phone}
            Address: ${address}
            Product: ${productName}
            Price: Rs.${productPrice}
        `
    })
    .then((message) => {
        alert(`Thank you ${fullname}! Your order for ${productName} has been placed.`);
        document.getElementById('userInfoForm').reset();
    })
    .catch((error) => {
        alert("An error occurred while sending your details. Please try again.");
        console.error('Email send error:', error);
    });
});