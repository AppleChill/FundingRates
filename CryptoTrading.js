// 設定全域變數作為閾值
const LOWER_THRESHOLD = -10; // 設定數值閾值：下限
const UPPER_THRESHOLD = 20;  // 設定數值閾值：上限
const TARGET_TIME = "00:00:00"; // 設定目標時間

let hasExecutedSell = false; // 記錄是否已執行「賣出開空」
let intervalID = setInterval(() => {
    let elements = document.querySelectorAll(".fvn-number");

    // 過濾出符合 HH:MM:SS 格式的元素
    let regex = /^\d{2}:\d{2}:\d{2}$/;
    let validElement = Array.from(elements).find(el => regex.test(el.innerText));

    if (!validElement) {
        console.log("未找到符合時間格式的元素");
        return; // 如果沒有符合的時間格式，直接跳出
    }

    let value = validElement.innerText;
    console.log(`倒數計時: ${value}`);

    // 當時間為 00:00:00 且尚未執行過「賣出開空」時，執行點擊
    if (value === TARGET_TIME && !hasExecutedSell) {
        hasExecutedSell = true; // 設置旗標，確保只執行一次
        console.log("ok");

        // 尋找「賣出開空」按鈕並點擊
        const buttons = document.querySelectorAll('button .fs-14.color-white');
        buttons.forEach(button => {
            if (button.innerText.includes("賣出開空")) {
                const buttonElement = button.closest('button');
                buttonElement.click();
                console.log("賣出開空按鈕已被點擊");

                // **停止監測時間變化**
                clearInterval(intervalID);
                console.log("已停止監測時間變化");

                // **開始監測「一鍵平倉」按鈕是否變可點擊**
                console.log("開始監測『一鍵平倉』是否變可點擊...");
                let checkCloseButtonInterval = setInterval(() => {
                    const closeButton = document.querySelector('a.color-text-button');

                    // **當「一鍵平倉」按鈕變可點擊時**
                    if (closeButton && !closeButton.classList.contains("cursor-not-allowed")) {
                        console.log("一鍵平倉按鈕現在可點擊，執行點擊...");
                        closeButton.click();
                        console.log("一鍵平倉按鈕已被點擊");

                        // **點擊「一鍵平倉」後，延遲 500ms 再點擊「確定」**
                        setTimeout(() => {
                            let confirmCount = 0; // 確定按鈕點擊計數，最多執行 30 次
                            let confirmInterval = setInterval(() => {
                                // 尋找「確定」按鈕
                                const confirmButton = Array.from(document.querySelectorAll('button.footer_btn'))
                                    .find(button => button.getAttribute('type') === 'button' && button.innerText.includes("確定"));

                                // 取得當前交易數值
                                let outerDivs = document.querySelectorAll(".bu-descriptions-item.bu-descriptions-item--align-left");
                                let values = [];

                                // 解析數值
                                outerDivs.forEach(outerDiv => {
                                    let innerDivs = outerDiv.querySelectorAll(".bu-descriptions--content");
                                    innerDivs.forEach(innerDiv => {
                                        let numbers = innerDiv.querySelectorAll(".fvn-number");
                                        numbers.forEach(el => {
                                            let num = parseFloat(el.textContent.trim());
                                            if (!isNaN(num)) {
                                                values.push(num);
                                            }
                                        });
                                    });
                                });

                                // 取得倒數第二個數值
                                if (values.length >= 2) {
                                    let secondLastValue = values[values.length - 2];

                                    // 若數值超過閾值範圍，則點擊「確定」
                                    if (secondLastValue < LOWER_THRESHOLD || secondLastValue > UPPER_THRESHOLD) {
                                        if (confirmButton) {
                                            confirmButton.click();
                                            console.log(`數值 ${secondLastValue}`);
                                            console.log(`確定按鈕已被點擊 (${confirmCount + 1}/30)`);
                                        }
                                        confirmCount++; // 計數 +1
                                        
                                        // 若已點擊 30 次，停止執行
                                        if (confirmCount >= 30) {
                                            clearInterval(confirmInterval);
                                            console.log("確定按鈕已點擊 30 次，停止執行");
                                        }
                                    } else {
                                        console.log(`數值在 ${LOWER_THRESHOLD} 和 ${UPPER_THRESHOLD} 之間，不做額外動作`, secondLastValue);
                                    }
                                } else {
                                    console.log("數值數量不足，無法取得倒數第二個值");
                                    clearInterval(confirmInterval);
                                }
                            }, 100); // **每 100ms 點擊一次，最多執行 30 次**

                        }, 500); // **延遲 500ms 再開始點擊「確定」**

                        // **當「一鍵平倉」被點擊後，停止監測**
                        clearInterval(checkCloseButtonInterval);
                    } else {
                        console.log("一鍵平倉按鈕目前不可點擊，繼續監測...");
                    }
                }, 100); // **每 100ms 檢查「一鍵平倉」是否可點擊**
            }
        });
    }
}, 10);
