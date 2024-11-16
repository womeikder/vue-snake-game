<template>
  <div class="main">
    <div class="title">
      <div class="score">当前分数: {{ score }}</div>
    </div>
    <div class="game-box">
      <ul>
<!--        游戏的小格子-->
        <li
            v-for="(item,index) in gameMap"
            :key="index"
            :class="{
              head: item.showHead,
              bodyOne: item.showBodyOne,
              bodyTwo: item.showBodyTwo,
              bodyThree: item.showBodyThree,
              bodyFour: item.showBodyFour,
              r40: item.R40,
              r130: item.R130,
              rm50: item.RM50,
              rm140: item.RM140,
              foodOne: item.foodOne,
              foodTwo: item.foodTwo
            }">
        </li>
      </ul>
    </div>
    <div class="game-over" v-if="gameOver">
      <div class="img"></div>
      <div class="over-score">
        <div>历史最高: {{ historyRecord.count }}</div>
        <div>最终得分: {{ score }}</div>
      </div>
      <div class="btn">
        <button id="reset" @click="overOperation(true)">再来一局</button>
        <button id="over" @click="overOperation(false)">退出游戏</button>
      </div>
    </div>
  </div>
</template>

<script setup>

import {onMounted, ref} from "vue";
import {useCounterStore} from "@/stores/counter.js";
// 游戏地图
const gameMap = ref([])

// 蛇的下标数组
const snakeBody = ref([10,11,12,13,14,15,16,17,18,19,20,21,22])

// 移动方向
const direction = ref('right')

// 食物下标
const foodOneIndex = ref([])
const foodTwoIndex = ref([])

// 定时器
const timer = ref(null)

// 分数
const score = ref(0)

// 游戏的状态
const gameOver = ref(false)

for (let i = 0; i < 600; i++) {
  gameMap.value.push({})
}

const overOperation = (type) => {
  if (type) {
    location.reload()
  } else {
    window.opener = null
    window.close()
  }
}

const historyRecord = useCounterStore()

// 生成蛇
const geneSnake = () => {
  // 生成蛇的数值
  gameMap.value[snakeBody.value[snakeBody.value.length-1]].showHead = true
  for (let i = 0; i < snakeBody.value.length-1; i++) {
    if (snakeBody.value[i] % 2 === 0) {
      if (snakeBody.value[i] % 4 === 0) {
        gameMap.value[snakeBody.value[i]].showBodyFour = true
      } else {
        gameMap.value[snakeBody.value[i]].showBodyTwo = true
      }
    } else {
      if (snakeBody.value[i] % 3 === 0) {
        gameMap.value[snakeBody.value[i]].showBodyThree = true
      } else {
        gameMap.value[snakeBody.value[i]].showBodyOne = true
      }
    }
  }
  // 处理角度
  for (let i = 0; i < snakeBody.value.length-1; i++) {
    const item = snakeBody.value[i]
    const next = snakeBody.value[i+1]
    switch (item - next) {
      case -1: gameMap.value[item].R40 = true
            break
      case 1: gameMap.value[item].RM140 = true
            break
      case -40: gameMap.value[item].R130 = true
            break
      case 40: gameMap.value[item].RM50 = true
            break
    }
  }
  // 处理头
  const lastIndex = snakeBody.value[snakeBody.value.length-1]
  switch (direction.value) {
    case 'right': gameMap.value[lastIndex].R40 = true
          break
    case 'left': gameMap.value[lastIndex].RM140 = true
      break
    case 'up': gameMap.value[lastIndex].RM50 = true
      break
    case 'down': gameMap.value[lastIndex].R130 = true
      break
  }

}
geneSnake()

