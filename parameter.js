const parameterForm = document.getElementById('parameter');
const numberSelect = document.getElementById('number');

let config;
// 页面加载时初始化
window.addEventListener('load', function() {
    // 恢复已保存的观影人数（如果有）
    const savedNumber = sessionStorage.getItem('selectedNumber');
    if (savedNumber) {
        numberSelect.value = savedNumber;
    }
});

// 表单提交处理
parameterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 保存参数到sessionStorage
    sessionStorage.setItem('selectedNumber', numberSelect.value);
    
    // 跳转到选座页面
    window.location.href = 'seat-selection-page.html';
});