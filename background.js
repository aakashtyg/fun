/**
 * Send message to the content script
 * @param {string} executeStatus - Status to decide which script to run
 * @param {string} debugMessage - Debug message to display in background script
 * @param {string} extra - Pass any extra information to content script, deault is false
 * @param {boolean} error - Pass any error to content script, default is false
 * on which script is executed successfully
 */
function sendMessage(executeStatus, debugMessage, extra = false, error = false) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        // Send message to content script to execute the script
        chrome.tabs.sendMessage(tabs[0].id, { status: executeStatus, extra: extra, iserror: error }, function(response) {
            // Respnse from the content script after receiving the message
            if(response.status == "success"){
                console.log("BACKGROUND.JS: " + debugMessage);
            }
        });
    });
}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        // Check which script to execute
        if(request.status == "follow-btn-click") {
            console.log("BACKGROUND.JS: Follow Btn Clicked");
            // Send message to content script to execute the script on Follow Btn Click
            sendMessage("execute-follow-script", "BACKGROUND.JS: Follow Script executed successfully", request.totalNum, request.iserror);
        } else if(request.status == "unfollow-btn-click") {
            console.log("BACKGROUND.JS: Unfollow Btn Clicked");

            // Send message to content script to execute the script on Unfollow Btn Click
            sendMessage("execute-unfollow-script", "BACKGROUND.JS: Unfollow Script executed successfully")
        } else if(request.status == "unfollow-all-btn-click") {
            console.log("BACKGROUND.JS: Unfollow All Btn Clicked");

            // Send message to content script to execute the script on Unfollow All Btn Click
            sendMessage("execute-unfollow-all-script", "BACKGROUND.JS: Unfollow Script executed successfully");
        } else {
            // helps debug when request status doesn't match
            alert("Unmatched request of '" + request + "' from script to background.js from " + sender);
        }
    }
);
