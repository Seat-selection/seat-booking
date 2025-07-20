const audiences = document.querySelectorAll('.audience');
audiences.forEach(audience => {
    audience.addEventListener('click', function () {
        if (this.classList.contains('selected')) {
            // 如果已经选中，点击后移除选中状态
            this.classList.remove('selected');
        } else {
            // 如果未选中，点击后添加选中状态
            this.classList.add('selected');
        }
    });
});


// 测试本页预先加载config，有了index要删除


function TestMode() {
    // 检查是否已经执行过
    if (sessionStorage.getItem('hasInitialized')) {
        console.log('开始测试')
        return;
    }
    
    // 标记为已执行
    
    
    // alert('测试中');
    initializeSession();
    sessionStorage.setItem('hasInitialized', 'true');
}


let ctrlClickIndex = 0;
let config;
let selectedViewer = null; // 当前选中的观影人
let seatStates = {}; // 座位状态 {row-col: 'green'|'yellow'|'red'}
let lastSelectionType;
document.addEventListener('DOMContentLoaded', function() {
    // 加载配置
    TestMode();
    config = JSON.parse(sessionStorage.getItem('cinemaConfig'));
    if (!config) {
        alert('系统错误，请重新开始');
        window.location.href = 'index.html';
        return;
    }
    
    // 初始化座位状态
    initializeSeatStates();
    
    // 绑定事件
    bindEvents();
    
    // 渲染观影人列表
    renderViewerList();
});

function initializeSeatStates() {
    // 初始化所有座位为绿色（可选）
    for (let i = 0; i < config.totalRows; i++) {
        for (let j = 0; j < config.totalCols; j++) {
            seatStates[`${i}-${j}`] = 'green';
        }
    }
    
    // 标记已预订和已购买的座位
    config.reservedSeats.forEach(seat => {
        seatStates[`${seat.row}-${seat.col}`] = 'red';
    });
    config.purchasedSeats.forEach(seat => {
        seatStates[`${seat.row}-${seat.col}`] = 'red';
    });
}

function bindEvents() {
    // 自动选座按钮
    const autoBtn = document.getElementById('auto');
    if (autoBtn) {
        autoBtn.addEventListener('click', autoSelectSeats);
    }
    
    // 查看购票按钮
    const checkBtn = document.getElementById('check-button');
    if (checkBtn) {
        checkBtn.addEventListener('click', () => {
            window.location.href = 'payment-finished.html';
        });
    }
    
    // 添加观影人按钮
    const addBtn = document.getElementById('addition-button');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            // 在点击时检查限制
            if(config.viewers.length >= 20 && config.ticketType === 'group'){
                alert('团体人数不能超过20人！');
                return;
            }
            if(config.viewers.length >= 1 && config.ticketType === 'individual'){
                alert('当前是个人选票，只能添加一个观影人！');
                return;
            }
            // 没有限制就跳转
            window.location.href = 'adding-viewer.html';
        });
    }
    
    // 删除观影人按钮
    const deleteBtn = document.getElementById('delete-button');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteSelectedViewers);
    }
    
    // 完成选座按钮
    const doneBtn = document.getElementById('done-button');
    if (doneBtn) {
        doneBtn.addEventListener('click', finishSelection);
    }
}

