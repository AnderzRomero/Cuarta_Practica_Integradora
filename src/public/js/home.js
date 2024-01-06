const prevButton = document.querySelector('.prev-btn');
const nextButton = document.querySelector('.next-btn');
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');

let counter = 0;
const slideWidth = slides[0].clientWidth;
const intervalTime = 3000; // Cambia el tiempo entre slides (en milisegundos)
let slideInterval;

function slideNext() {
  if (counter >= slides.length - 1) {
    counter = 0; // Si está en la última imagen, vuelve al principio
  } else {
    counter++;
  }
  slider.style.transform = `translateX(${-slideWidth * counter}px)`;
}


function slidePrev() {
  if (counter <= 0) return;
  counter--;
  slider.style.transform = `translateX(${-slideWidth * counter}px)`;
}

function startSlide() {
  slideInterval = setInterval(() => {
    slideNext();
  }, intervalTime);
}

function stopSlide() {
  clearInterval(slideInterval);
}

nextButton.addEventListener('click', () => {
  slideNext();
  stopSlide();
});
prevButton.addEventListener('click', () => {
  slidePrev();
  stopSlide();
});

slider.addEventListener('mouseover', stopSlide);
slider.addEventListener('mouseleave', startSlide);

startSlide();