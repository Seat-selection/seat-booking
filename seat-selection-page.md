ROWS表示电影院座位的总行数，COLS表示电影院座位的总列数。



当一个座位被点击时会触发handleSeatSelection(row, col, ctrlKey);，表示第row行第col列被选中，ctrlKey(bool类型)表示ctrl多选键是否被按下。

getSeatColor(row,col)要求获取第row行第col列的状态（要求返回颜色，比如"yellow"）

可以调用changeSeatState(row,col,state)来绘制第row行第col列座位的状态，其中state表示座位的颜色（如state=“green”）

**注意：**在调用以上函数时，row的坐标范围为0~ROWS-1，col的坐标范围为0~COLS-1。



点击id=“manual”或id=“auto”按钮都会触发对应的‘click’事件（完成手动选座或者自动选座）

点击id="check-button"按钮会触发对应的‘click’事件（跳转到payment-finished.html）

点击id="addition-button"按钮会触发对应的‘click’事件（跳转到adding-viewer.html）

点击id="done-button"按钮会触发对应的‘click’事件（跳转到payment.html）



