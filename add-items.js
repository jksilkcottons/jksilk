import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBahjLL2GpnirzKS9ukkZ4FUodLSJuuOB8",
    authDomain: "softmatters-6be76.firebaseapp.com",
    databaseURL: "https://softmatters-6be76-default-rtdb.firebaseio.com",
    projectId: "softmatters-6be76",
    storageBucket: "softmatters-6be76.appspot.com",
    messagingSenderId: "634958200094",
    appId: "1:634958200094:web:d8b40eb879a76c50a75d0f"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
const addItemForm = document.getElementById('addItemForm');

const uploadImage = (imageFile, filePath, onProgress) => {
    const imageRef = storageRef(storage, filePath);
    const uploadTask = uploadBytesResumable(imageRef, imageFile);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress(progress);
            }, 
            (error) => {
                reject(error);
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
};

addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Spinner becomes visible when the form is submitted
    document.getElementById('loadingSpinner').classList.remove('hidden');
    document.getElementById('loadingPercentage').innerText = "0%";

    const category = document.getElementById('category').value;
    const itemName = document.getElementById('itemName').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const size = document.getElementById('size').value; // Capture size
    const mainImage = document.getElementById('mainImageUpload').files[0];
    const additionalImages = document.getElementById('additionalImagesUpload').files;

    if (!mainImage) {
        alert("Please upload a main image.");
        document.getElementById('loadingSpinner').classList.add('hidden'); // Hide spinner on error
        return;
    }

    try {
        const mainImageURL = await uploadImage(mainImage, `images/${mainImage.name}`, (progress) => {
            document.getElementById('loadingPercentage').innerText = `${Math.round(progress)}%`;  // Update the percentage
        });

        const additionalImageURLs = await Promise.all(
            Array.from(additionalImages).map(async (file) => {
                if (file) {
                    return await uploadImage(file, `images/${file.name}`, (progress) => {
                        document.getElementById('loadingPercentage').innerText = `${Math.round(progress)}%`;
                    });
                }
                return null;
            })
        );

        const newItem = {
            Name: itemName,
            Price: price,
            Description: description,
            Size: size, // Include size in the item data
            MainImage: mainImageURL,
            Images: additionalImageURLs.filter(url => url !== null)
        };

        const itemsRef = ref(database, `Entry/${category}`);
        await push(itemsRef, newItem);

        alert("Item added successfully!");
        addItemForm.reset();
        document.getElementById('imagePreview').innerHTML = '';
        const page1 = document.getElementById('page1');
        const page2 = document.getElementById('page2');
        page2.classList.add('hidden');
        page1.classList.remove('hidden');
    } catch (error) {
        console.error("Error adding item:", error);
        alert("Error adding item. Please try again.");
    } finally {
        // Hide spinner after upload is complete
        document.getElementById('loadingSpinner').classList.add('hidden');
        document.getElementById('loadingPercentage').innerText = "0%";
    }
});



// Sidebar toggle functionality
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
});
