let configStr = sessionStorage.getItem('cinemaConfig');
let config = JSON.parse(configStr);

function calculatePrice(viewers, ticketType) {
    let total = 0;
    viewers.forEach(viewer => {
        const age = parseInt(viewer.age);
        if (age <= 5) return; // 5岁以下免票
        else if (age <= 12) total += 25;//12岁以下25
        else if (age <= 18) total += 35;//未成年35
        else if (age <= 59) total += 50;//成人票50
        else total += 30;//老年票30
    });
    if (ticketType === 'group') {//团体票按人数打折
        if (viewers.length >= 15) total *= 0.8;
        else if (viewers.length >= 5) total *= 0.9;
    }
    return Math.round(total);
}

// 页面加载时自动显示总价
window.onload = function() {
    const total = calculatePrice(config.viewers, config.ticketType);
    const totalAmountDiv = document.getElementById('total-amount');
    if (totalAmountDiv) {
        totalAmountDiv.textContent = `应付金额：${total}元`;
        document.getElementById('pay-btn').onclick = function () {
            // 在支付按钮点击事件中添加
            const cinemaConfigData = sessionStorage.getItem('cinemaConfig');
            const config = cinemaConfigData ? JSON.parse(cinemaConfigData) : {};
            
            // 将已选座位标记为已购买
            config.purchasedSeats = [...config.purchasedSeats, ...config.selectedSeats];
            
            // 清空已选座位
            config.selectedSeats = [];
            
            // 更新存储
            sessionStorage.setItem('cinemaConfig', JSON.stringify(config));
            sessionStorage.setItem('successType', 'payment');   
            window.location.href = 'success.html';
        };
    }
}

