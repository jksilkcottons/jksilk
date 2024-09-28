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

    // Fetch beds and pillows
    const productTypes = ['beds', 'pillows'];
    productTypes.forEach(type => {
        if (products[type]) {
            for (const item in products[type]) {
                const product = products[type][item];
                const productCard = `
                    <div class="bg-white rounded-lg shadow-md p-4 cursor-pointer" 
                         data-name="${product.Name}" 
                         data-details="${product.Size}" 
                         data-price="${product.Price}" 
                         data-description="${product.Description}" 
                         data-images='${JSON.stringify(product.Images)}'>
                        <img src="${product.MainImage}" alt="${product.Name}" class="w-full h-40 object-cover rounded-lg">
                        <h2 class="mt-4 text-xl font-bold">${product.Name}</h2>
                        <p class="text-gray-600">${product.Size}</p>
                        <div class="flex justify-between items-center mt-4">
                            <span class="text-xl font-bold text-blue-500">Rs.${product.Price}</span>
                            <button class="addToCartBtn bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600">Add to Cart</button>
                        </div>
                    </div>
                `;
                productsContainer.innerHTML += productCard;
            }
        }
    });

    // Attach click event listener to each product card
    attachProductCardClickListeners();

    // Attach event listener for "Add to Cart" buttons
    attachAddToCartButtonListeners();

    // Event listener for "Add to Cart" button in modal
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('addToCartModal')) {
            const productName = e.target.getAttribute('data-name');
            const productPrice = e.target.getAttribute('data-price');
            window.location.href = `cart.html?name=${encodeURIComponent(productName)}&price=${encodeURIComponent(productPrice)}`;
        }
    });
});

// Attach click event listener for product cards
function attachProductCardClickListeners() {
    const productCards = document.querySelectorAll('.bg-white.cursor-pointer');
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const productDetails = getProductDetails(card);
            showProductModal(productDetails);
        });
    });
}

// Function to get product details from card
function getProductDetails(card) {
    return {
        name: card.getAttribute('data-name'),
        details: card.getAttribute('data-details'),
        price: card.getAttribute('data-price'),
        description: card.getAttribute('data-description'),
        images: JSON.parse(card.getAttribute('data-images'))
    };
}


// Show modal with product details
function showProductModal({ name, details, price, description, images }) {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = ''; // Clear previous content

    let newModalContent = `
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">${name}</h2>
        </div>
        <p class="text-gray-600 mb-4">${details}</p>
        <p class="text-gray-600 mb-4">${description}</p>
        <div class="flex justify-between items-center">
            <span class="text-xl font-bold text-blue-500">Rs.${price}</span>
            <button class="addToCartModal bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" data-name="${name}" data-price="${price}">Add to Cart</button>
        </div>
        <div class="mt-4">
            <img src="${images[0]}" alt="${name}" class="w-full h-40 object-cover rounded-lg mb-4 product-image">
    `;

    // Add sub-images
    newModalContent += '<div class="grid grid-cols-2 gap-4">';
    images.forEach((image, index) => {
        newModalContent += `<img src="${image}" alt="Sub image ${index + 1}" class="w-full h-24 object-cover rounded-lg product-image">`;
    });
    newModalContent += '</div></div>';

    modalContent.innerHTML = newModalContent;

    // Show the modal
    const productModal = document.getElementById('productModal');
    productModal.classList.add('show');
    productModal.classList.remove('hidden');

    // Close modal event
    const closeModalButton = document.getElementById('closeModal');
    closeModalButton.addEventListener('click', closeProductModal);

    // Add event listeners for image click to expand
    const productImagesElements = document.querySelectorAll('.product-image');
    productImagesElements.forEach(image => {
        image.addEventListener('click', () => {
            openFullScreenImage(image.src);
        });
    });
}


// Attach event listener to "Add to Cart" buttons in product cards
function attachAddToCartButtonListeners() {
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
}

// Close modal functionality
function closeProductModal() {
    const productModal = document.getElementById('productModal');
    productModal.classList.remove('show'); // Fade out
    setTimeout(() => {
        productModal.classList.add('hidden'); // Hide after animation
    }, 300); // Match the duration of the CSS transition
}



// Full-screen image view
function openFullScreenImage(imageSrc) {
    // Create the full-screen image container
    const fullScreenImageContainer = document.createElement('div');
    fullScreenImageContainer.classList.add('fixed', 'inset-0', 'bg-gray-900', 'bg-opacity-90', 'flex', 'items-center', 'justify-center', 'z-50');

    // Create the full-screen image element
    const fullScreenImage = document.createElement('img');
    fullScreenImage.src = imageSrc;
    fullScreenImage.classList.add('w-auto', 'h-auto', 'max-w-full', 'max-h-full', 'rounded-lg', 'shadow-lg');

    // Append image to the container
    fullScreenImageContainer.appendChild(fullScreenImage);
    
    // Append the container to the body
    document.body.appendChild(fullScreenImageContainer);

    // Add event listener to close the image on click
    fullScreenImageContainer.addEventListener('click', () => {
        fullScreenImageContainer.remove();
    });
}