// 重写handleSeatSelection函数
function handleSeatSelection(row, col, ctrlKey) {
    console.log("选择座位:", row, col);
    
    const seatKey = `${row}-${col}`;
    const currentState = seatStates[seatKey];
    if(ctrlKey){
        // CTRL模式：按点击顺序分配给观影人
    if (config.viewers.length === 0) {
        alert('请先添加观影人！');
        return;
    }

    
    // 只要是不完全选择就置零
    if (ctrlClickIndex ===0||lastSelectionType==='single') {
        config.viewers.forEach(viewer => {
            if (viewer.seatRow !== null && viewer.seatCol !== null) {
                const oldKey = `${viewer.seatRow}-${viewer.seatCol}`;
                seatStates[oldKey] = 'green';
                changeSeatState(viewer.seatRow, viewer.seatCol, 'green');
                viewer.seatRow = null;
                viewer.seatCol = null;
            }
        });
    }
    

    
    const currentViewer = config.viewers[ctrlClickIndex];
    
    // 检查年龄限制
    if (!checkAgeRestriction(currentViewer, row)) {
        return; // 不增加索引，让用户重新选择
    }
    
    // 分配座位给当前观影人
    currentViewer.seatRow = row;
    currentViewer.seatCol = col;
    seatStates[seatKey] = 'yellow';
    changeSeatState(row, col, 'yellow');
    
    // 移动到下一个观影人
    ctrlClickIndex++;
    
    
    lastSelectionType='ctrl'
    saveConfig();
    renderViewerList();
    // 提示当前进度
    if (ctrlClickIndex < config.viewers.length) {
        console.log(`已为 ${currentViewer.name} 分配座位，请为 ${config.viewers[ctrlClickIndex].name} 选择座位`);
    } else {
        alert('所有观影人座位分配完成！');
        ctrlClickIndex = 0; // 重置索引
    }
    }
    else{
    // 如果座位已被占用，不能选择
    if (currentState === 'red') {
        alert('该座位已被占用！');
        return;
    }
    
    // 如果没有选中观影人，提示用户
    if (!selectedViewer) {
        alert('请先选择一个观影人！');
        return;
    }
    
    // 检查年龄限制
    if (!checkAgeRestriction(selectedViewer, row)) {
        return;
    }
    
    // 如果座位已被当前观影人选中，取消选择
    if (selectedViewer.seatRow === row && selectedViewer.seatCol === col) {
        selectedViewer.seatRow = null;
        selectedViewer.seatCol = null;
        seatStates[seatKey] = 'green';
        changeSeatState(row, col, 'green');
    } else {
        // 如果观影人之前选了其他座位，先清除
        if (selectedViewer.seatRow !== null && selectedViewer.seatCol !== null) {
            const oldKey = `${selectedViewer.seatRow}-${selectedViewer.seatCol}`;
            seatStates[oldKey] = 'green';
            changeSeatState(selectedViewer.seatRow, selectedViewer.seatCol, 'green');
        }
        
        // 选择新座位
        selectedViewer.seatRow = row;
        selectedViewer.seatCol = col;
        seatStates[seatKey] = 'yellow';
        changeSeatState(row, col, 'yellow');
    }
    lastSelectionType='single'
    saveConfig();
    renderViewerList();
}
}

// 检查年龄限制
function checkAgeRestriction(viewer, row) {
    const age = parseInt(viewer.age);
    
    // 15岁以下不能坐前三排
    if (age < 15 && row < 3) {
        alert(`${viewer.name}未满15岁，不能坐前三排！`);
        return false;
    }
    
    // 60岁以上不能坐后三排
    if (age > 60 && row >= config.totalRows - 3) {
        alert(`${viewer.name}超过60岁，不能坐后三排！`);
        return false;
    }
    
    return true;
}

