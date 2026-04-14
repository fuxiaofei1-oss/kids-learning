import Phaser from 'phaser'

// 游戏场景
class GameScene extends Phaser.Scene {
  private score: number = 0
  private scoreText!: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'GameScene' })
  }

  preload() {
    // 预加载资源可以在这里添加
  }

  create() {
    // 添加欢迎文本
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 100,
      'Welcome to Your Game',
      {
        fontSize: '32px',
        color: '#ffffff',
        fontFamily: 'Arial'
      }
    ).setOrigin(0.5)

    this.scoreText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Click to start',
      {
        fontSize: '24px',
        color: '#cccccc',
        fontFamily: 'Arial'
      }
    ).setOrigin(0.5)

    // 点击屏幕增加分数
    this.input.on('pointerdown', () => {
      this.score++
      this.scoreText.setText(`Score: ${this.score}`)
    })

    // 设置背景色
    this.cameras.main.setBackgroundColor('#2d2d2d')
  }

  update() {
    // 游戏更新逻辑
  }
}

// 游戏配置
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 200 }
    }
  },
  scene: GameScene
}

// 启动游戏
const game = new Phaser.Game(config)

// 响应式调整
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight)
})
