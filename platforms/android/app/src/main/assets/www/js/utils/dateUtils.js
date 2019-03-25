"use strict";


var DateUtils = function () {
    var self = this;

    self.ELAPSED_TIME_SUFFIXES = {
    	"years": ["yr", " year", " years"],
    	"months": ["mon", " month", " months"],
    	"weeks": ["wk", " week", " weeks"],
    	"days": ["d", " day", " days"],
    	"hours": ["h", " hour", " hours"],
    	"minutes": ["m", " minute", " minutes"],
    	"seconds": ["s", " second", " seconds"]
    };

    /**
	 * Get the current date
	 */
	self.getCurrentDate = function() {
	  	var date = new Date();
	  	return date.toString('yyyy-mm-dd hh:MM:ss');
	};

    /**
	 * Get current date in UTC
	 */
	self.getCurrentDateUTC = function() {
		return new Date().toISOString();
	};

    /**
	 * Get the current timestamp
	 */
	self.getCurrentDateTimestamp = function() {
		var date = new Date();
	  	return date.getTime();
	};

    /**
	 * Get the elapsed time
	 */
	self.dateTimeToElapsed = function(utcTime, longSuffix, weekdayForOneWeekOld) {
		var d = new Date(utcTime);
		var diff = new Date().getTime() - d.getTime();

		var result = "";
		var suffixToUse = null;
		var value = null;

		var isLessThanOneWeek = false;
		var showAsBlank = false;

		if(diff >= 31536000000) {
			// 1 year
			value = Math.round(diff / 31536000000);
			suffixToUse = self.ELAPSED_TIME_SUFFIXES["years"];
		}
		else if(diff >= 2592000000) {
			// 1 month
			value = Math.round(diff / 2592000000);
			suffixToUse = self.ELAPSED_TIME_SUFFIXES["months"];
		}
		else if(diff >= 604800000) {
			// 1 week
			value = Math.round(diff / 604800000);
			suffixToUse = self.ELAPSED_TIME_SUFFIXES["weeks"];
		}
		else if(diff >= 86400000) {
			if(weekdayForOneWeekOld === true) {
				isLessThanOneWeek = true;
			}

			// 1 day
			value = Math.round(diff / 86400000);
			suffixToUse = self.ELAPSED_TIME_SUFFIXES["days"];
		}
		else if(diff >= 3600000) {
			if(weekdayForOneWeekOld === true) {
				showAsBlank = true;
			}

			// 1 hour
			value = Math.round(diff / 3600000);
			suffixToUse = self.ELAPSED_TIME_SUFFIXES["hours"];
		}
		else if(diff >= 60000) {
			if(weekdayForOneWeekOld === true) {
				showAsBlank = true;
			}
			// 1 minute
			value = Math.round(diff / 60000);
			suffixToUse = self.ELAPSED_TIME_SUFFIXES["minutes"];
		}
		else if(diff >= 1000) {
			if(weekdayForOneWeekOld === true) {
				showAsBlank = true;
			}

			// 1 second
			value = Math.round(diff / 1000);
			suffixToUse = self.ELAPSED_TIME_SUFFIXES["seconds"];
		}

		if(suffixToUse) {
			if(longSuffix === true) {
				if(value == 1) {
					result = value + suffixToUse[1];
				}
				else {
					result = value + suffixToUse[2];
				}
			}
			else {
				result = value + suffixToUse[0];
			}
		}
		else {
			result = "";
		}

		if(isLessThanOneWeek === true) {
			var todayDayName = Date.today().getDayName();
			var inputDayName = d.getDayName();

			if(todayDayName == inputDayName) {
				result = "Today";
			}
			else {
				result = inputDayName;
			}
		}

		if(showAsBlank === true) {
			result = "";
		}

		return result;
	};

    self.generateUUID = function(){
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };

    self.formatDate = function(d) {
        var date = new Date(d);
        return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();        
    };

    return self;
};
