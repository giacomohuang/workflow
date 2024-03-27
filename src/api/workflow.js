import fetch from './fetch'

export const workflowAPI = {
  get(id) {
    return fetch({
      params: { id: id },
      url: '/api/workflow/get',
      method: 'get'
    })
  }
}
