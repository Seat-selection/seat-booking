## 购票首页
包含背景图,个人和团体购票两个按钮
### 个人购票按钮
id=individual,点击后跳转到选座页面```seat-selection-page.html```,并且只能添加一个观影人在```payment.html```中显示已选座位和用户信息,并计算总金额
对应js函数名为(可选参数有individual和group)```selectOption('individual')```
### 团体购票按钮
id=group,点击后跳转到选座页面```seat-selection-page.html```,允许一个接一个的添加多个观影人信息,在```payment.html```中显示已选座位和用户信息
对应js函数名为```selectOption('group')```