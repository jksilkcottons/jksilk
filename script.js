// Import Firebase SDK functions from modular Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBahjLL2GpnirzKS9ukkZ4FUodLSJuuOB8",
    authDomain: "softmatters-6be76.firebaseapp.com",
    databaseURL: "https://softmatters-6be76-default-rtdb.firebaseio.com",
    projectId: "softmatters-6be76",
    storageBucket: "softmatters-6be76.appspot.com",
    messagingSenderId: "634958200094",
    appId: "1:634958200094:web:d8b40eb879a76c50a75d0f",
    measurementId: "G-J3VM7X6YDV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Realtime Database
const database = getDatabase(app);

// Reference to products in Firebase Realtime Database
const productsRef = ref(database, 'Entry');
const productsContainer = document.getElementById('productsContainer');

// Listen for changes in products data
onValue(productsRef, (snapshot) => {
    const products = snapshot.val();
    productsContainer.innerHTML = ''; // Clear previous products

    // Fetch beds
    if (products.beds) {
        for (const bedType in products.beds) {
            const bed = products.beds[bedType];
            const bedCard = `
                <div class="bg-white rounded-lg shadow-md p-4 cursor-pointer" data-name="${bed.Name}" data-details="${bed.Details}" data-price="${bed.Price}" data-description="${bed.Description}" data-images='${JSON.stringify(bed.Images)}'>
                    <img src="${bed.MainImage}" alt="${bed.Name}" class="w-full h-40 object-cover rounded-lg">
                    <h2 class="mt-4 text-xl font-bold">${bed.Name}</h2>
                    <p class="text-gray-600">${bed.Details}</p>
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-xl font-bold text-blue-500">Rs.${bed.Price}</span>
                        <button class="addToCartBtn bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600">Add to Cart</button>
                    </div>
                </div>
            `;
            productsContainer.innerHTML += bedCard;
        }
    }

    // Fetch pillows
    if (products.pillows) {
        for (const pillowType in products.pillows) {
            const pillow = products.pillows[pillowType];
            const pillowCard = `
                <div class="bg-white rounded-lg shadow-md p-4 cursor-pointer" data-name="${pillow.Name}" data-details="${pillow.Details}" data-price="${pillow.Price}" data-description="${pillow.Description}" data-images='${JSON.stringify(pillow.Images)}'>
                    <img src="${pillow.MainImage}" alt="${pillow.Name}" class="w-full h-40 object-cover rounded-lg">
                    <h2 class="mt-4 text-xl font-bold">${pillow.Name}</h2>
                    <p class="text-gray-600">${pillow.Details}</p>
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-xl font-bold text-blue-500">Rs.${pillow.Price}</span>
                        <button class="addToCartBtn bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600">Add to Cart</button>
                    </div>
                </div>
            `;
            productsContainer.innerHTML += pillowCard;
        }
    }

    // Attach click event listener to each product card
    const productCards = document.querySelectorAll('.bg-white.cursor-pointer');
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const productName = card.getAttribute('data-name');
            const productDetails = card.getAttribute('data-details');
            const productPrice = card.getAttribute('data-price');
            const productDescription = card.getAttribute('data-description');
            const productImages = JSON.parse(card.getAttribute('data-images'));

            // Build modal content
            let modalContent = `
                <h2 class="text-2xl font-bold mb-4">${productName}</h2>
                <p class="text-gray-600 mb-4">${productDetails}</p>
                <p class="text-gray-600 mb-4">${productDescription}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-blue-500">Rs.${productPrice}</span>
                    <button class="addToCartModal bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" data-name="${productName}" data-price="${productPrice}">Add to Cart</button>
                </div>
                <div class="mt-4">
                    <img src="${productImages.image1}" alt="${productName}" class="w-full h-40 object-cover rounded-lg mb-4">
            `;

            // Add sub-images
            modalContent += '<div class="grid grid-cols-2 gap-4">';
            for (const imageKey in productImages) {
                modalContent += `<img src="${productImages[imageKey]}" alt="Sub image" class="w-full h-24 object-cover rounded-lg">`;
            }
            modalContent += '</div>';
            modalContent += `</div>`;

            // Inject content into modal
            document.getElementById('modalContent').innerHTML = modalContent;

            // Show modal
            document.getElementById('productModal').classList.remove('hidden');
        });
    });

    // Event listener for "Add to Cart" buttons in product cards
    const addToCartButtons = document.querySelectorAll('.addToCartBtn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the card click event
            const card = button.closest('.bg-white.cursor-pointer');
            const productName = card.getAttribute('data-name');
            const productPrice = card.getAttribute('data-price');
            window.location.href = `cart.html?name=${encodeURIComponent(productName)}&price=${encodeURIComponent(productPrice)}`;
        });
    });

    // Event listener for "Add to Cart" button in modal
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('addToCartModal')) {
            const productName = e.target.getAttribute('data-name');
            const productPrice = e.target.getAttribute('data-price');
            window.location.href = `cart.html?name=${encodeURIComponent(productName)}&price=${encodeURIComponent(productPrice)}`;
        }
    });
});

// Close modal functionality
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('productModal').classList.add('hidden');
});

// Hamburger menu toggle for mobile
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('menu-toggle').addEventListener('click', () => {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('-translate-x-full');
        menu.classList.toggle('hidden');
    });
});
