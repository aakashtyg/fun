/**
 * Follow all only works for https://www.twitter.com/someTwitterHandle/followers
 * Unfollow all only works for  https://www.twitter.com/following
 * A PERSON CAN FOLLOW 1000 PEOPLE IN A DAY
 */

// Common Module
var common = (function() {
    /**
     * Test Case: Chane the background color of each button
     * @param btn - Button element
     * @param {string} color - Color for test case
     */
    function testCase(btn, color) {
        btn.style.background = color;
    }
    /**
     * Find total people following or total followers.
     * @param {string} status - If status is "following", find total people following, if status is "followers"
     * then get total follwers on a particular person's page.
     * @return {number} - totalFollowing, totalFollowers
     */
    function updateFollowersOrFollowing(status) {
        var el = document.querySelectorAll('[data-nav]');
        var followingAnchorTag,
            totalFollowing,
            totalFollowers;
        for(var i = 0; i < el.length; i++) {

            // Get that "data-nav" element that has value "following"
            if(el[i].getAttribute("data-nav") == status) {
                /* Anchor tag, contains the total number of followers.
                * (Beside Tweets, Following and Likes)
                */
                followingAnchorTag = el[i];
                break;
            }
        }

        // Iterate the anchor tag's children to get total followers
        for(var j = 0; j < followingAnchorTag.children.length; j++) {
            if(followingAnchorTag.children[j].getAttribute("class") == "ProfileNav-value") {
                // Span tag containing total number of followers
                var spanTag = followingAnchorTag.children[j];

                /* We get total followers in the form "3,456" i.e. string. First replace ","
                * with space, and parse the string to get integer.
                */
                var temp = spanTag.innerHTML;
                if(status == "following") {
                    totalFollowing = parseInt(temp.replace(/,/g, ''));
                    return totalFollowing;
                } else {
                    totalFollowers = parseInt(temp.replace(/,/g, ''));
                    return totalFollowers;
                }
            }
        }
    }
    return {
        test: testCase,
        update: updateFollowersOrFollowing
    }
})();
var FollowAll = (function() {
	/**
	 * Have to take how many people to follow as twitter does not show correctly the total followers of a person in the header.
	 * Sometimes the total followers in the header and actually available people in the followers page differ.
	 */
    "use strict";
    var totalFollowers;
    var intervalId;
    var btnArray;

    /**
     * Follow all the people whom you have not already followed
     */
    function _followAll() {
        // Go to top
 		window.scrollTo(0,0);

 		for(var i = 0; i <= totalFollowers; i++) {
 			// Get each button from the buttons array
 			var btn = btnArray[i];
 			/*
 			 * Iterate over each span tag inside the btn element.
 			 * If the btn has text "Follow" then only click the button
 			 */
 			for(var j = 0; j < btn.children.length; j++) {
 				/*
 				 * Check the display property of current span element.
 				 * If the display property of current span element is "block" and the
 				 * text is "Following", then don't click the button. We are already follwing
 				 * the person. (We would unfollow that person if we click the button)
 				 */
 				var currentStyleOfSpan = _getStyle(btn.children[j], "display");
 				if(currentStyleOfSpan ==  "block" && btn.children[j].innerHTML.trim() == "Following") {
 					console.log("Time to break, move on to next btn");
 					break;
 				} else if(currentStyleOfSpan ==  "block" && btn.children[0].childElementCount == 1){
 					/* btn.children[0].childElementCount == 1, true when span element contains another
 					 * span tag "<span class="Icon Icon--follow"></span>" (this is the follow icon)
 					 * and text "Follow". This is the  Follow button.
 					 */
                    btn.click()

 					/*
 					 * TEST CASE: This is a test case. To be used while development. This test case
 					 * changes the background color of ONLY "Follow" buttons instead of clicking them.
 					 */
 					// common.test(btn, "yellow");
 				}
 			}
 		}
		// Success message
		alert("Successfully followed!");
    }
    /**
     * Get the css "display" property for span elements inside the "Follow" button
     */
    function _getStyle(el, styleProp) {

		var temp;
		if(el.currentStyle) {
			temp = el.currentStyle[styleProp];
		}
		else if(window.getComputedStyle) {
			temp = document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
		}
		return temp;
	}

    /**
     * Scroll the container till we reach the bottom
     * Make sure the scripts run, when URL: https://www.twitter.com/someTwitterHandle/followers
     * and not  https://www.twitter.com/ or some other
     */
    function _scrollContainer() {
		window.scrollTo(0, document.body.scrollHeight);
		btnArray = document.getElementsByClassName("user-actions-follow-button");
		if(btnArray.length >= totalFollowers) {
			clearInterval(intervalId);
			console.log("Clearing interval!");
			_followAll();
		}
    }
    /**
     * Update total followers and start interval
     */
    function init(customToFollow = false) {
		if(customToFollow) {
			totalFollowers = customToFollow;
			// console.log("Custom to follow");
		} else {
    		totalFollowers = common.update("followers");
		}
    	intervalId = setInterval(_scrollContainer, 500);
    }
    return {
        init: init
    };
})();

