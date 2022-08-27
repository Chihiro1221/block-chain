const sha256 = require('crypto-js/sha256')

// 区块 -> 链
// 每一个区块包含数据、上一个区块的hash、根据数据与上一个区块的previousHash计算出的自己的hash

class Block {
  constructor(data, previousHash) {
    this.data = data
    this.previousHash = previousHash
    this.hash = this.computeHash()
  }

  computeHash() {
    return sha256(this.data + this.previousHash).toString()
  }
}

class Chain {
  constructor() {
    this.blocks = [this.initGenesisBlock()]
  }

  initGenesisBlock() {
    return new Block('祖先区块', '')
  }

  addBlockToChain(block) {
    const letestBlock = this.blocks[this.blocks.length - 1]
    block.previousHash = letestBlock.hash
    block.hash = block.computeHash()
    this.blocks.push(block)
  }

  /**
   * 验证链是否是有效的
   */
  validateChain() {
    return this.blocks.every((block, index) => {
      // 检测每一个block的数据与hash是否还对应
      if (block.hash !== block.computeHash()) {
        console.log('数据被篡改')
        return false
      }
      // 检测block与前一个的block是否还有关联
      const latestBlock = this.blocks[index + 1]
      // 最后一个区块是没有上一级的
      if (latestBlock && block.hash !== latestBlock.previousHash) {
        console.log('区块链断裂')
        return false
      }
      return true
    })
  }
}

const block1 = new Block('转账十元')
const block2 = new Block('转账二十元')
const chain = new Chain()
chain.addBlockToChain(block1)
chain.addBlockToChain(block2)

// prool for work
// p2p
console.log(chain)
console.log(chain.validateChain())