// 自动选座
function autoSelectSeats() {
    if (config.viewers.length === 0) {
        alert('请先添加观影人！');
        return;
    }
    
    if (config.ticketType === 'group') {
        autoSelectForGroup();
    } else {
        autoSelectForIndividual();
    }
}
// 个人票自动选座
function autoSelectForIndividual() {
    if (config.viewers.length === 0) {
        alert('请先添加观影人！');
        return;
    }
    
    // 先清除所有人的座位
    config.viewers.forEach(viewer => {
        if (viewer.seatRow !== null && viewer.seatCol !== null) {
            const seatKey = `${viewer.seatRow}-${viewer.seatCol}`;
            seatStates[seatKey] = 'green';
            changeSeatState(viewer.seatRow, viewer.seatCol, 'green');
            viewer.seatRow = null;
            viewer.seatCol = null;
        }
    });
    
    config.viewers.forEach(viewer => {
        const age = parseInt(viewer.age);
        let startRow = 0;
        let endRow = config.totalRows - 1;
        
        // 应用年龄限制
        if (age < 15) startRow = 3;
        if (age > 60) endRow = config.totalRows - 4;
        
        // 收集所有可用座位
        const availableSeats = [];
        for (let row = startRow; row <= endRow; row++) {
            for (let col = 0; col < config.totalCols; col++) {
                const seatKey = `${row}-${col}`;
                if (seatStates[seatKey] === 'green') {
                    availableSeats.push({row, col});
                }
            }
        }
        
        if (availableSeats.length > 0) {
            // 随机选择一个座位
            const randomIndex = Math.floor(Math.random() * availableSeats.length);
            const selectedSeat = availableSeats[randomIndex];
            
            viewer.seatRow = selectedSeat.row;
            viewer.seatCol = selectedSeat.col;
            seatStates[`${selectedSeat.row}-${selectedSeat.col}`] = 'yellow';
            changeSeatState(selectedSeat.row, selectedSeat.col, 'yellow');
        } else {
            alert(`无法为${viewer.name}自动分配座位！`);
        }
    });
    
    saveConfig();
    renderViewerList();
}

// 团体票自动选座
function autoSelectForGroup() {
    const viewerCount = config.viewers.length;
    if (viewerCount > 20) {
        alert('团体票最多20人！');
        return;
    }
    
    if (viewerCount === 0) {
        alert('请先添加观影人！');
        return;
    }
    
    // 先清除所有人的座位
    config.viewers.forEach(viewer => {
        if (viewer.seatRow !== null && viewer.seatCol !== null) {
            const seatKey = `${viewer.seatRow}-${viewer.seatCol}`;
            seatStates[seatKey] = 'green';
            changeSeatState(viewer.seatRow, viewer.seatCol, 'green');
            viewer.seatRow = null;
            viewer.seatCol = null;
        }
    });
    
    // 确定年龄限制范围
    let minAge = Math.min(...config.viewers.map(v => parseInt(v.age)));
    let maxAge = Math.max(...config.viewers.map(v => parseInt(v.age)));
    
    let startRow = 0;
    let endRow = config.totalRows - 1;
    
    if (minAge < 15) startRow = 3;
    if (maxAge > 60) endRow = config.totalRows - 4;
    
    // 收集所有可能的连续座位组合
    const availableGroups = [];
    
    for (let row = startRow; row <= endRow; row++) {
        // 对于每一行，找出所有可能的连续座位起始位置
        for (let startCol = 0; startCol <= config.totalCols - viewerCount; startCol++) {
            let canUseThisGroup = true;
            
            // 检查从startCol开始的viewerCount个座位是否都可用
            for (let i = 0; i < viewerCount; i++) {
                const seatKey = `${row}-${startCol + i}`;
                if (seatStates[seatKey] !== 'green') {
                    canUseThisGroup = false;
                    break;
                }
            }
            
            if (canUseThisGroup) {
                availableGroups.push({
                    row: row,
                    startCol: startCol
                });
            }
        }
    }
    
    if (availableGroups.length > 0) {
        // 随机选择一组座位
        const randomIndex = Math.floor(Math.random() * availableGroups.length);
        const selectedGroup = availableGroups[randomIndex];
        
        // 分配座位
        for (let i = 0; i < viewerCount; i++) {
            const viewer = config.viewers[i];
            viewer.seatRow = selectedGroup.row;
            viewer.seatCol = selectedGroup.startCol + i;
            const seatKey = `${selectedGroup.row}-${selectedGroup.startCol + i}`;
            seatStates[seatKey] = 'yellow';
            changeSeatState(selectedGroup.row, selectedGroup.startCol + i, 'yellow');
        }
        saveConfig();
        renderViewerList();
    } else {
        alert('无法为团体找到足够的连续座位！');
    }
}

