function animateCount(el, target, duration = 1400) {
	const start = 0;
	const startTime = performance.now();
	const suffix = el.getAttribute('data-suffix') || '';

	function tick(now) {
		const elapsed = now - startTime;
		const progress = Math.min(elapsed / duration, 1);
		// easeOutQuad
		const eased = 1 - (1 - progress) * (1 - progress);
		const current = Math.floor(start + (target - start) * eased);
		el.textContent = current + suffix;
		if (progress < 1) {
			requestAnimationFrame(tick);
		} else {
			el.textContent = target.toString() + suffix;
		}
	}

	requestAnimationFrame(tick);
}

function startCounters(container) {
	const counters = (container || document).querySelectorAll('.count');
	counters.forEach(el => {
		if (el.dataset.animated) return;
		const target = parseInt(el.getAttribute('data-target'), 10) || 0;
		el.dataset.animated = 'true';
		animateCount(el, target, 1200);
	});
}

document.addEventListener('DOMContentLoaded', () => {
	const statsSection = document.getElementById('stats');
	if (!statsSection) return;

	if ('IntersectionObserver' in window) {
		const io = new IntersectionObserver((entries, obs) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					startCounters(statsSection);
					obs.disconnect();
				}
			});
		}, { threshold: 0.3 });
		io.observe(statsSection);
	} else {
		setTimeout(() => startCounters(statsSection), 500);
	}
    
	const nav = document.querySelector('header nav');
	if (nav) {
		let ticking = false;
		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const shouldShrink = window.scrollY > 60;
					if (shouldShrink && !nav.classList.contains('scrolled')) {
						nav.classList.add('scrolled');
						document.body.style.paddingTop = nav.getBoundingClientRect().height + 'px';
						document.body.classList.add('has-fixed-header');
					} else if (!shouldShrink && nav.classList.contains('scrolled')) {
						nav.classList.remove('scrolled');
						document.body.style.paddingTop = '';
						document.body.classList.remove('has-fixed-header');
					}
					ticking = false;
				});
				ticking = true;
			}
		};

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
	}

	const slideshowTrack = document.querySelector('.slideshow-track');
	if (slideshowTrack) {
		const slides = Array.from(slideshowTrack.querySelectorAll('img'));
		let current = 0;
		let intervalId = null;
		const total = slides.length;

		function goTo(idx) {
			slideshowTrack.style.transform = `translateX(-${idx * 100}%)`;
			current = idx;
		}

		function next() { goTo((current + 1) % total); }

		function startSlideshow() { if (!intervalId) intervalId = setInterval(next, 3200); }
		function stopSlideshow() { if (intervalId) { clearInterval(intervalId); intervalId = null; } }

		// pausa quando ci si passaw sopra col cursore
		const container = slideshowTrack.closest('.slideshow');
		if (container) {
			container.addEventListener('mouseenter', stopSlideshow);
			container.addEventListener('mouseleave', startSlideshow);
		}

		startSlideshow();

		window.addEventListener('resize', () => goTo(current));
	}

	// Aggiorna l'anno nel footer
	const annoCorrente = new Date().getFullYear();
	const annoSpan = document.getElementById('anno-corrente');
	if (annoSpan) {
		annoSpan.textContent = annoCorrente.toString();
	}
});


	
