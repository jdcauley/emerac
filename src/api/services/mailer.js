POSTMARK_KEY = process.env.POSTMARK_KEY || 'no-key'
const Postmark = require('postmark')
const postmark = new Postmark.Client(POSTMARK_KEY)

const Mailer = {}

Mailer.sendMail = (envelope) => {
  if (POSTMARK_KEY === 'no-key') {
    console.log(mail)
    return
  }

  postmark.sendEmail(envelope)
}

module.exports = Mailer
