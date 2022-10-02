const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))


// 路由設定
// index負責: 首頁看到所有餐廳與它們的簡單資料
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

// show負責: 使用者可以再點進去看餐廳的詳細資訊
// 使用params建立動態路由
app.get("/restaurants/:id", (req, res) => {
  const restaurant = restaurantList.results.find(
    (restaurant) => restaurant.id.toString() === req.params.id
  );
  res.render("show", { restaurant: restaurant });
});

//search負責: 使用者可以透過搜尋餐廳名稱/類別來找到特定的餐廳
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase().trim()
  // 利用 || 篩選 1.餐廳名稱 2.餐廳類別
  const restaurants = restaurantList.results.filter(restaurant => {
    return 
    restaurant.name.toLowerCase().includes(keyword) || restaurant.category.toLowerCase().includes(keyword)
  }) 

    // 若不符合搜尋條件則回傳
  if (restaurants.length !== 0) {
    return res.send(`<h2>查無 ${keyword} ，請重新輸入</h2>`)
  }
  res.render('index', { restaurants, keyword })
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})