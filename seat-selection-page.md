当一个座位被点击时会触发handleSeatSelection(row, column, ctrlKey);，表示第row行第column列被选中，ctrlKey(bool类型)表示ctrl多选键是否被按下。

getSeatColor(row,column)要求获取第row行第column列的状态（要求返回颜色，比如"yellow"）

可以调用changeSeatState(row,column,state)来绘制第row行第column列座位的状态，其中state表示座位的颜色（如state=“green”）



点击id=“manual”或id=“auto”按钮都会触发对应的‘click’事件（完成手动选座或者自动选座）

点击id="check-button"按钮会触发对应的‘click’事件（跳转到payment-finished.html）

点击id="addition-button"按钮会触发对应的‘click’事件（跳转到adding-viewer.html）

点击id="done-button"按钮会触发对应的‘click’事件（跳转到payment.html）



