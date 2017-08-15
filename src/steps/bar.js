
const BAR_LENGTH = 20
const FILLED = '▇'
const EMPTY = '_'

exports.percent = function (value, total) {
  const percentage = Math.ceil(value * 100 / total)
  const blocks = Math.ceil(percentage * BAR_LENGTH / 100)
  const barFilled = FILLED.repeat(blocks)
  const barEmpty = EMPTY.repeat(BAR_LENGTH - blocks)
  return `${barFilled}${barEmpty} ${percentage}%`
}
