;(async () => {

  window.$docsify = {
    name: 'Rod',
    loadNavbar: true,
    loadSidebar: true,
    auto2top: true,
    subMaxLevel: 3,
    plugins: [pluginChapterNav]
  }

  await importScript('css','https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple-dark.css')
  await importScript('css','/index.css')
  
  await importScript('js','//cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js')
  await importScript('js','//cdn.jsdelivr.net/npm/prismjs@1/components/prism-go.min.js')
  await importScript('js','//cdn.jsdelivr.net/npm/docsify/lib/plugins/search.min.js')
  await importScript('js','//cdn.jsdelivr.net/npm/docsify/lib/plugins/zoom-image.min.js')
  await importScript('js','//cdn.jsdelivr.net/npm/docsify-copy-code')

  function pluginChapterNav(hook, vm) {
    const chapterNav = document.querySelector('#chapter-nav')

    const ready = new Promise((r) => hook.ready(r))
    hook.afterEach(async (html, next) => {
      await ready

      const list = Array.from(document.querySelectorAll(`.sidebar-nav a:not(.section-link)`))
      const i = list.findIndex(e => e.getAttribute('href') === '#' + vm.route.path)

      next(html)

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

  function importScript(type, url) {
    return new Promise((resolve, reject) => {
      let s
      if (type === 'js') {
        s = document.createElement('script')
        s.src = url
      } else {
        s = document.createElement('link')
        s.rel = 'stylesheet'
        s.href = url
      }
      s.onload = resolve
      s.onerror = reject
      document.head.appendChild(s)
    })
  }
})()
