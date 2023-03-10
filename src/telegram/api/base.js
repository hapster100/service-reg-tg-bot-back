const tgApi = (token) => {
  async function tgRawApiFetch(apiMethod, method = 'GET', body = {}, headers = {}) {
    
    const url = `https://api.telegram.org/bot${token}/${apiMethod}`
    const options = {
      method,
    }
    
    if (method === 'POST') {
      options.body = body
      options.headers = headers
    }

    const res = await fetch(url, options)
    return res
  }

  async function tgApiFetch(apiMethod, method = 'GET', body = {}, headers = {}) {
    const options = {
      method,
    }

    if (method === 'POST') {
      options.body = JSON.stringify(body)
      options.headers = {
        'Content-Type': 'application/json',
        ...headers,
      }
    }
    const res = await tgRawApiFetch(
      apiMethod,
      options.method,
      options.body,
      options.headers,
    )
    return res.json()
  }

  return {
    async sendMessage(userId, text) {
      return await tgApiFetch('sendMessage', 'POST', {
        chat_id: userId,
        text,
      })
    },
    async sendPhoto(userId, text, url) {
      return await tgApiFetch('sendPhoto', 'POST', {
        chat_id: userId,
        caption: text,
        photo: url,
      })
    }
  }
}

module.exports = {
  tgApi
} 
