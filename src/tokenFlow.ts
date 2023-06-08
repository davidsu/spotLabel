const SCOPE = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-follow-modify',
  'user-follow-read',
  'user-read-playback-position',
  'user-top-read',
  'user-read-recently-played',
  'user-library-modify',
  'user-library-read',
  'user-read-email',
  'user-read-private',
].join(' ')

function generateRandomString(length: number) {
  let text = ''
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
async function generateCodeChallenge(codeVerifier: string) {
  function base64encode(string: string) {
    //@ts-ignore
    return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await window.crypto.subtle.digest('SHA-256', data)

  //@ts-ignore
  return base64encode(digest)
}

//const clientId = 'a8072301988e40ee9439837c265631fd'
const clientId = import.meta.env.PROD
  ? '08bb5e52ec0d4e6aaf8c45655cc8bdc4'
  : 'a8072301988e40ee9439837c265631fd'
export const home =
  window.location.origin + (import.meta.env.PROD ? '/spotLabel' : '')
const redirectUri = `${home}/accept`

let codeVerifier = generateRandomString(128)
export function getAuthorizationCode() {
  generateCodeChallenge(codeVerifier).then(codeChallenge => {
    let state = generateRandomString(16)
    let scope = SCOPE

    localStorage.setItem('code-verifier', codeVerifier)

    let args = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    })

    //@ts-ignore
    window.location = 'https://accounts.spotify.com/authorize?' + args
  })
}

export function refreshToken() {
  console.log('refresh token')
  const refresh_token = localStorage.getItem('refresh-token')

  //@ts-ignore
  let body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token,
  })

  const response = fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status)
      }
      return response.json()
    })
    .then(data => {
      localStorage.setItem('access-token', data.access_token)
      localStorage.setItem('refresh-token', data.refresh_token)
      return data
    })
    .catch(error => {
      localStorage.clear()
      //@ts-ignore
      window.location = home
    })
  return response
  // return code
}
export function getToken() {
  const urlParams = new URLSearchParams(window.location.search)
  let code = urlParams.get('code')
  let codeVerifier = localStorage.getItem('code-verifier')

  //@ts-ignore
  let body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  })

  const response = fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status)
      }
      return response.json()
    })
    .then(data => {
      localStorage.setItem('access-token', data.access_token)
      localStorage.setItem('refresh-token', data.refresh_token)
      //@ts-ignore
      window.location = home
    })
    .catch(error => {
      console.error('Error:', error)
    })
  return response
  // return code
}
