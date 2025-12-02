document.addEventListener('DOMContentLoaded', () => {
    console.log('Chichen Itzá Virtual Tour App Loaded');

    // Check for saved session to update Navbar
    const savedUser = localStorage.getItem('tourUser');
    const navLoginBtn = document.getElementById('navLoginBtn');

    if (savedUser) {
        const user = JSON.parse(savedUser);
        navLoginBtn.textContent = 'Go to Dashboard';
        if (user.role === 'Admin') {
            navLoginBtn.href = 'dashboard-admin.html';
        } else {
            navLoginBtn.href = 'dashboard-user.html';
        }
    }

    // Learn More Scroll
    const learnMoreBtn = document.querySelectorAll('a[href="#"]')[0]; // The second button in hero is Learn More (actually index 1 in previous, but now Start Tour is href="login.html")
    // Wait, Start Tour is now href="login.html", so it's not href="#" anymore.
    // So Learn More is likely the first or only href="#" in that section.
    
    // Let's select specifically
    const learnMore = document.querySelector('a[href="#"]');
    if (learnMore && learnMore.textContent.includes('Learn More')) {
        learnMore.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('learn-more');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
