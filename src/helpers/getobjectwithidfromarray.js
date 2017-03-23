export default (arr, id) => {
  var item = null
  arr.some(i => {
    if(i.id==id) {
      item = i
      return true
    }
    return false
  })
  return item
}
