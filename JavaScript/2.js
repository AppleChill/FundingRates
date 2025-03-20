// 設定全域變數作為閾值
const LOWER_THRESHOLD = -10; // 設定數值閾值：下限
const UPPER_THRESHOLD = 20;  // 設定數值閾值：上限
const TARGET_TIME = "00:00:00"; // 設定目標時間

let hasExecutedSell = false; // 記錄是否已執行「賣出開空」

let intervalID = setInterval(() => {
    // 取得當前中原標準時間（CST, UTC+8）
    let currentTime = new Date().toLocaleTimeString("zh-TW", { hour12: false });

    console.log(`當前時間: ${currentTime}`);

    // 當時間為 00:00:00 且尚未執行過「賣出開空」時，執行點擊（延遲 0.1 秒）
    if (currentTime === TARGET_TIME && !hasExecutedSell) {
        hasExecutedSell = true; // 設置旗標，確保只執行一次
        console.log("ok，0.1 秒後執行賣出開空");

        setTimeout(() => {
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
                }
            });
        }, 100); // 延遲 100 毫秒 (0.1 秒)
    }
}, 10);
