
document.addEventListener('DOMContentLoaded', function() {
    // 初始化sessionStorage
    initializeSession();
    
    // 绑定按钮事件
    bindEvents();
});

function initializeSession() {
    // 清除之前的数据
    sessionStorage.clear();
    
    // 初始化基本配置
    const config = {
        ticketType: '', // 'individual' 或 'group'
        viewers: [], // 观影人列表
        selectedSeats: [], // 已选座位
        reservedSeats: [], // 预订座位
        purchasedSeats: [], // 已购买座位
        totalRows: 10, //后续看在哪里传入这个参数
        totalCols: 20 //后续看在哪里传入这个参数
    };
    
    sessionStorage.setItem('cinemaConfig', JSON.stringify(config));
}

function bindEvents() {
    const individualBtn = document.getElementById('individual');
    const groupBtn = document.getElementById('group');
    
    if (individualBtn) {
        individualBtn.addEventListener('click', function() {
            selectTicketType('individual');
        });
    }
    
    if (groupBtn) {
        groupBtn.addEventListener('click', function() {
            selectTicketType('group');
        });
    }
}

function selectTicketType(type) {
    const config = JSON.parse(sessionStorage.getItem('cinemaConfig'));
    config.ticketType = type;
    sessionStorage.setItem('cinemaConfig', JSON.stringify(config));
    
    // 跳转到选座页面
    window.location.href = 'seat-selection-page.html';
}

// 辅助函数：获取配置
function getConfig() {
    return JSON.parse(sessionStorage.getItem('cinemaConfig'));
}

// 辅助函数：保存配置
function saveConfig(config) {
    sessionStorage.setItem('cinemaConfig', JSON.stringify(config));
}