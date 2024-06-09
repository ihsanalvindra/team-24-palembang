document.addEventListener("DOMContentLoaded", function() {
    var loadingAnimation = anime.timeline({
        loop: true
    });
    loadingAnimation
        .add({
            targets: '.loading-dot',
            translateY: -20,
            opacity: [1, 0.5],
            duration: 500,
            easing: 'easeInOutSine',
            delay: anime.stagger(100, {start: 0}),
        })
        .add({
            targets: '.loading-dot',
            translateY: 0,
            opacity: [0.5, 1],
            duration: 500,
            easing: 'easeInOutSine',
            delay: anime.stagger(100, {start: 0}),
        });

    setTimeout(function() {
        loadingAnimation.pause();
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    }, 3000); // Adjust the duration of the loading screen here
});

document.addEventListener('DOMContentLoaded', function() {
    anime({
        targets: '#box1',
        translateX: 250,
        translateY: 100,
        rotate: '1turn',
        backgroundColor: '#d48806',
        duration: 4000, // Durasi animasi untuk box1 4 detik
        easing: 'easeInOutQuad',
        direction: 'alternate',
        loop: true
    });

    anime({
        targets: '#box2',
        translateX: 150,
        translateY: -150,
        rotate: '2turn',
        backgroundColor: '#00bcd4',
        duration: 5000, // Durasi animasi untuk box2 5 detik
        easing: 'easeInOutQuad',
        direction: 'alternate',
        loop: true
    });

    anime({
        targets: '#box3',
        translateX: -200,
        translateY: 50,
        rotate: '0.5turn',
        backgroundColor: '#4caf50',
        duration: 6000, // Durasi animasi untuk box3 6 detik
        easing: 'easeInOutQuad',
        direction: 'alternate',
        loop: true
    });
});