var UnfollowAll = (function() {
    "use strict";
    var totalFollowing;
    var intervalId = 0;
    var btnArray;

    /**
	 * Unfollow all the people
	 */
	function _unFollowAll(){

        // console.log(btnArray.length);
		// Go to top
		window.scrollTo(0,0);
		for(var i = 0; i < btnArray.length; i++) {
			// Get each button from the buttons array
			var btn = btnArray[i];
            btn.click();
            /*
             * TEST CASE: This is a test case. To be used while development. This test case
             * changes the background color of the "Following" buttons.
             */
            //common.test(btn, "pink");
		}
        // Success message
        alert("Everyone unfollowed!");
	}

    /**
	 * Scroll the container till we reach the bottom
	 */
	function _scrollContainer() {
		window.scrollTo(0, document.body.scrollHeight);
		btnArray = document.getElementsByClassName("user-actions-follow-button");
		if(btnArray.length == totalFollowing) {
            console.log("Clearing interval!");
			clearInterval(intervalId);
			_unFollowAll();
		}
	}
    /**
     * Update total following and start interval
     */
    function init() {
        totalFollowing = common.update("following");
    	intervalId = setInterval(_scrollContainer, 500);
    }
    return {
        init: init
    };
})();

/**
 * Unfollow only those people who follow you.
 *
 */
var Unfollow = (function() {
    "use strict";
    var totalFollowing;
    var intervalId = 0;
    var btnArray = -1;

    /**
	 * Unfollow only those people who follow you
	 */
	function _unFollow(){
        var btn;

		// Go to top
		window.scrollTo(0,0);
        // Get only those span's containing "FOLLOWS YOU"
        var spanArray = document.getElementsByClassName("FollowStatus");
		for(var i = 0; i < spanArray.length; i++) {
            // Now navigate to the conatiner containing span "FOLLOWS YOU" and the Following Button
            var container = document.getElementsByClassName("FollowStatus")[i].parentNode.parentNode.parentNode;
            // Get the following button, and click it to unfollow
            btn = container.getElementsByClassName("user-actions-follow-button js-follow-btn")[0];
            btn.click();

            /*
             * TEST CASE: This is a test case. To be used while development. This test case
             * changes the background color of the "Following" buttons.
             */
            // common.test(btn, "red");
		}
        // Success message
        alert("Unfollowed only those who follow you!");
	}

    /**
	 * Scroll the container till we reach the bottom
	 */
	function _scrollContainer(){
		window.scrollTo(0, document.body.scrollHeight);
		btnArray = document.getElementsByClassName("user-actions-follow-button");
		if(btnArray.length == totalFollowing) {
            console.log("Clearing interval!");
			clearInterval(intervalId);
			_unFollow();
		}
	}
    /**
     * Update total following and start interval
     */
    function init() {
        totalFollowing = common.update("following");
        console.log(totalFollowing);
    	intervalId = setInterval(_scrollContainer, 500);
    }
    return {
        init: init
    };
})();

function onMessage(request, sender, sendResponse) {

    // Execute the follow script if the status from background is "execute"
    if(request.status == "execute-follow-script") {
        // console.log(request.extra);
        // console.log('CONTENT.JS: ' + request.iserror);

        // Check for error
        if(request.iserror == true || request.extra >= 1000) {
            alert("Enter a valid number! Number should be below 1000 as twitter allows user to follow at max 1000 users a day.");
        } else {
            /**
             * Make sure the scripts run, when URL: https://www.twitter.com/someTwitterHandle/followers
             * and not  https://www.twitter.com/ or some other
             */
            if((window.location.href).indexOf("followers") > 0) {

                console.log('CONTENT.JS: Executing Follow script');
                // Call init function of FollowAll Module
                FollowAll.init(request.extra);
                // Send response status as success to the background
                sendResponse({ status: "success" });
            } else {
                // indexOf() Returns -1 if wrong URL
                alert("Wrong URL, make sure that you are at the right URL:  https://www.twitter.com/someTwitterHandle/followers or https://www.twitter.com/followers");
            }
        }
    } else if(request.status == "execute-unfollow-all-script") {

        /**
         * Make sure the scripts run, when URL: https://www.twitter.com/following
         * and not  https://www.twitter.com/ or some other
         */
        if(window.location.href == "https://twitter.com/following" || window.location.href == "https://www.twitter.com/following") {

            console.log('CONTENT.JS: Executing Unfollow All script');
            // Call init function of UnfollowAll Module
            UnfollowAll.init();
            // Send response status as success to the background
            sendResponse({ status: "success" });
        } else {
            alert("Wrong URL, make sure that you are at the right URL: https://www.twitter.com/following");
        }
    } else if(request.status == "execute-unfollow-script") {

        /**
         * Make sure the scripts run, when URL: https://www.twitter.com/following
         * and not  https://www.twitter.com/ or some other
         */
        if(window.location.href == "https://twitter.com/following" || window.location.href == "https://www.twitter.com/following") {

            console.log('CONTENT.JS: Executing Unfollow script');
            // Call init function of Unfollow Module
            Unfollow.init();
            // Send response status as success to the background
            sendResponse({ status: "success" });
        } else {
            alert("Wrong URL, make sure that you are at the right URL: https://www.twitter.com/following");
        }
    }
}

// Add listener to listen to incoming messages from background
chrome.runtime.onMessage.addListener(onMessage);
