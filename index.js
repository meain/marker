const md = window.markdownit();
const keys = window.tinykeys;

function renderMarkdown(doc) {
  const result = md.render(doc);
  const content = document.getElementById("content");
  content.innerHTML = result;
}

function renderSlideCounter(current, max) {
  const slide_count = document.getElementById("slide-count");
  // TODO: use text instead of html
  slide_count.innerHTML = `${current}/${max}`;
}

function renderSlides(slides, currentSlide) {
  renderMarkdown(slides[currentSlide]);
  renderSlideCounter(currentSlide + 1, slides.length);
}

const sampleContent = `
Is _this_ some kind of **magic**?
---
No, this is just \`code\`.
`;

const slides = sampleContent.split(/---/).map((k) => k.trim());
const slideCount = slides.length - 1;
let currentSlide = 0;
renderSlides(slides, currentSlide);
keys(window, {
  Space: () => {
    if (currentSlide < slideCount) currentSlide += 1;
    renderSlides(slides, currentSlide);
  },
  ArrowRight: () => {
    if (currentSlide < slideCount) currentSlide += 1;
    renderSlides(slides, currentSlide);
  },
  ArrowLeft: () => {
    if (currentSlide > 0) currentSlide -= 1;
    renderSlides(slides, currentSlide);
  },
  "Shift+Space": () => {
    if (currentSlide > 0) currentSlide -= 1;
    renderSlides(slides, currentSlide);
  },
});
