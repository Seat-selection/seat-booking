## 付款界面
包含背景图、支付方式选择、总金额显示和支付按钮。

### 支付方式选择
id=pay-methods  
- 内含多个支付方式单选框（银行卡、微信、支付宝等）。
- 每个支付方式的单选框 id 分别为 bank、wechat、alipay。

### 总金额显示
id=total-amount  
- 显示应付金额，格式为“应付金额：XXX元”。
- 金额由购票人数（tickets.length）和单张票价（pricePerTicket） **动态计算得出**。
- 页面加载时自动更新显示。

### 支付按钮
id=pay-btn  
- 支付成功后，**跳转到 success.html**，并通过 localStorage 传递```successMsg```**“支付成功！”**提示信息。
