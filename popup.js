/**
 * Handles click for Follow Button
 */
function followBtnClick(e) {
    // Total people to follow
    var num = document.getElementById("how-many-to-follow").value;

    if(num == undefined || num == "" || num > 1000) {
        chrome.runtime.sendMessage({ status: "follow-btn-click", totalNum: num, iserror: true }, function(response) {
            // Close the popup when the background finishes processing request
            this.close();
        });
        console.log("POPUP.JS: Invalid");
    } else {
        console.log("POPUP.JS: Valid");
        chrome.runtime.sendMessage({ status: "follow-btn-click", totalNum: num }, function(response) {
            // Close the popup when the background finishes processing request
            this.close();
        });
    }
}
/**
 * Handles click for Unfollow Button
 */
function unFollowBtnClick(e) {
    chrome.runtime.sendMessage({ status: "unfollow-btn-click" }, function(response) {
        // Close the popup when the background finishes processing request
        this.close();
    });
}
/**
 * Handles click for Unfollow All Button
 */
function unFollowAllBtnClick(e) {
    chrome.runtime.sendMessage({ status: "unfollow-all-btn-click" }, function(response) {
        // Close the popup when the background finishes processing request
        this.close();
    });
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('follow-btn').addEventListener('click', followBtnClick);
    document.getElementById('unfollow-btn').addEventListener('click', unFollowBtnClick);
    document.getElementById('unfollow-all-btn').addEventListener('click', unFollowAllBtnClick);
})
