export function getMoble() {
  var prefixArray = new Array('130', '131', '132', '133', '135', '137', '138', '170', '187', '189')
  var i = parseInt(10 * Math.random())
  var prefix = prefixArray[i]
  for (var j = 0; j < 8; j++) {
    prefix = prefix + Math.floor(Math.random() * 10)
  }
  return prefix
}

export function getName() {
  var familyNames = new Array(
    '赵',
    '钱',
    '孙',
    '李',
    '周',
    '吴',
    '郑',
    '王',
    '冯',
    '陈',
    '褚',
    '卫',
    '蒋',
    '沈',
    '韩',
    '杨',
    '朱',
    '秦',
    '尤',
    '许',
    '何',
    '吕',
    '施',
    '张',
    '孔',
    '曹',
    '严',
    '华',
    '金',
    '魏',
    '陶',
    '姜',
    '戚',
    '谢',
    '邹',
    '喻',
    '柏',
    '水',
    '窦',
    '章',
    '云',
    '苏',
    '潘',
    '葛',
    '奚',
    '范',
    '彭',
    '郎',
    '鲁',
    '韦',
    '昌',
    '马',
    '苗',
    '凤',
    '花',
    '方',
    '俞',
    '任',
    '袁',
    '柳',
    '酆',
    '鲍',
    '史',
    '唐',
    '费',
    '廉',
    '岑',
    '薛',
    '雷',
    '贺',
    '倪',
    '汤',
    '滕',
    '殷',
    '罗',
    '毕',
    '郝',
    '邬',
    '安',
    '常',
    '乐',
    '于',
    '时',
    '傅',
    '皮',
    '卞',
    '齐',
    '康',
    '伍',
    '余',
    '元',
    '卜',
    '顾',
    '孟',
    '平',
    '黄',
    '和',
    '穆',
    '萧',
    '尹'
  )
  var givenNames = new Array(
    '子璇',
    '淼',
    '国栋',
    '夫子',
    '瑞堂',
    '甜',
    '敏',
    '尚',
    '国贤',
    '贺祥',
    '晨涛',
    '昊轩',
    '易轩',
    '益辰',
    '益帆',
    '益冉',
    '瑾春',
    '瑾昆',
    '春齐',
    '杨',
    '文昊',
    '东东',
    '雄霖',
    '浩晨',
    '熙涵',
    '溶溶',
    '冰枫',
    '欣欣',
    '宜豪',
    '欣慧',
    '建政',
    '美欣',
    '淑慧',
    '文轩',
    '文杰',
    '欣源',
    '忠林',
    '榕润',
    '欣汝',
    '慧嘉',
    '新建',
    '建林',
    '亦菲',
    '林',
    '冰洁',
    '佳欣',
    '涵涵',
    '禹辰',
    '淳美',
    '泽惠',
    '伟洋',
    '涵越',
    '润丽',
    '翔',
    '淑华',
    '晶莹',
    '凌晶',
    '苒溪',
    '雨涵',
    '嘉怡',
    '佳毅',
    '子辰',
    '佳琪',
    '紫轩',
    '瑞辰',
    '昕蕊',
    '萌',
    '明远',
    '欣宜',
    '泽远',
    '欣怡',
    '佳怡',
    '佳惠',
    '晨茜',
    '晨璐',
    '运昊',
    '汝鑫',
    '淑君',
    '晶滢',
    '润莎',
    '榕汕',
    '佳钰',
    '佳玉',
    '晓庆',
    '一鸣',
    '语晨',
    '添池',
    '添昊',
    '雨泽',
    '雅晗',
    '雅涵',
    '清妍',
    '诗悦',
    '嘉乐',
    '晨涵',
    '天赫',
    '玥傲',
    '佳昊',
    '天昊',
    '萌萌',
    '若萌'
  )
  return (
    familyNames[parseInt(Math.random() * familyNames.length)] +
    givenNames[parseInt(Math.random() * givenNames.length)]
  )
}

export function getCarNo() {
  var citys = [
    '京',
    '津',
    '晋',
    '湘',
    '赣',
    '沪',
    '渝',
    '冀',
    '台',
    '辽',
    '吉',
    '黑',
    '苏',
    '浙',
    '皖',
    '闽',
    '鲁',
    '豫',
    '鄂',
    '青',
    '粤',
    '琼',
    '川',
    '贵',
    '云',
    '陕',
    '甘',
    '藏',
    '桂',
    '蒙',
    '宁',
    '新',
    '港',
    '澳'
  ]
  //车牌号所在地区
  var area = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'J', 'L', 'M', 'N', 'O', 'P', 'Q']
  //车牌号后5位
  var nums = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'J',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9'
  ]
  // 随机生成后5位
  function getend(n) {
    var res = ''
    for (var i = 0; i < n; i++) {
      var id = Math.floor(Math.random() * 36)
      res += nums[id]
    }
    return res
  }
  return (
    citys[Math.floor(Math.random() * citys.length)] +
    area[Math.floor(Math.random() * area.length)] +
    getend(5)
  )
}

export function formatDate(time, format = 'YYYY-MM-DD hh:mm:ss') {
  var date = new Date(time)

  var year = date.getFullYear(),
    month = date.getMonth() + 1, //月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds()
  var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
    return '0' + index
  }) ////开个长度为10的数组 格式为 00 01 02 03

  var newTime = format
    .replace(/YYYY/g, year)
    .replace(/MM/g, preArr[month] || month)
    .replace(/DD/g, preArr[day] || day)
    .replace(/hh/g, preArr[hour] || hour)
    .replace(/mm/g, preArr[min] || min)
    .replace(/ss/g, preArr[sec] || sec)

  return newTime
}
