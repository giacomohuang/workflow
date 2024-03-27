// 词法分析器
// giacomohuang@qq.com

import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 6)

const NUMBERIC = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const PUNCTUATOR = ['+', '-', '*', '/', '%', '!', '^', '>', '<', '(', ')']
const LOGICAL_OPERATOR = ['==', '>=', '<=', '!=', '&&', '||']
const OPERATOR = ['+', '-', '*', '/', '%', '!', '^', '.', '>', '<', '==', '>=', '<=', '!=', '&&', '||', '(', ')']
const IDENTIFIER = /[a-zA-Z0-9_\u4e00-\u9fa5]/
// const ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
// const ESCAPE_ORI = ['b', 'n', 't', 'f', "'", '"', 'v', 'r', '\\']
// const ESCAPE = ['\b', '\n', '\t', '\f', "'", '"', '\v', '\r', '\\']
const EOF = Symbol('EOF')

export default class Lexer {
  constructor(code) {
    this.buf = []
    this.tokens = []
    this.state = this.toStart
    this.chars = [...code]
    this.chars.push(EOF)
    this.pos = 0
    this.isErr = false
  }
  process() {
    let c
    while ((c = this.chars.shift())) {
      this.state = this.state(c)
    }
    return this.tokens
  }

  // 有限状态机
  toStart(char) {
    // console.log('start:', char)
    if (char === EOF) {
      // console.log('EOF')
    } else if (NUMBERIC.includes(char)) {
      this.buf.push(char)
      return this.toInt
    } else if (char === '.') {
      this.buf.push('.')
      return this.toFloat
    } else if (PUNCTUATOR.includes(char)) {
      this.buf.push(char)
      return this.toPunctuator
    } else if (IDENTIFIER.test(char)) {
      this.buf.push(char)
      return this.toIdentifier
    } else if (char === '"') {
      this.buf.push(char)
      return this.toString
    } else if (char === ' ') {
      this.buf.push(char)
      return this.toSpace
    } else {
      this.pushToken('Error', char)
      return this.toStart
      // throw new Error('unexpected token ILLGAL CHAR')
    }
  }
  toError(char) {
    this.buf.push(char)
    return this.toError
  }

  toSpace(char) {
    if (char === ' ') {
      this.buf.push(char)
      return this.toSpace
    } else {
      this.pushToken('Space', this.buf.join(''))
      return this.toStart(char)
    }
  }

  // 整数
  toInt(char) {
    if (NUMBERIC.includes(char)) {
      this.buf.push(char)
      return this.toInt
    } else if (char === '.') {
      this.buf.push(char)
      return this.toFloat
    } else if (OPERATOR.includes(char) || char === EOF) {
      this.pushToken('Numeric', this.buf.join(''))
      return this.toStart(char)
    } else if (char === ' ') {
      this.pushToken('Numeric', this.buf.join(''))
      return this.toSpace(char)
    } else {
      this.pushToken('Error', this.buf.join('') + char)
      // this.pushToken('Error', )
      return this.toStart
      // throw new Error('unexpected token alphabet or quote')
    }
  }

  // 浮点数
  toFloat(char) {
    if (char === EOF) {
      this.pushToken('Numeric', this.buf.join(''))
      return this.toStart
    } else if (NUMBERIC.includes(char)) {
      this.buf.push(char)
      return this.toFloat
    } else if (char === '.') {
      // 如果浮点数字中出现两个'.',判定为非法
      this.pushToken('Error', this.buf.join('') + char)
      return this.toFloat
      // throw new Error('unexpected token .')
    } else if (IDENTIFIER.test(char)) {
      this.pushToken('Error', this.buf.join('') + char)
      return this.toStart
      // throw new Error('unexpected token alphabet')
    } else {
      if (this.buf.length === 1 && this.buf[0] === '.') {
        // 如果'.'在词头，并且后面不是数字，判定为非法
        this.pushToken('Error', this.buf.join(''))
        return this.toStart
        // throw new Error('unexpected token .')
      }
      this.pushToken('Numeric', this.buf.join(''))
      return this.toStart(char)
    }
  }

  // 符号
  toPunctuator(char) {
    if (PUNCTUATOR.includes(char)) {
      if (char === '"') {
        this.buf.push(char)
        this.pushToken('String', this.buf.join(''))
        return this.toString
      }
      if (LOGICAL_OPERATOR.includes(this.buf.join('') + char)) {
        this.pushToken('Punctuator', this.buf.join('') + char)
        return this.toStart
      } else {
        this.pushToken('Punctuator', this.buf.join(''))
        return this.toStart(char)
      }
    } else {
      this.pushToken('Punctuator', this.buf.join(''))
      return this.toStart(char)
    }
  }

  toString(char) {
    if (char === '"') {
      this.buf.push(char)
      this.pushToken('String', this.buf.join(''))
      return this.toStart
    } else if (char === '\\') {
      this.buf.push(char)
      return this.toEscape
    } else if (char === EOF) {
      if (this.buf.at(-1) !== '"') {
        this.pushToken('Error', this.buf.join(''))
        this.toStart
        // throw new Error('unexpected token quote')
      } else {
        this.pushToken('String', this.buf.join(''))
        this.toStart
      }
    } else {
      this.buf.push(char)
      return this.toString
    }
  }

  // 转义符
  toEscape(char) {
    this.buf.push(char)
    return this.toString
  }

  // 标识/关键字
  toIdentifier(char) {
    if (char === EOF) {
      this.pushToken('Identifier', this.buf.join(''))
      return this.toStart(char)
    } else if (IDENTIFIER.test(char) || NUMBERIC.includes(char)) {
      this.buf.push(char)
      return this.toIdentifier
    } else if (char === '.') {
      this.pushToken('Identifier', this.buf.join(''))
      this.pushToken('Punctuator', '.')
      return this.toStart
    } else {
      this.pushToken('Identifier', this.buf.join(''))
      return this.toStart(char)
    }
  }

  pushToken(type, value) {
    let len = value.length
    let attr = ''
    // 判断是加减号还是正负号
    if (['+', '-'].includes(value)) {
      if (this.tokens.length === 0 || OPERATOR.includes(this.tokens.at(-1).value) || this.tokens.at(-1).value === '(') {
        attr = 'UnaryExpression'
      } else {
        attr = 'Punctuator'
      }
    } else if (value === '.') {
      attr = 'MemberExpression'
    } else if (type === 'Punctuator') {
      attr = 'Punctuator'
    } else if (['Numeric', 'String', 'Space'].includes(type)) {
      attr = 'Literal'
    } else if (type === 'Identifier') {
      attr = 'Identifier'
    } else if (type === 'Error') {
      attr = 'Error'
    }

    this.tokens.push({ id: nanoid(), attr, type, value, pos: this.pos, len })
    this.pos += len
    this.buf = []
  }
}
