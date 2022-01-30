// TODO ITEMS
// syntax highlight
// option to enable disable features(progresbar, counter)
// get content from url
// apply custom css from url
// few basic themes
// expose soe theme features in url (progressbar color)
// cache all slides (at least next slide) in background (useful for images)
// option to add a watermark (specify position - default: bottom left | pass in an image url)

const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
      } catch (__) {}
    }

    return '' // use external default escaping
  },
})
const keys = window.tinykeys

const urlParams = new URLSearchParams(window.location.search)
const contentUrl = urlParams.get('url')
// console.log("url:", urlParams.get("url"));

function renderMarkdown(doc) {
  const result = md.render(doc)
  const content = document.getElementById('content')
  content.innerHTML = result
}

function renderSlideCounter(current, max) {
  const slide_count = document.getElementById('slide-count')
  const progressbar = document.getElementById('progressbar')
  // TODO: use text instead of html
  slide_count.innerHTML = `${current}/${max}`
  progressbar.style.width = (current / max) * 100 + 'vw'
}

function renderSlides(slides, currentSlide) {
  renderMarkdown(slides[currentSlide])
  renderSlideCounter(currentSlide + 1, slides.length)
}

const hello = document.getElementById('hello')
const present = document.getElementById('present')
function showHello() {
  hello.style.display = 'block'
  present.style.display = 'none'
}
function showPresentation() {
  hello.style.display = 'none'
  present.style.display = 'block'
}

function startPresentation(content) {
  showPresentation()
  const slides = content.split(/\n---/).map((k) => k.trim())
  const slideCount = slides.length - 1
  let currentSlide = 0
  renderSlides(slides, currentSlide)
  keys(window, {
    Space: () => {
      if (currentSlide < slideCount) currentSlide += 1
      renderSlides(slides, currentSlide)
    },
    ArrowRight: () => {
      if (currentSlide < slideCount) currentSlide += 1
      renderSlides(slides, currentSlide)
    },
    ArrowLeft: () => {
      if (currentSlide > 0) currentSlide -= 1
      renderSlides(slides, currentSlide)
    },
    'Shift+Space': () => {
      if (currentSlide > 0) currentSlide -= 1
      renderSlides(slides, currentSlide)
    },
  })
}

if (contentUrl !== null) {
  if (contentUrl == '_file') {
    startPresentation(localStorage.getItem('content'))
  } else {
    fetch(contentUrl)
      .then((data) => data.text())
      .then((content) => {
        console.log(content)
        startPresentation(content)
      })
      .catch(() => {
        alert('Unable to present document. Make sure the link is valid.')
        showHello()
      })
  }
} else {
  showHello()
}

const presentButton = document.getElementById('present-button')
presentButton.onclick = () => {
  const presentLink = document.getElementById('present-link')
  console.log(presentLink.value)
  const plausibleLink = presentLink.value
  fetch(plausibleLink)
    .then((data) => data.text())
    .then(() => {
      window.location = window.location.origin + '?url=' + plausibleLink
    })
    .catch((e) => {
      console.log('Woopsie')
      console.log(e.message)
    })
}

const fileUploader = document.getElementById('file-uploader')
document.getElementById('present-link').onkeyup = function (e) {
  if (e.target.value.length > 0) {
    presentButton.style.display = 'block'
    fileUploader.style.display = 'none'
  } else {
    presentButton.style.display = 'none'
    fileUploader.style.display = 'block'
  }
}

fileUploader.addEventListener('change', function (e) {
  var fr = new FileReader()
  fr.onload = function () {
    localStorage.setItem('content', fr.result)
    window.location = window.location.origin + '?url=_file'
  }
  fr.readAsText(e.target.files[0])
})
