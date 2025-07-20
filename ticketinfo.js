document.addEventListener('DOMContentLoaded', function() {
    const config = JSON.parse(sessionStorage.getItem('cinemaConfig') || '{}');

    // 数据源处理（含空值保护）
    const paidTickets = (config.purchasedSeats || []).map(seat => ({
        name: seat?.viewer?.name || '未命名',
        seat: `${seat?.row ?? 0}排${seat?.col ?? 0}号`,
        age: seat?.viewer?.age || ''
    }));

    const reservedTickets = (config.reservedSeats || []).map(seat => ({
        name: seat?.viewer?.name || '未命名',
        seat: `${seat?.row ?? 0}排${seat?.col ?? 0}号`,
        age: seat?.viewer?.age || ''
    }));

    // 获取容器元素
    const boughtDiv = document.getElementById('bought');
    const reservedDiv = document.getElementById('reserved');

    // 清空容器
    [boughtDiv, reservedDiv].forEach(div => div.innerHTML = '');

    // 使用公共函数渲染
    paidTickets.forEach((item, i) => {
        boughtDiv.appendChild(createTicketElement(item, 'paid', i));
    });

    reservedTickets.forEach((item, i) => {
        reservedDiv.appendChild(createTicketElement(item, 'reserved', i));
    });

    // 取消预订按钮逻辑
    document.getElementById('cancel-reservation').onclick = function () {
        const selected = Array.from(document.querySelectorAll('[id^="reserved_select_"]:checked'))
        .map(checkbox => parseInt(checkbox.id.split('_')[2]));

        if (selected.length === 0) {
            alert('请先选择要取消的预订票务');
            return;
        }

        // 更新sessionStorage
        const updatedConfig = {
            ...config,
            reservedSeats: config.reservedSeats.filter((_, i) => !selected.includes(i))
        };
        sessionStorage.setItem('cinemaConfig', JSON.stringify(updatedConfig));
        sessionStorage.setItem('successType', 'cancel-reserve');   
        window.location.href = 'success.html';
    };

    // 退票按钮逻辑
    document.getElementById('refund').onclick = function () {
        const selected = Array.from(document.querySelectorAll('[id^="paid_select_"]:checked'))
            .map(checkbox => parseInt(checkbox.id.split('_')[2]));

        if (selected.length === 0) {
            alert('请先选择要退款的已购票务');
            return;
        }

        // 更新sessionStorage
        const updatedConfig = {
            ...config,
            purchasedSeats: config.purchasedSeats.filter((_, i) => !selected.includes(i))
        };
        sessionStorage.setItem('cinemaConfig', JSON.stringify(updatedConfig));
        sessionStorage.setItem('successType', 'refund');   
        window.location.href = 'success.html';
    };
});

// 公共渲染函数
// 新增公共渲染函数
function createTicketElement(item, prefix, index) {
    const ticketDiv = document.createElement('div');
    ticketDiv.className = 'ticket-card';
    ticketDiv.id = `${prefix}_ticket_${index}`;

    // 创建详情区域
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'personal-details';
    detailsDiv.id = `${prefix}_personal-details_${index}`;

    // 第一行：姓名、年龄
    const row1 = document.createElement('div');
    row1.className = 'row';
    row1.innerHTML = `<span>姓名：${item.name}</span>&nbsp;&nbsp;<span>年龄：${item.age}</span>`;

    // 第二行：座位号
    const row2 = document.createElement('div');
    row2.className = 'row seat-row';
    row2.innerHTML = `<span>座位：${item.seat}</span>`;

    // 复选框区域
    const selectDiv = document.createElement('div');
    selectDiv.className = 'select-area';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `${prefix}_select_${index}`;

    // 组装元素
    detailsDiv.appendChild(row1);
    detailsDiv.appendChild(row2);
    selectDiv.appendChild(checkbox);
    ticketDiv.appendChild(detailsDiv);
    ticketDiv.appendChild(selectDiv);

    return ticketDiv;
}

