
fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar').innerHTML = data;

        // Re-initialize the hamburger menu toggle for mobile
        document.getElementById('menu-toggle').addEventListener('click', () => {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('-translate-x-full');
            menu.classList.toggle('hidden');
        });

        // Close the menu when clicking outside of it
        document.addEventListener('click', (event) => {
            const menu = document.getElementById('mobile-menu');
            const menuToggle = document.getElementById('menu-toggle');
            if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
                menu.classList.add('-translate-x-full'); // Slide out
                menu.classList.add('hidden'); // Hide the menu
            }
        });
    })
    .catch(error => console.error('Error loading the navbar:', error));
