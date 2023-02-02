import Stroe from 'electron-store'

const stroe = new Stroe({
  name: 'stroe'
})
const lock = stroe.get('lock')
if (!lock) {
  stroe.set('lock', {
    openLock: false,
    password: ''
  })
}

export default stroe