// 删除选中的观影人
function deleteSelectedViewers() {
    const selectedAudiences = document.querySelectorAll('.audience.selected');
    if (selectedAudiences.length === 0) {
        alert('请先选择要删除的观影人！');
        return;
    }
    
    selectedAudiences.forEach(audienceElement => {
        const index = parseInt(audienceElement.dataset.index);
        const viewer = config.viewers[index];
        
        // 释放座位
        if (viewer.seatRow !== null && viewer.seatCol !== null) {
            const seatKey = `${viewer.seatRow}-${viewer.seatCol}`;
            seatStates[seatKey] = 'green';
            changeSeatState(viewer.seatRow, viewer.seatCol, 'green');
        }
        
        // 从列表中删除
        config.viewers.splice(index, 1);
    });
    
    saveConfig();
    renderViewerList();
    //render(); // 重新渲染座位图
}

// 完成选座
function finishSelection() {
    // 检查是否所有观影人都已选座
    const unselectedViewers = config.viewers.filter(v => v.seatRow === null);
    if (unselectedViewers.length > 0) {
        const names = unselectedViewers.map(v => v.name).join('、');
        alert(`以下观影人尚未选座：${names}`);
        return;
    }
    
    if (config.viewers.length === 0) {
        alert('请先添加观影人！');
        return;
    }
    
    // 将选中的座位添加到selectedSeats中
    config.selectedSeats = config.viewers.map(viewer => ({
        row: viewer.seatRow,
        col: viewer.seatCol,
        viewer: viewer
    }));
    
    saveConfig();
    // window.location.href = 'payment.html';
    window.location.href = 'checkticket.html';
}

// 渲染观影人列表
function renderViewerList() {
    const audienceList = document.getElementById('audience-list');
    if (!audienceList) return;
    
    audienceList.innerHTML = '';
    
    config.viewers.forEach((viewer, index) => {
        const audienceDiv = document.createElement('div');
        audienceDiv.className = 'audience';
        audienceDiv.dataset.index = index;
        
        const seatInfo = viewer.seatRow !== null ? 
            `已选：${viewer.seatRow + 1}排${viewer.seatCol + 1}列` : 
            '未选座';
            
        audienceDiv.innerHTML = `
            ${viewer.name} (${viewer.age}岁)
            <p>${seatInfo}</p>
        `;
        
        // 绑定点击事件
        audienceDiv.addEventListener('click', function() {
            // 切换选中状态
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                if (selectedViewer === viewer) {
                    selectedViewer = null;
                }
            } else {
                // 移除其他观影人的选中状态
                document.querySelectorAll('.audience').forEach(el => {
                    el.classList.remove('selected');
                });
                this.classList.add('selected');
                selectedViewer = viewer;
            }
        });
        
        audienceList.appendChild(audienceDiv);
    });
}

// 获取座位颜色（用于Canvas绘制）
function getSeatColor(row, col) {
    const seatKey = `${row}-${col}`;
    return seatStates[seatKey] || 'green';
}

// 保存配置到sessionStorage
function saveConfig() {
    sessionStorage.setItem('cinemaConfig', JSON.stringify(config));
}

// 在页面加载完成后调用render函数更新座位状态
window.addEventListener('load', function() {
    setTimeout(() => {
        // 重新渲染所有座位状态
        for (let row = 0; row < config.totalRows; row++) {
            for (let col = 0; col < config.totalCols; col++) {
                const color = getSeatColor(row, col);
                changeSeatState(row, col, color);
            }
        }
    }, 100);
});
//点击跳转
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('check-button').onclick = function() {
        window.location.href = 'ticketinfo.html';
    };
});

function initializeSession() {
    //注释掉，采用index.js中传入的数据


    // 清除之前的数据
    // sessionStorage.clear();
    
    // // 初始化基本配置
    // const config = {
    //     ticketType: 'group', // 'individual' 或 'group'
    //     viewers: [], // 观影人列表
    //     selectedSeats: [], // 已选座位
    //     reservedSeats: [], // 预订座位
    //     purchasedSeats: [], // 已购买座位
    //     totalRows: 10, //后续看在哪里传入这个参数
    //     totalCols: 20 //后续看在哪里传入这个参数
    // };
    
    // sessionStorage.setItem('cinemaConfig', JSON.stringify(config));
}


