import express from 'express'

const app = express();

app.get('/', (_, res) => {
  res.send('HomePage')
})

app.listen(3001, () => console.log("listening on 3001"))