// 生成食物
for (let i = 0; i < 5; i++) {
  while (true) {
    let OneIndex = parseInt(Math.random() * gameMap.value.length)
    let TwoIndex = parseInt(Math.random() * gameMap.value.length)
    if (snakeBody.value.includes(OneIndex) || snakeBody.value.includes(TwoIndex) || foodOneIndex.value.includes(OneIndex) || foodTwoIndex.value.includes(TwoIndex)) {
      continue
    }
    foodOneIndex.value.push(OneIndex)
    foodTwoIndex.value.push(TwoIndex)
    gameMap.value[OneIndex].foodOne = true
    gameMap.value[TwoIndex].foodTwo = true
    break
  }
}



// 控制方向
onMounted(() => {
  // 监听键盘事件
  document.addEventListener('keydown',ev => {
    switch (ev.keyCode) {
      // 如果相反的方向是不可以转换的
      case 40:
        if (direction.value === 'up') break
        direction.value = 'down'
        break
      case 37:
        if (direction.value === 'right') break
        direction.value = 'left'
        break
      case 38:
        if (direction.value === 'down') break
        direction.value = 'up'
        break
      case 39:
        if (direction.value === 'left') break
        direction.value = 'right'
        break
    }
  })
})

// 蛇移动函数
const move = () => {
  // 判断边界条件
  if (
      (direction.value === 'right' && (snakeBody.value[snakeBody.value.length-1] + 1) % 40 === 0) ||
      (direction.value === 'down' && (snakeBody.value[snakeBody.value.length-1]) >= 600-40) ||
      (direction.value === 'up' && (snakeBody.value[snakeBody.value.length-1]) < 40) ||
      (direction.value === 'left' && (snakeBody.value[snakeBody.value.length-1]) % 40 === 0) ||
      (snakeBody.value.slice(0,snakeBody.value.length-2).includes(snakeBody.value[snakeBody.value.length-1]))
  ) {
    console.log(snakeBody.value.slice(0,snakeBody.value.length-1),snakeBody.value[snakeBody.value.length-1])
    gameOver.value = true
    historyRecord.replace(score.value)
    clearInterval(timer.value)
    return
  }

  // 先清除所有格子的状态
  gameMap.value.forEach(item => {
    item.showHead = false
    item.showBodyOne = false
    item.showBodyTwo = false
    item.showBodyThree = false
    item.showBodyFour = false
    item.RM50 = false
    item.RM140 = false
    item.R40 = false
    item.R130 = false
  })

  // 根据情况移动方向
  const steps = ref(0)
  switch (direction.value) {
    case 'right': steps.value = 1
          break
    case 'left': steps.value = -1
      break
    case 'up': steps.value = -40
      break
    case 'down': steps.value = 40
      break

  }

  // 处理snakeBody数组
  snakeBody.value.splice(0,1)
  snakeBody.value.push(snakeBody.value[snakeBody.value.length - 1] + steps.value)

  let headIndex = snakeBody.value[snakeBody.value.length - 1]
  // 渲染蛇之前需要判断是否吃到食物
  if (foodOneIndex.value.includes(headIndex)) {
    snakeBody.value.push(headIndex)
    foodOneIndex.value.splice(foodOneIndex.value.indexOf(headIndex),1)
    gameMap.value[headIndex].foodOne = false
    score.value += 1
    for (let i = 0; i < score.value % 3; i++) {
      while (true) {
        let OneIndex = parseInt(Math.random() * gameMap.value.length)
        if (snakeBody.value.includes(OneIndex) || foodOneIndex.value.includes(OneIndex)) {
          continue
        }
        foodOneIndex.value.push(OneIndex)
        gameMap.value[OneIndex].foodOne = true
        break
      }
    }

  } else if (foodTwoIndex.value.includes(headIndex)) {
    snakeBody.value.push(headIndex)
    foodTwoIndex.value.splice(foodTwoIndex.value.indexOf(headIndex),1)
    gameMap.value[headIndex].foodTwo = false
    score.value += 1
    for (let i = 0; i < score.value % 3; i++) {
      while (true) {
        let twoIndex = parseInt(Math.random() * gameMap.value.length)
        if (snakeBody.value.includes(twoIndex) || foodTwoIndex.value.includes(twoIndex)) {
          continue
        }
        foodTwoIndex.value.push(twoIndex)
        gameMap.value[twoIndex].foodTwo = true
        break
      }
    }
  }

  // 重新生成蛇
  geneSnake()

}
// 定时移动
timer.value =  setInterval(move,100)

