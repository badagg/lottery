import './style.less'
import $ from 'jquery'

import Lottery from './lottery'
import Scene from './scene'
import { list } from './list'

// 奖品类型
const fourthTypes = ['充电宝', '膳魔师杯子', '足浴盆']
const thirdTypes = ['京东礼品卡A', '京东礼品卡B', '京东礼品卡C']
const secondTypes = ['switch', 'ps4']
const firstTypes = ['ipad', '微单']

// 抽奖初始化
const lottery = new Lottery(list)

// 三、四等奖按桌分配
lottery.plan(fourthTypes, thirdTypes)

// 初始化场景
const scene = new Scene(list)

// 流程
const steps = [
  {
    name: '四等奖',
    prize: '无线充电器 / 膳魔师杯子 / 荣事达足浴盆',
    degree: 28,
    result: () => lottery.findPrize(lottery.getAllList(), 4, fourthTypes[0]),
  },
  {
    name: '四等奖',
    prize: '无线充电器 / 膳魔师杯子 / 荣事达足浴盆',
    degree: 28,
    result: () => lottery.findPrize(lottery.getAllList(), 4, fourthTypes[1]),
  },
  {
    name: '四等奖',
    prize: '无线充电器 / 膳魔师杯子 / 荣事达足浴盆',
    degree: 28,
    result: () => lottery.findPrize(lottery.getAllList(), 4, fourthTypes[2]),
  },
  {
    name: '三等奖',
    prize: '1000面值京东卡',
    degree: 14,
    result: () => lottery.findPrize(lottery.getAllList(), 3, thirdTypes[0]),
  },
  {
    name: '三等奖',
    prize: '1000面值京东卡',
    degree: 14,
    result: () => lottery.findPrize(lottery.getAllList(), 3, thirdTypes[1]),
  },
  {
    name: '三等奖',
    prize: '1000面值京东卡',
    degree: 14,
    result: () => lottery.findPrize(lottery.getAllList(), 3, thirdTypes[2]),
  },
  {
    name: '二等奖',
    prize: 'Switch NS彩色港版',
    degree: 5,
    result: () => lottery.start(2, secondTypes[0], 5),
  },
  {
    name: '二等奖',
    prize: 'Switch NS彩色港版',
    degree: 5,
    result: () => lottery.start(2, secondTypes[0], 5),
  },
  {
    name: '二等奖',
    prize: 'PS4 Pro 1T',
    degree: 5,
    result: () => lottery.start(2, secondTypes[1], 5),
  },
  {
    name: '二等奖',
    prize: 'PS4 Pro 1T',
    degree: 5,
    result: () => lottery.start(2, secondTypes[1], 5),
  },
  {
    name: '一等奖',
    prize: 'Apple iPad Pro',
    degree: 3,
    result: () => lottery.start(1, firstTypes[0], 3),
  },
  {
    name: '一等奖',
    prize: '佳能G1 x Mark III微单',
    degree: 3,
    result: () => lottery.start(1, firstTypes[1], 3),
  }
]

// 抽奖顺序索引
let lotteryIndex = 0
// 点击的类型
let clickStatus = 0

const stepLen = steps.length

// 获取dom
const xianyu = $('.xianyu-box')
const headTop = $('.head-top')
const headAgain = $('.again')
const lotteryButton = $('.btn-start')
const lotteryBtnText = $('.btn-start strong')
const lotteryPage = $('.btn-start em')
const grade = $('.grade')
const gradeType = $('.grade-type')
const againButton = $('.btn-again')

// 显示结果
function showResult(result) {
  console.log(result)
  scene.showResult(result)

  saveResult(result)
}

function updateText() {
  lotteryPage.text(`${lotteryIndex+1} / ${stepLen}`)
  grade.text(steps[lotteryIndex]['name'])
  gradeType.text(steps[lotteryIndex]['prize'])
}

// 显示咸鱼翻身面板
window.showXianyu = function() {
  xianyu.show()
  headAgain.show()
  headTop.hide()

  scene.refresh(() => {
    scene.updatePos()
  })
}

