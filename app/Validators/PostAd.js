'use strict'

class PostAd {
  get rules () {
    return {
      'title': 'required',
      'content': 'required'
    }
  }

  get messages() {
    return {
      'required': 'You need to fill {{ field }}.'
    }
  }

  async fails(error) {
    this.ctx.session.withErrors(error).flashAll();
    return this.ctx.response.redirect('back');
  }
}

module.exports = PostAd
