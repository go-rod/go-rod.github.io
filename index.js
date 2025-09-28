; (() => {

  window.$docsify = {
    name: 'Rod',
    loadNavbar: true,
    loadSidebar: true,
    auto2top: true,
    subMaxLevel: 3,
    search: {
      namespace: location.pathname,
      placeholder: l('search-placeholder'),
      noData: l('search-noData'),
    },
    plugins: [pluginChapterNav, zoomImg, analytics]
  }

  function pluginChapterNav(hook, vm) {
    const chapterNav = document.querySelector('#chapter-nav')

    hook.doneEach(() => {
      gtag('set', 'page_path', vm.route.path)
      gtag('event', 'page_view')

      const list = Array.from(document.querySelectorAll(`.sidebar-nav a:not(.section-link)`))
      const i = list.findIndex(e => e.getAttribute('href') === '#' + vm.route.path)

      const article = document.querySelector('article')
      article.appendChild(chapterNav)
      const btnPrev = chapterNav.querySelector('.prev')
      const btnNext = chapterNav.querySelector('.next')

      if (i > 0) {
        btnPrev.href = list[i - 1].getAttribute('href')
        btnPrev.querySelector('.title').textContent = list[i - 1].textContent
        btnPrev.style.display = 'block'
      } else {
        btnPrev.style.display = 'none'
      }
      if (i < list.length - 1) {
        btnNext.href = list[i + 1].getAttribute('href')
        btnNext.querySelector('.title').textContent = list[i + 1].textContent
        btnNext.style.display = 'block'
      } else {
        btnNext.style.display = 'none'
      }
      chapterNav.style.display = 'flex'
    })
  }

  function zoomImg(hook, vm) {
    hook.doneEach(() => {
      new Zooming({
        bgColor: 'rgba(28, 35, 37, 0.9)',
      }).listen('article img:not(.no-zoom)')
    })
  }

  function l(key) {
    return document.querySelector(`#strings [${key}]`).textContent
  }

  function analytics(hook, vm) {
    // If stay on any page for more than 30s, we count it as a conversion
    let id
    hook.doneEach(() => {
      clearTimeout(id)
      id = setTimeout(() => {
        gtag('event', 'conversion', { path: vm.route.path })
      }, 30 * 1000);
    })
  }
})()
