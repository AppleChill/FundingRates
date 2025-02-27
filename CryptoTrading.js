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
        hasExecutedSell = true; // 設置旗標，確保不會再次執行
        console.log("ok");

        const buttons = document.querySelectorAll('button .fs-14.color-white');
        buttons.forEach(button => {
            if (button.innerText.includes("賣出開空")) {
                const buttonElement = button.closest('button');
                buttonElement.click();
                console.log("賣出開空按鈕已被點擊");

                // **停止監測時間變化**
                clearInterval(intervalID);
                console.log("已停止監測時間變化");

                // **延遲 500ms，然後開始檢查「一鍵平倉」是否變可點擊**
                setTimeout(() => {
                    console.log("開始監測『一鍵平倉』是否變可點擊...");

                    let checkCloseButtonInterval = setInterval(() => {
                        const closeButton = document.querySelector('a.color-text-button');

                        // **檢查「一鍵平倉」按鈕是否可點擊**
                        if (closeButton && !closeButton.classList.contains("cursor-not-allowed")) {
                            console.log("一鍵平倉按鈕現在可點擊，開始執行點擊動作...");

                            let count = 0; // 計數變數
                            const executeCloseInterval = setInterval(() => {
                                if (count >= 30) {
                                    clearInterval(executeCloseInterval);
                                    console.log("一鍵平倉已執行 30 次，停止點擊");
                                    return;
                                }

                                // **執行點擊「一鍵平倉」**
                                closeButton.click();
                                console.log(`一鍵平倉按鈕點擊次數：${count + 1}`);

                                // **嘗試點擊「確定」按鈕**
                                const confirmButton = Array.from(document.querySelectorAll('button.footer_btn'))
                                    .find(button => button.getAttribute('type') === 'button' && button.innerText.includes("確定"));

                                if (confirmButton) {
                                    confirmButton.click();
                                    console.log("確定按鈕已被點擊");
                                }

                                count++; // 增加計數
                            }, 100); // **每 100 毫秒執行一次，最多執行 30 次**

                            // **當「一鍵平倉」變可點擊時，停止監測它是否變可點擊**
                            clearInterval(checkCloseButtonInterval);
                        } else {
                            console.log("一鍵平倉按鈕目前不可點擊，繼續監測...");
                        }
                    }, 100); // **每 100ms 檢查「一鍵平倉」是否可點擊**
                }, 500); // **延遲 500ms 再開始檢查**
            }
        });
    }
}, 10);
