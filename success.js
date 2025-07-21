document.addEventListener('DOMContentLoaded', function() {
// 修改消息获取方式为sessionStorage
    const successType = sessionStorage.getItem('successType');
    let msg = '未知操作类型';

    if (successType === 'reserve') {
        msg = '预订成功！';
    } else if (successType === 'payment') {
        msg = '支付成功！';
    } else if (successType === 'cancel-reserve') {
        msg = '取消预订成功！';
    } else if (successType === 'refund') {
        msg = '退票成功！';
    }


    document.getElementById('success-message').textContent = msg;

    // 清除状态标记
    sessionStorage.removeItem('successType');
});

document.getElementById('ok-btn').onclick = function() {
    const successType = sessionStorage.getItem('successType');
    if (['reserve', 'payment'].includes(successType)) {
        window.location.href = 'index.html';
    } else if (['refund', 'cancel-reserve'].includes(successType)) {
        window.location.href = 'ticketinfo.html';
    } else {
        window.location.href = 'index.html'; // 默认回首页
    }
    sessionStorage.removeItem('successType'); // 统一清理




};