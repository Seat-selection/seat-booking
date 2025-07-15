## 付款界面
### 已选座位部分
- id=selected 显示选中的所有座位信息
    - 其中每张票表示为**id=ticket_{i}**,i表示购买的第i张票
        - 对于每一张票,用户名表示为id=username,座位号表示为id=seat
    **需要通过选座页面保存的观影人列表信息,在此页面读取相应信息并显示**

### 预定按钮
id=reserve 点击后跳转到成功页面```success.html```,并将里面显示的文字设置为：**您已经预订成功**. **预订成功后需要更新```payment-finished.html```中的已预订票内容**
*todo：写好success.html的页面布局,确定显示文字的元素id*

### 支付按钮
id=pay 点击后跳转到支付页面(简易版,显示总金额,点击确定后默认支付成功)
*todo：简易版的支付界面paymoney.html*
**支付成功后需要更新```payment-finished.html```中的已购买票内容**