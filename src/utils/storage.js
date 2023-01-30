export function getLocalItem(key) {
  let res
  try {
    res = JSON.parse(localStorage.getItem(key))
  } catch (error) {
    console.error(error)
  }

  return res
}

export function setLocalItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(error)
  }
}
