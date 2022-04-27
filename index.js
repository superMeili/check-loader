const chalk = require('chalk')
const resolve = require('path').resolve
const rawType = val => Object.prototype.toString.call(val).slice(8, -1)
const isArray = val => rawType(val) === 'Array'
const isFunction = val => rawType(val) === 'Function'
const isObject = val => rawType(val) === 'Object'
const isRegExp = val => rawType(val) === 'RegExp'
const isString = val => rawType(val) === 'String'

let options = null

module.exports = function (context) {
  const resourcePath = this.resourcePath
  options || (options = createOptions(this.rootContext, this.query))
  if (pathCheck(options, resourcePath)) {
    let { msg, mode, tip } = infoCheck(options, context)
    if (msg) {
      const title = 'Checked Info:'
      const message = ` '${msg}' `
      const position = `find in '${resourcePath}'`
      tip = tip && `tip: ${tip}`
      if (mode === 'strict') {
        throw new Error(title + message + position + ' ' + tip)
      } else {
        console.log()
        console.log(chalk.bgRed.bold(title) + chalk.yellow(message) + chalk.cyan(position))
        tip && console.log(chalk.green(tip))
      }
    }
  }

  return context
}

function pathCheck(options, resourcePath) {
  const { regExclude, strExclude, regInclude, strInclude } = options
  let result = true
  if (regInclude.length || strInclude.length) {
    result = matchCheckForPath(regInclude, strInclude, resourcePath, true) && !matchCheckForPath(regExclude, strExclude, resourcePath, true)
  }else {
    result = !matchCheckForPath(regExclude, strExclude, resourcePath, true)
  }
  return result
}

function infoCheck(options, context) {
  const check = options.check
  let msg
  let mode
  let tip
  for (let i = 0; i < (check.length && !msg); i++) {
    const cur = check[i]
    mode = cur.mode
    tip = cur.tip
    const rules = cur.rules
    for (let j = 0; j < (rules.length && !msg); j++) {
      const rule = rules[i]
      if (isFunction(rule)) {
        msg = rule(context)
      } else if (isRegExp(rule) || isString(rule)) {
        const matched = context.match(rule)
        msg = matched && matched[0]
      }
    }
  }
  return {
    msg,
    mode,
    tip
  }
}

function createOptions(rootContext, query) {
  let { include, exclude, check } = (isObject(query) && query) || {}

  check = createArr(check, checkTargetHandler)

  exclude = createArr(exclude, String)
  include = createArr(include, String)

  const [regExclude, strExclude] = classifyArr(exclude, rootContext)
  const [regInclude, strInclude] = classifyArr(include, rootContext)
  regExclude.unshift(/node_modules/)

  return {
    regExclude,
    strExclude,
    regInclude,
    strInclude,
    check
  }
}

function checkTargetHandler(val) {
  let normalized
  if (isObject(val)) {
    const { mode, rules } = val
    normalized = {
      mode: mode || 'normal',
      rules: rules ? (isArray(rules) ? rules : [rules]) : [],
      tip: String(val.tip || '')
    }
  } else {
    normalized = {
      mode: 'normal',
      rules: [val], // 函数，正则，字符串
      tip: ''
    }
  }
  return normalized
}

function createArr(rawVal, handler) {
  return rawVal ? (!isArray(rawVal) ? [handler(rawVal)] : rawVal.map(handler)) : []
}

function classifyArr(rawArray, rootContext) {
  let regArr = [],
    strArr = []
  rawArray.forEach(v => {
    const type = rawType(v)
    if (type === 'String') {
      strArr.push(rootContext ? resolve(rootContext, v) : v)
    } else if (type === 'RegExp') {
      regArr.push(v)
    }
  })
  return [regArr, strArr]
}

function matchCheckForPath(regArr, strArr, val, isStartHead) {
  const checkPos = pos => (isStartHead ? pos === 0 : pos !== -1)
  return regArr.some(reg => reg.test(val)) || strArr.some(str => checkPos(val.indexOf(str)))
}