// 加抽
function again(grade, name, prize, type, n) {
  lotteryIndex = -1
  xianyu.hide()
  headAgain.text(`${name} : ${prize}`)

  scene.flicker(n)

  setTimeout(() => {
    showResult(lottery.start(grade, type, n))
    againButton.show()
  },5000)
}

// 存储 本地
const saveResult = function(result) {
  window.localStorage.setItem('lottery', JSON.stringify({
    index: lotteryIndex,
    lastResult: result,
    list: lottery.getAllList()
  }))
}

// 存储 服务
window.saveData = function() {
  $.ajax({
    url: 'http://localhost:3000/save',
    dataType: 'json',
    type: 'POST',
    data: JSON.stringify(lottery.getAllList()),
    headers: {
      'Content-Type': "application/json; charset=utf-8"
    }
  })
}

// 场景和数据恢复
window.recover = function() {
  let localData = JSON.parse(window.localStorage.getItem('lottery'))
  lotteryIndex = localData.index
  lottery.setAllList(localData.list)

  if(lotteryIndex !== -1){
    updateText()
    clickStatus = 2
    lotteryBtnText.text('NEXT')
    headAgain.hide()
    headTop.show()

    lotteryIndex++
  }else {
    headAgain.show()
    headTop.hide()
  }

  // 重置动画 列表元素
  let _list = localData.list.filter(value => {
    return !value.show
  }).concat(localData.lastResult)

  scene.render(_list)
  scene.showResult(localData.lastResult)
}

// 测试
window.testRun = function() {
  let arr1 = []
  let arr2 = []
  lottery.getAllList().filter(value => value.grade).forEach((e) => {
    arr1.push(e['number'])
  })
  scene.getResult().forEach((e) => {
    arr2.push(e['number'])
  })

  arr1.sort()
  arr2.sort()

  console.log(arr1.length, arr2.length)
  arr1.forEach((e, i) => {
    console.log(arr1[i], arr2[i], arr1[i] === arr2[i])
  })
}

// 点击锁 防止连续点击误操作
// 按钮事件绑定
let lock = false

lotteryButton.on('click', () => {
  if(lock) return
  lock = true
  setTimeout(() => { lock = false },1000)

  // 结束
  if(lotteryIndex === stepLen) {
    lotteryPage.text('')
    lotteryBtnText.text('完结')
    grade.text('阳光普照')
    gradeType.text('大吉大利')
    againButton.show()

    scene.refresh(() => {
      scene.updatePos()
    })
    return
  }

  if(clickStatus === 0) { // 开始
    clickStatus = 1
    lotteryBtnText.text('STOP')
    updateText()

    // 闪烁动画
    scene.flicker(steps[lotteryIndex]['degree'])

  }else if(clickStatus === 1) { // 结束
    clickStatus = 2
    lotteryBtnText.text('NEXT')

    // 显示结果
    showResult(steps[lotteryIndex]['result']())

    lotteryIndex++
  }else if(clickStatus === 2) { // 下一个
    clickStatus = 0
    lotteryBtnText.text('START')

    // 剔除已中奖 打乱重排
    scene.refresh(() => {
      scene.updatePos()
    })

    updateText()
  }
})

$('#btn0').on('click', () => { again(10, '？？？', '超级欧皇奖', '超级欧皇奖', 1) })

$('#btn2_1').on('click', () => { again(2, '二等奖', 'Switch NS彩色港版', secondTypes[0], 1) })

$('#btn2_2').on('click', () => { again(2, '二等奖', 'PS4 Pro 1T', secondTypes[1], 1) })

$('#btn1_1').on('click', () => { again(1, '一等奖', 'Apple iPad Pro', firstTypes[0], 1) })

$('#btn1_2').on('click', () => { again(1, '一等奖', '佳能G1 x Mark III微单', firstTypes[1], 1) })

againButton.on('click', () => {
  againButton.hide()
  window.showXianyu()
})