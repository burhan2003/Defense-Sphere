document.addEventListener('DOMContentLoaded', function() {
    // Profile picture upload
    const profilePicture = document.getElementById('profilePicture');
    const profilePictureUpload = document.getElementById('profilePictureUpload');

    profilePictureUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePicture.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Password validation
    const passwordForm = document.getElementById('passwordForm');
    passwordForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword) {
            alert('Please enter your current password');
            return;
        }

        if (newPassword.length < 8) {
            alert('New password must be at least 8 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        // Here you would typically make an API call to verify the current password
        // and update to the new password if verified
        alert('Password updated successfully!');
        this.reset();
    });

    // Profile form
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Profile updated successfully!');
    });

    // Preferences form
    const preferencesForm = document.getElementById('preferencesForm');
    preferencesForm.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Preferences saved successfully!');
    });

    // Theme switcher
    const themeSelect = document.getElementById('theme');
    themeSelect.addEventListener('change', function() {
        document.body.className = this.value + '-theme';
        localStorage.setItem('theme', this.value);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        themeSelect.value = savedTheme;
        document.body.className = savedTheme + '-theme';
    }
});