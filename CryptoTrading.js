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

                // **開始監測「一鍵平倉」是否變可點擊**
                console.log("開始監測『一鍵平倉』是否變可點擊...");
                let checkCloseButtonInterval = setInterval(() => {
                    const closeButton = document.querySelector('a.color-text-button');

                    // **當「一鍵平倉」按鈕變可點擊時**
                    if (closeButton && !closeButton.classList.contains("cursor-not-allowed")) {
                        console.log("一鍵平倉按鈕現在可點擊，執行點擊...");
                        closeButton.click();
                        console.log("一鍵平倉按鈕已被點擊");

                        // **點擊「一鍵平倉」後，延遲 500ms 再開始點擊「確定」**
                        setTimeout(() => {
                            let confirmCount = 0; // 計數變數，最多執行 30 次點擊
                            let confirmInterval = setInterval(() => {
                                const confirmButton = Array.from(document.querySelectorAll('button.footer_btn'))
                                    .find(button => button.getAttribute('type') === 'button' && button.innerText.includes("確定"));

                                if (confirmButton) {
                                    confirmButton.click();
                                    console.log(`確定按鈕已被點擊 (${confirmCount + 1}/30)`);
                                }

                                confirmCount++; // 增加計數
                                if (confirmCount >= 30) {
                                    clearInterval(confirmInterval);
                                    console.log("確定按鈕已點擊 30 次，停止執行");
                                }
                            }, 100); // **每 100ms 點擊一次，最多執行 30 次**
                        }, 500); // **延遲 500ms 再開始點擊「確定」**

                        // **當「一鍵平倉」被點擊後，停止監測它是否可點擊**
                        clearInterval(checkCloseButtonInterval);
                    } else {
                        console.log("一鍵平倉按鈕目前不可點擊，繼續監測...");
                    }
                }, 100); // **每 100ms 檢查「一鍵平倉」是否可點擊**
            }
        });
    }
}, 10);
