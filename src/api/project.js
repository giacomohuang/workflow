import fetch from './fetch'

export const projectApi = {
  get(id) {
    return fetch({
      params: { id: id },
      url: '/api/project/get',
      method: 'get'
    })
  }
}
