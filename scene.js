import $ from 'jquery'

export default class Scene {
  constructor(list) {
    this.list = [].concat(...list)
    this.items = []
    this.timer = null

    this.result = []

    this.render(this.list)
  }

  // 生成名单dom
  render(list) {
    let frags = document.createDocumentFragment()
    let len = list.length;
    for (let i = 0; i < len; i++) {
      let dom = document.createElement('span')
      dom.innerHTML = list[i]['number']
      dom.number = list[i]['number']
      dom.name = list[i]['name']
      dom.className = 'ta'
      frags.appendChild(dom)
    }
    document.querySelector('.scene-box').innerHTML = ''
    document.querySelector('.scene-box').appendChild(frags)

    this.updatePos()
    window.addEventListener('resize', () => {
      this.updatePos()
    })
  }

  // 随机重置位置
  updatePos() {
    this.items = $('.ta')
    const arr = this.items.sort(() => Math.random() - .5)
    const w = 64
    const h = 30
    const space = 1
    const winWidth = window.innerWidth
    const winHeight = window.innerHeight
    const row = Math.floor((winWidth - w - space) / w)
    const len = arr.length
    const ww = (winWidth - (w+space) * row) / 2
    const hh = (winHeight - (h+space) * Math.floor(len/row)) / 2 + 50
    for (let i = 0; i < len; i++) {
      arr[i].style.left = `${(w+space) * (i%row) + ww}px`
      arr[i].style.top = `${(h+space) * Math.floor(i/row) + hh}px`
    }
  }

  // 闪烁
  flicker(n) {
    const len = this.items.length
    this.timer = setInterval(() => {
      $('.ta').removeClass('on')
      for (let i = 0; i < n; i++) {
        const r = Math.floor(Math.random() * len)
        $(this.items[r]).addClass('on')
      }
    }, 360)
  }

  // 根据传入的结果 高亮对应dom
  showResult(arr) {
    clearInterval(this.timer)
    let _arr = []
    $('.ta').removeClass('on').addClass('dark')

    const len = this.items.length
    for (let i = 0; i < len; i++) {
      for(let j = 0; j < arr.length; j++){
        if(this.items[i]['number'] === arr[j]['number']) {
          _arr.push(this.items[i])
          $(this.items[i]).removeClass('dark').addClass('on')

          this.result.push({
            number: this.items[i]['number'],
            name: this.items[i]['name']
          })
          
          break
        }
      }
    }

    this.flip(_arr)
  }

  // 翻转效果 显示名字
  flip(arr) {
    for(let i = 0; i < arr.length; i++) {
      setTimeout(() => {
        $(arr[i]).text('').addClass('flip').attr('data-content', arr[i]['name'])
      },i * 120 + 1000)
    }
  }

  // 去掉已选中的dom 重置列表
  refresh() {
    const ons = $('.scene-box .on')
    ons.each((i, e) => {
      const t = Math.random() * 1200 + 800
      $(e).css({
        top: 2000,
        transition: `all ${t}ms`
      })
    })
    
    setTimeout(() => {
      ons.remove()
      $('.scene-box .dark').removeClass('dark')
      setTimeout(() => {
        this.updatePos()
      },300)
    }, 600)
  }

  getResult() {
    return this.result
  }

}