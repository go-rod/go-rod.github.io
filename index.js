;(() => {

  window.$docsify = {
    name: 'Rod',
    loadNavbar: true,
    loadSidebar: true,
    auto2top: true,
    subMaxLevel: 3,
    plugins: [pluginChapterNav, zoomImg]
  }

  function pluginChapterNav(hook, vm) {
    const chapterNav = document.querySelector('#chapter-nav')

    hook.doneEach(() => {

      const list = Array.from(document.querySelectorAll(`.sidebar-nav a:not(.section-link)`))
      const i = list.findIndex(e => e.getAttribute('href') === '#' + vm.route.path)

      const article = document.querySelector('article')
      article.appendChild(chapterNav)
      const btnPrev = chapterNav.querySelector('.prev')
      const btnNext = chapterNav.querySelector('.next')

      if (i > 0) {
        btnPrev.href = list[i-1].getAttribute('href')
        btnPrev.querySelector('.title').textContent = '« ' + list[i-1].textContent
        btnPrev.style.display = 'block'
      } else {
        btnPrev.style.display = 'none'
      }
      if (i < list.length - 1) {
        btnNext.href = list[i+1].getAttribute('href')
        btnNext.querySelector('.title').textContent = list[i+1].textContent + ' »'
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
      }).listen('article img')
    })
  }
})()
