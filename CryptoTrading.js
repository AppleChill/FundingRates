let intervalID = setInterval(() => {
    let value = document.querySelectorAll(".fvn-number")[9].innerText;
    console.log(`倒數計時: ${document.querySelectorAll(".fvn-number")[9].innerText}`);
    // 檢查時間是否為 0:0:0
    if (value.includes("00:00:00")) {
        console.log("ok");
        clearInterval(intervalID); // 停止定時器

        const buttons = document.querySelectorAll('button .fs-14.color-white');
        // 查找包含「賣出開空」的按鈕並點擊
        buttons.forEach(button => {
            if (button.innerText.includes("賣出開空")) {
                const buttonElement = button.closest('button');
                buttonElement.click();
                console.log("賣出開空按鈕已被點擊");
                
                let count = 0; // 計數變數
                const interval = setInterval(() => {
                    const closeButton = document.querySelector('a.color-text-button');
                    if (closeButton) {
                        closeButton.click();
                       console.log("一鍵平倉按鈕已被點擊");
        
                       const confirmButton = Array.from(document.querySelectorAll('button.footer_btn')).find(button => button.getAttribute('type') === 'button' && button.innerText.includes("確定"));
                       if (confirmButton) {
                            confirmButton.click();
                           console.log("確定按鈕已被點擊");
                       }
                    }
                    count++; // 增加計數
                    if (count >= 30) { // 當執行達到 30 次時，停止 setInterval
                        clearInterval(interval);
                        console.log("已達到 30 次執行，停止執行");
                    }
                }, 100); // 每 100 毫秒（0.1 秒）執行一次      
            }
        });
    }
}, 10);