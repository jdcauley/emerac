const MercuryClient = require('mercury-client')
const mc = new MercuryClient(process.env.MERCURY_KEY)

const BookmarkController = {};

BookmarkController.create = (req, res) => {

  var Bookmark = req.app.models.bookmark;

  var bookmarkQuery,
      newBookmark = req.body;

  if(!req.user.id){
    return res.status(403).json({
      error: 'User not Authenticated'
    });
  }

  newBookmark.userId = req.user.id;

  console.log(newBookmark)

  mc.parse(newBookmark.url)
    .then((data) => { 
      console.log(data)

      Object.assign(newBookmark, {
        url: data.url,
        domain: data.domain,
        title: data.title,
        author: data.author,
        published: data.date_published,
        image: data.lead_image_url,
        excerpt: data.excerpt,
        wordCount: data.word_count,
        pages: data.total_pages,
        nextPage: data.next_page_url
      })

      bookmarkQuery = Bookmark.findOrCreate(newBookmark);

      bookmarkQuery.exec(function(err, bookmark){
        if(err){
          console.log(err)
          return res.status(500).json({
            error: err
          });
        }
        if(bookmark){
          return res.status(201).json({
            bookmark: bookmark
          });
        }
      })
    
  
    })
    .catch((err) => { 
      console.log('merc error');
      console.log(err)

      return res.status(500).json({
        error: err
      });
    
  })

};

BookmarkController.find = (req, res) => {

  var Bookmark = req.app.models.bookmark;

  var params = req.query;

  var bookmarkQuery = {};

  params.userId = req.user.id;

  Bookmark.find(params).exec(function(err, bookmarks){
    if(err){
      res.status(500).json({
        error: err
      });
    }
    if(bookmarks){

      res.status(200).json({
        bookmarks: bookmarks
      });
    }
    
  });

}

BookmarkController.findOne = (req, res) => {

  var Bookmar = req.app.models.bookmark;

  Bookmar.findOne({id: req.params.id}, function(err, bookmark){
    if(err){

      return res.status(500).json({
        error: err
      });

    } else {

      return res.status(200).json({
        bookmark: bookmark
      });

    }
  });

}


BookmarkController.destroy = (req, res) => {

  var Bookmark = req.app.models.bookmarks;

  Bookmark.destroy({id: req.params.id}, function(err, bookmark){
    if(err){

      return res.status(500).json({
        error: 'Bookmark Not Removed'
      });

    } else {

      return res.status(200).json({
        removed: bookmark
      });

    }
  });

}

module.exports = BookmarkController;