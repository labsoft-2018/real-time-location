import * as express from 'express'

const PORT = 3000 || process.env.PORT

const app = express()
app.listen(PORT, (err) => {
  if (err) {
    console.error(err)
    return
  }

  console.log(`Listening on PORT ${PORT}`)
})