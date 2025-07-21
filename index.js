
document.addEventListener('DOMContentLoaded', function() {
    // 初始化sessionStorage
    initializeSession();
    
    // 绑定按钮事件
    bindEvents();
});

function initializeSession() {
    // 保留现有配置中的已购票和已预订信息
    const existingConfig = JSON.parse(sessionStorage.getItem('cinemaConfig') || '{}');
    sessionStorage.clear();

    const allConfig = {
        small: { rows: 5, cols: 20, baseRadius: 300, rowSpacing: 40 },
        medium: { rows: 10, cols: 20, baseRadius: 200, rowSpacing: 35 },
        large: { rows: 10, cols: 30, baseRadius: 255, rowSpacing: 30 }
    };
    sessionStorage.setItem('allConfig', JSON.stringify(allConfig));
    // 在此处设置影院静态参数（small, medium or large）
    const property = "small";
    sessionStorage.setItem('Property', property);

    // 初始化新配置时继承已购座位和已预订座位
    const config = {
        ticketType: '',
        viewers: [],
        selectedSeats: [],//已选座位
        reservedSeats: existingConfig.reservedSeats || [],//已预订座位
        purchasedSeats: existingConfig.purchasedSeats || [],//已购座位
        totalRows: allConfig[property].rows,
        totalCols: allConfig[property].cols
    };
    // console.log(config.totalRows, config.totalCols);
    
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
    if (config.ticketType === 'individual') {
        window.location.href = 'seat-selection-page.html';
        sessionStorage.setItem('selectedNumber', 1);
    } else {
        window.location.href = 'parameter.html';
    }
}

// 辅助函数：获取配置
function getConfig() {
    return JSON.parse(sessionStorage.getItem('cinemaConfig'));
}

// 辅助函数：保存配置
function saveConfig(config) {
    sessionStorage.setItem('cinemaConfig', JSON.stringify(config));
}