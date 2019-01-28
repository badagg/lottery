export default class Lottery {
  constructor(list) {
    this.list = list
  }

  /**
   * 查找奖项
   * @param grade 奖品等级
   * @param gradeType 对应的奖品
   * 用于三、四等奖的查询
   */
  findPrize(arr, grade, gradeType){
    const len = arr.length
    let newArr = []

    for(let i = 0; i < len; i++) {
      const item = arr[i]
      if (grade === item['grade'] && gradeType === item['gradeType']) {
        // 标示显示过了
        item['show'] = true
        newArr.push(item)
      }
    }

    return newArr
  }

  /**
   * 开始抽奖
   * @param grade 抽奖等级
   * @param gradeType 对应的奖品
   * @param degree 一次抽多少个
   * 用于一、二等奖和加抽使用
   */
  start(grade, gradeType, degree) {
    const len = this.list.length
    let newArr = []
    while (newArr.length < degree) {
      const r = Math.floor(Math.random() * len)
      let el = this.list[r]
      if (!newArr.includes(el) && !el.grade) {
        el['grade'] = grade
        el['gradeType'] = gradeType
        el['show'] = true
        newArr.push(el)
      }
    }

    return newArr
  }

  /**
   * @param fTypes 四等奖的类型列表
   * @param sTypes 三等奖的类型列表
   * plan函数，用于三、四等奖的几个阶段
   * 规则: 按桌平均分配，每桌随机三等奖一位 四等奖两位
   */
  plan(fTypes, sTypes) {
    const len = this.list.length
    let n1 = 0
    let n2 = 0

    // 按桌遍历 每桌分配两个四等 和 一个三等奖
    for (let i = 0; i < len; i++) {
      const _len = this.list[i].length
      let _arr = []

      // 每桌找出三个不重复的元素
      while (_arr.length < 3) {
        const r = Math.floor(Math.random() * _len)
        if (!_arr.includes(r)) {
          _arr.push(r)

          // 把第三个分配给 三等奖
          if(_arr.length === 3) {
            this.list[i][r]['grade'] = 3
            this.list[i][r]['gradeType'] = sTypes[n1++ % sTypes.length]
          }else {
            this.list[i][r]['grade'] = 4
            this.list[i][r]['gradeType'] = fTypes[n2++ % fTypes.length]
          }
        }
      }
    }

    // 三等奖之后 扁平化数组 进入全随机
    this.list = [].concat(...this.list)
  }

  getAllList() {
    return this.list
  }

  setAllList(list) {
    this.list = list
  }

}