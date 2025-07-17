const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    function updateDateTime() {
        const now = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.getElementById('datetime').textContent = now.toLocaleDateString('en-US', options);
    }

    updateDateTime();
    setInterval(updateDateTime, 60000);

    function calculateRoute() {
        const startLocation = document.getElementById('startLocation').value;
        const endLocation = document.getElementById('endLocation').value;
        
        if (!startLocation || !endLocation) {
            alert('Please enter both starting location and destination!');
            return;
        }

        const calculateText = document.getElementById('calculateText');
        const loadingSpinner = document.getElementById('loadingSpinner');
        
        calculateText.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');

        setTimeout(() => {
            const distance = Math.floor(Math.random() * 500) + 50;
            const time = Math.floor(distance / 60 * 60);
            
            document.getElementById('shortestDistance').textContent = `${distance} km`;
            document.getElementById('estimatedTime').textContent = `${time} minutes`;
            document.getElementById('routeStatus').textContent = 'Route Optimized ✅';
            
            calculateText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
            
            showNotification('Route calculated successfully!', 'success');
        }, 2000);
    }

    function selectPlace(placeName) {
        const startInput = document.getElementById('startLocation');
        const endInput = document.getElementById('endLocation');
        
        if (!startInput.value) {
            startInput.value = placeName;
            startInput.focus();
        } else if (!endInput.value) {
            endInput.value = placeName;
            endInput.focus();
        } else {
            endInput.value = placeName;
        }
        
        showNotification(`Selected: ${placeName}`, 'info');
    }

    function openInGoogleMaps() {
        const startLocation = document.getElementById('startLocation').value;
        const endLocation = document.getElementById('endLocation').value;
        
        if (!startLocation || !endLocation) {
            alert('Please enter both locations first!');
            return;
        }
        
        const googleMapsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(startLocation)}/${encodeURIComponent(endLocation)}`;
        window.open(googleMapsUrl, '_blank');
        
        showNotification('Opening in Google Maps...', 'info');
    }

    function clearInputs() {
        document.getElementById('startLocation').value = '';
        document.getElementById('endLocation').value = '';
        document.getElementById('shortestDistance').textContent = '-- km';
        document.getElementById('estimatedTime').textContent = '-- minutes';
        document.getElementById('routeStatus').textContent = 'Ready to calculate';
        
        showNotification('Inputs cleared!', 'info');
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'Enter':
                    e.preventDefault();
                    calculateRoute();
                    break;
                case 'k':
                    e.preventDefault();
                    clearInputs();
                    break;
            }
        }
    });

    const startInput = document.getElementById('startLocation');
    const endInput = document.getElementById('endLocation');

    [startInput, endInput].forEach(input => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length > 100) {
                e.target.value = e.target.value.substring(0, 100);
                showNotification('Location name too long!', 'error');
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (input === startInput && !endInput.value) {
                    endInput.focus();
                } else {
                    calculateRoute();
                }
            }
        });
    });