</script>

<style lang="less" scoped>
.main {
  width: 100vw;
  height: 100vh;
  background-image: url("@/assets/image/main.jpeg");
  background-size: cover;
  background-repeat: no-repeat;
  .title {
    width: 330px;
    height: 156px;
    background-image: url("@/assets/image/title.png");
    background-size: cover;
    background-repeat: no-repeat;
    margin: 0 auto;
    position: relative;
    .score {
      color: white;
      font-size: larger;
      position: absolute;
      bottom: -95px;
      right: -350px;
    }
  }
  .game-box {
    width: 1200px;
    height: 450px;
    margin: 100px auto;
    border: 1px solid #c5f1e8;
    ul {
      display: grid;
      //设置列数，一列多少个 每一列的像素
      grid-template-columns: repeat(40, 30px);
      //设置行数，一行多少个 每一行的像素
      grid-template-rows: repeat(15, 30px);
      list-style: none;
      margin-left: -40px;
      margin-top: -1px;
      li {
        width: 30px;
        height: 30px;
        box-shadow: 0.5px 0.5px 0.5px #c5f1e8;

      }
    }
  }
  .game-over {
    width: 90vw;
    height: 800px;
    background: rgba(197, 241, 232, 0.47);
    border-radius: 50px;
    border: 2px solid rgba(197, 241, 232, 0.47);
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50% , -50%);
    box-shadow: 5px 5px 5px rgba(197, 241, 232, 0.58);
    .img {
      width: 1600px;
      height: 500px;
      background-image: url("@/assets/image/game-over.png");
      background-repeat: no-repeat;
      background-size: 1500px 500px;
    }
    .over-score {
      width: 350px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      font-size: 30px;
      color: #b909e8;
      font-weight: bolder;
    }
    .btn {
      width: 350px;
      margin: 50px auto;
      display: flex;
      justify-content: space-between;
      button {
        width: 150px;
        height: 50px;
        border-radius: 15px;
        border: none;
        box-shadow: 3px 3px 3px gray;
      }
      #reset {
        background: rgba(127, 255, 212, 0.25);
        border:1px solid #27ceae;
        cursor: pointer;
      }
      #over {
        background: rgba(127, 207, 253, 0.25);
        border:1px solid #278bce;
        cursor: pointer;
      }
      #reset:hover {
        background: rgb(46, 204, 49);

      }
      #over:hover {
        background: rgb(209, 215, 38);

      }
    }

  }
}

.head::before {
  background-image: url("@/assets/image/snake/head.png");
}
.bodyOne::before {
  background: url("@/assets/image/snake/body1.png");
}
.bodyTwo::before {
  background: url("@/assets/image/snake/body2.png");
}
.bodyThree::before {
  background: url("@/assets/image/snake/body3.png");
}
.bodyFour::before {
  background: url("@/assets/image/snake/body4.png");
}
.foodOne::before {
  background: url("@/assets/image/food1.png");
}
.foodTwo::before {
  background: url("@/assets/image/food2.png");
}
.head::before, .bodyOne::before, .bodyTwo::before, .bodyThree::before, .bodyFour::before, .foodOne::before, .foodTwo::before {
  content: "";
  width: 30px;
  height: 30px;
  display: block;
  background-size: 30px 30px;
  background-repeat: no-repeat;
}

.r40::before {
  transform: rotate(40deg);
}
.r130::before {
  transform: rotate(130deg);
}
.rm50::before {
  transform: rotate(-50deg);
}
.rm140::before {
  transform: rotate(-140deg);
}

</style>