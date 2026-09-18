/**
 * EcoBlue Environmental Services Ltd. - Interactive Before & After Comparison Slider
 * Enables smooth touch, mouse, and keyboard interaction for environmental transformation comparisons.
 */

function initBeforeAfterSliders() {
  const containers = document.querySelectorAll('.before-after-container');

  containers.forEach(container => {
    const beforeLayer = container.querySelector('.ba-before');
    const innerImage = container.querySelector('.ba-image-inner');
    const handle = container.querySelector('.ba-handle');
    if (!beforeLayer || !handle) return;

    let isDragging = false;

    // Keep inner image matching the container width
    function syncInnerImageWidth() {
      if (innerImage) {
        innerImage.style.width = container.offsetWidth + 'px';
      }
    }

    syncInnerImageWidth();
    window.addEventListener('resize', syncInnerImageWidth);

    function updateSlider(clientX) {
      const rect = container.getBoundingClientRect();
      let offsetX = clientX - rect.left;

      // Clamp between 5% and 95%
      const minX = rect.width * 0.05;
      const maxX = rect.width * 0.95;

      if (offsetX < minX) offsetX = minX;
      if (offsetX > maxX) offsetX = maxX;

      const percentage = (offsetX / rect.width) * 100;
      beforeLayer.style.width = percentage + '%';
      handle.style.left = percentage + '%';
    }

    // Mouse events
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events for mobile responsiveness
    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches.length > 0) {
        updateSlider(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        updateSlider(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  });
}

document.addEventListener('DOMContentLoaded', initBeforeAfterSliders);
