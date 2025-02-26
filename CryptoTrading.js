let hasExecutedSell = false; // 記錄是否已執行「賣出開空」
let intervalID = setInterval(() => {
    let elements = document.querySelectorAll(".fvn-number");
    
    // 過濾出符合 HH:MM:SS 格式的元素
    let regex = /^\d{2}:\d{2}:\d{2}$/;
    let validElement = Array.from(elements).find(el => regex.test(el.innerText));

    if (!validElement) {
        console.log("未找到符合時間格式的元素");
        return; // 如果沒有符合的時間格式，直接 return
    }

    let value = validElement.innerText;
    console.log(`倒數計時: ${value}`);

    // 當時間為 00:00:00 時，點擊「賣出開空」按鈕（僅執行一次）
    if (value === "00:00:00" && !hasExecutedSell) {
        clearInterval(intervalID); // 停止定時器
        hasExecutedSell = true; // 設置旗標，確保不會再次執行
        console.log("ok");
        
        const buttons = document.querySelectorAll('button .fs-14.color-white');
        buttons.forEach(button => {
            if (button.innerText.includes("賣出開空")) {
                const buttonElement = button.closest('button');
                buttonElement.click();
                console.log("賣出開空按鈕已被點擊");

                // 開始每 100ms 檢查並執行「一鍵平倉」30 次
                let count = 0;
                const checkCloseButtonInterval = setInterval(() => {
                    const closeButton = document.querySelector('a.color-text-button');
                    if (closeButton) {
                        closeButton.click();
                        console.log("一鍵平倉按鈕已被點擊");

                        const confirmButton = Array.from(document.querySelectorAll('button.footer_btn'))
                            .find(button => button.getAttribute('type') === 'button' && button.innerText.includes("確定"));

                        if (confirmButton) {
                            confirmButton.click();
                            console.log("確定按鈕已被點擊");
                        }
                    }

                    count++; // 增加計數
                    if (count >= 30) { // 當執行達到 30 次時，停止 setInterval
                        clearInterval(checkCloseButtonInterval);
                        console.log("已達到 30 次執行，停止檢查一鍵平倉");
                    }
                }, 100); // 每 100 毫秒（0.1 秒）檢查一次「一鍵平倉」按鈕

            }
        });
    }
}, 10);