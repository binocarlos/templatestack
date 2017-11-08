const meta = (user = {}) => user.meta || {}
const google = (user) => meta(user).google || {}
const name = (user) => google(user).displayName || ''
const photos = (user) => (google(user).photos || []).map(p => p.value)
const photo = (user) => photos(user)[0]

const selectors = {
  meta,
  google,
  name,
  photos,
  photo
}

export default selectors