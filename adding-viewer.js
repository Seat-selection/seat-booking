
let config;

document.addEventListener('DOMContentLoaded', function() {
    // 加载配置
    config = JSON.parse(sessionStorage.getItem('cinemaConfig'));
    if (!config) {
        alert('系统错误，请重新开始');
        window.location.href = 'index.html';
        return;
    }
    
    // 绑定事件
    bindEvents();
    
    // 聚焦到姓名输入框
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.focus();
    }
});

function bindEvents() {
    // 表单提交事件
    const form = document.getElementById('adding-viewer');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
    
    // 返回按钮事件
    const returnBtn = document.getElementById('return-button');
    if (returnBtn) {
        returnBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'seat-selection-page.html';
        });
    }
    
    // 为输入框添加Enter键支持
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.id === 'name') {
                    // 如果在姓名框按Enter，跳转到年龄框
                    document.getElementById('age').focus();
                } else if (this.id === 'age') {
                    // 如果在年龄框按Enter，提交表单
                    form.dispatchEvent(new Event('submit'));
                }
            }
        });
    });
}

function handleSubmit(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');
    
    const name = nameInput.value.trim();
    const age = ageInput.value.trim();
    
    // 验证输入
    if (!validateInput(name, age)) {
        return;
    }
    
    // 检查团体票人数限制
    if (config.ticketType === 'group' && config.viewers.length >= 20) {
        alert('团体票最多只能添加20人！');
        return;
    }
    
    // 检查个人票人数限制
    if (config.ticketType === 'individual' && config.viewers.length >= 1) {
        alert('个人票只能添加1人！');
        return;
    }
    
    // 检查姓名是否重复
    if (config.viewers.some(viewer => viewer.name === name)) {
        alert('该姓名已存在，请使用不同的姓名！');
        nameInput.focus();
        return;
    }
    
    // 添加观影人
    const viewer = {
        name: name,
        age: age,
        seatRow: null,
        seatCol: null
    };
    
    config.viewers.push(viewer);
    sessionStorage.setItem('cinemaConfig', JSON.stringify(config));
    
    window.location.href='final.html'
}

function validateInput(name, age) {
    // 验证姓名
    if (!name) {
        alert('请输入姓名！');
        document.getElementById('name').focus();
        return false;
    }
    
    if (name.length > 20) {
        alert('姓名长度不能超过20个字符！');
        document.getElementById('name').focus();
        return false;
    }
    
    // 验证姓名格式（只允许中文、英文字母和数字）
    const namePattern = /^[\u4e00-\u9fa5a-zA-Z0-9\s]+$/;
    if (!namePattern.test(name)) {
        alert('姓名只能包含中文、英文字母、数字和空格！');
        document.getElementById('name').focus();
        return false;
    }
    
    // 验证年龄
    if (!age) {
        alert('请输入年龄！');
        document.getElementById('age').focus();
        return false;
    }
    
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) {
        alert('年龄必须是数字！');
        document.getElementById('age').focus();
        return false;
    }
    
    if (ageNum < 1 || ageNum > 120) {
        alert('年龄必须在1-120岁之间！');
        document.getElementById('age').focus();
        return false;
    }
    
    return true;
}


