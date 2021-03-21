// TODO ITEMS
// syntax highlight
// option to enable disable features(progresbar, counter)
// get content from url
// apply custom css from url
// few basic themes
// expose soe theme features in url (progressbar color)
// cache all slides (at least next slide) in background (useful for images)

const md = window.markdownit();
const keys = window.tinykeys;

const urlParams = new URLSearchParams(window.location.search);
console.log("url:", urlParams.get("url"));

function renderMarkdown(doc) {
  const result = md.render(doc);
  const content = document.getElementById("content");
  content.innerHTML = result;
}

function renderSlideCounter(current, max) {
  const slide_count = document.getElementById("slide-count");
  const progressbar = document.getElementById("progressbar");
  // TODO: use text instead of html
  slide_count.innerHTML = `${current}/${max}`;
  progressbar.style.width = (current / max) * 100 + "vw";
}

function renderSlides(slides, currentSlide) {
  renderMarkdown(slides[currentSlide]);
  renderSlideCounter(currentSlide + 1, slides.length);
}

const sampleContent = `
Let me show you some code.

\`\`\`python
import os
os.environ["HOST"].startswith("linux")
\`\`\`

---

Is _this_ some kind of **magic**?

---

No, this is just \`code\`.

---

# Boo 🐶

![sample-image](https://puppytoob.com/wp-content/uploads/2018/02/Boo-Dog-1.jpg)
`;

const slides = sampleContent.split(/---/).map((k) => k.trim());
const slideCount = slides.length - 1;
let currentSlide = 3;
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
