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

const sampleContent = `
Is _this_ some kind of **magic**?
---
No, this is just \`code\`.
`;

const slides = sampleContent.split(/---/).map((k) => k.trim());
const slideCount = slides.length - 1;
let currentSlide = 0;
renderMarkdown(slides[currentSlide]);
renderSlideCounter(currentSlide, slideCount);
keys(window, {
  Space: () => {
    console.log("Next slide");
    if (currentSlide < slideCount) {
      currentSlide += 1;
    } else {
      // TODO: remove this later
      currentSlide = 0;
    }
    renderMarkdown(slides[currentSlide]);
    renderSlideCounter(currentSlide, slideCount);
  },
});
