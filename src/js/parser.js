import Lexer from './lexer'

const OPERATOR = ['+', '-', '*', '/', '%', '!', '^', '.', '>', '<', '==', '>=', '<=', '!=', '&&', '||']
const OP = { '&': 7, '|': 8, '&&': 9, '==': 10, '!=': 10, '||': 11, '<': 12, '>': 12, '<=': 12, '>=': 12, '<<': 13, '>>': 13, '+': 14, '-': 14, '*': 15, '/': 15, '%': 15, '^': 16, '.': 17 }

export default class Parser {
  constructor(code) {
    this.code = code
    const lexer = new Lexer(this.code)
    this.tokens = lexer.process()
    this.stack = []
    this.oprstack = []
    this.ast = []
  }

  getTokens() {
    return this.tokens
  }

  /**
     * 将中缀表达式转换为后缀表达式：
     与转换为前缀表达式相似，遵循以下步骤：
     * (1) 初始化两个栈：运算符栈S1和储存中间结果的栈S2；
     * (2) 从左至右扫描中缀表达式；
     * (3) 遇到操作数时，将其压入S2；
     * (4) 遇到运算符时，比较其与S1栈顶运算符的优先级：
     * (4-1) 如果S1为空，或栈顶运算符为左括号“(”，则直接将此运算符入栈；
     * (4-2) 否则，若优先级比栈顶运算符的高，也将运算符压入S1（注意转换为前缀表达式时是优先级较高或相同，
            而这里则不包括相同的情况）；
     * (4-3) 否则，将S1栈顶的运算符弹出并压入到S2中，再次转到(4-1)与S1中新的栈顶运算符相比较；
     * (5) 遇到括号时：
     * (5-1) 如果是左括号“(”，则直接压入S1；
     * (5-2) 如果是右括号“)”，则依次弹出S1栈顶的运算符，并压入S2，直到遇到左括号为止，此时将这一对括号丢弃；
     * (6) 重复步骤(2)至(5)，直到表达式的最右边；
     * (7) 将S1中剩余的运算符依次弹出并压入S2；
     * (8) 依次弹出S2中的元素并输出，结果的逆序即为中缀表达式对应的后缀表达式（转换为前缀表达式时不用逆序）。
  */

  process() {
    let t = [...this.tokens],
      token,
      s

    while ((token = t.shift())) {
      if (['Numeric', 'String'].includes(token.type)) {
        this.stack.push(token)
      } else if (token.type === 'Identifier') {
        this.stack.push(token)
      } else if (OPERATOR.includes(token.value)) {
        // console.log(token.value, token.attr)
        this.linkPush(token)
      } else if (token.value === '(') {
        this.oprstack.push(token)
      } else if (token.value === ')') {
        let flag = false
        while ((s = this.oprstack.pop())) {
          if (s.value === '(') {
            flag = true
            break
          }
          this.stack.push(s)
        }
        if (!flag) throw new Error('unclosed brackets')
      }

      /* Steps Show:
      
      let txt1 = '',
        txt2 = ''
      for (let i = 0; i < this.stack.length; i++) {
        txt1 += JSON.stringify(this.stack[i].id + '--' + this.stack[i].value) + ' '
      }
      for (let i = 0; i < this.oprstack.length; i++) {
        txt2 += JSON.stringify(this.oprstack[i].id + '--' + this.oprstack[i].value) + ' '
      }
      console.log('current:', token.value)
      console.log('S2:', txt1)
      console.log('S1:', txt2 + '\n\n\n')
      
      */
    }

    //oprstack中的剩余元素依次弹出，并压入stack
    while ((token = this.oprstack.pop())) {
      // 如果此时还有左括号，说明没有与之匹配的右括号，抛异常
      if (token.value == '(') {
        throw new Error('unclosed brackets')
      }
      this.stack.push(token)
    }
    return this.stack
  }

  linkPush(t) {
    let op,
      preOp = 0
    // 如果t是一元操作符，提升优先级
    if (this.oprstack.length > 0) {
      op = t.attr === 'UnaryExpression' ? 20 : OP[t.value]
      //如果opr栈顶也是一个一元操作符，提升优先级
      preOp = this.oprstack.at(-1).attr === 'UnaryExpression' ? 19 : OP[this.oprstack.at(-1).value]
    }
    if (this.oprstack.length === 0 || this.oprstack.at(-1).value === '(') {
      this.oprstack.push(t)
    } else if (op > preOp) {
      this.oprstack.push(t)
    } else {
      this.stack.push(this.oprstack.pop())
      this.linkPush(t)
    }
    // console.log(...this.oprstack)
  }
}
