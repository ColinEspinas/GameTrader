'use strict'

class PostAd {
  get rules () {
    return {
      'title': 'required',
      'content': 'required',
      'price': 'required|above:0',
	  'categoryID': 'above:0',
	  'platform': 'required'
    }
  }

  get messages() {
    return {
      'required': 'You need to fill {{ field }}.',
      'above': '{{ field }} needs to be changed !'
    }
  }

  async fails(error) {
    this.ctx.session.withErrors(error).flashAll();
    return this.ctx.response.redirect('back');
  }
}

module.exports = PostAd
