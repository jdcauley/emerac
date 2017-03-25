
var Bookmark = {
  identity: 'bookmark',
  attributes: {

    userId: {
      model: 'user'
    },

    url: {
      type: 'string',
      default: null
    },

    domain: {
      type: 'string',
      default: null
    },

    title: {
      type: 'string',
      default: null
    },

    author: {
      type: 'string',
      default: null
    },

    published: {
      type: 'string',
      default: null
    },

    image: {
      type: 'string',
      default: null
    },

    content: {
      type: 'string',
      default: null
    },

    excerpt: {
      type: 'string',
      default: null
    },

    wordCount: {
      type: 'integer',
      default: null
    },

    pages: {
      type: 'integer',
      default: null
    },

    nextPage: {
      type: 'string',
      default: null
    },

    toJSON: function() {
      var obj = this.toObject();
      return obj;
    }
    
  }

}

module.exports = Bookmark;