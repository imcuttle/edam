/**
 * @file eval
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */

export default function evaluate(exp, data): Function {
  const fn = new Function('data', `with (data) { return ${exp} }`)
  try {
    return fn(data)
  } catch (err) {
    console.error(err.stack)
    console.error(`Error when evaluating filter condition: ${exp}`)
  }
}
