document.addEventListener('DOMContentLoaded', function() {
    // 从cinemaConfig获取数据
    const cinemaConfigData = sessionStorage.getItem('cinemaConfig');
    const config = cinemaConfigData ? JSON.parse(cinemaConfigData) : { selectedSeats: [] };
    
    // 提取选座信息
    const tickets = config.selectedSeats.map(seat => ({
        username: seat.viewer.name,
        seat: `${seat.row + 1}排${seat.col + 1}列`
    }));
    const selectedDiv = document.getElementById('selected');
    selectedDiv.innerHTML = '';

    // 遍历购票信息字典列表,生成票据信息框
    tickets.forEach((item, i) => {
        const ticketDiv = document.createElement('div');
        ticketDiv.className = 'ticket';
        ticketDiv.id = `ticket_${i}`;
        const usernameDiv = document.createElement('div');
        usernameDiv.className = 'username';
        usernameDiv.id = `username_${i}`;
        usernameDiv.textContent = `姓名：${item.username}`;
        const seatDiv = document.createElement('div');
        seatDiv.className = 'seat';
        seatDiv.id = `seat_${i}`;
        seatDiv.textContent = `座位：${item.seat}`;
        ticketDiv.appendChild(usernameDiv);
        ticketDiv.appendChild(seatDiv);
        selectedDiv.appendChild(ticketDiv);
    });

    // 添加按钮事件监听
    document.getElementById('reserve').addEventListener('click', function() {
        // 获取当前配置
        const cinemaConfigData = sessionStorage.getItem('cinemaConfig');
        const config = cinemaConfigData ? JSON.parse(cinemaConfigData) : {};
        
        // 将已选座位存入reservedSeats，确保每个seat都为{row, col, viewer: {name, age}}
        config.reservedSeats = [
            ...(config.reservedSeats || []),
            ...((config.selectedSeats || []).map(seat => {
                let name = seat.viewer && seat.viewer.name ? seat.viewer.name : '未命名';
                let age = seat.viewer && seat.viewer.age ? seat.viewer.age : '';
                if ((!seat.viewer || !seat.viewer.name || !seat.viewer.age) && config.viewers && Array.isArray(config.viewers)) {
                    const matched = config.viewers.find(v => v.seatRow === seat.row && v.seatCol === seat.col);
                    if (matched) {
                        name = matched.name;
                        age = matched.age;
                    }
                }
                return {
                    row: seat.row,
                    col: seat.col,
                    viewer: { name, age }
                };
            }))
        ];
        
        // 保存更新后的配置
        sessionStorage.setItem('cinemaConfig', JSON.stringify(config));
        
        // 设置成功消息类型并跳转
        sessionStorage.setItem('successType', 'reserve');
        window.location.href = 'success.html';
    });

    document.getElementById('pay').addEventListener('click', function() {
        // 支付按钮逻辑
        // 保存支付信息到sessionStorage
        sessionStorage.setItem('paymentTickets', JSON.stringify(tickets));
        // 跳转到支付页面
        // 设置成功消息类型并跳转
        sessionStorage.setItem('successType', 'payment');        // 设置成功消息类型并跳转
        window.location.href = 'paymoney.html';
    });
});