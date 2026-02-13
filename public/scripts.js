// Detect when an element enters the viewport
window.addEventListener('scroll', function () {
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        const rect = feature.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            feature.classList.add('visible');
        }
    });
});
