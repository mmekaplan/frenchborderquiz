var exHighScores = {
    ds: null,
    data: null,
    init: function () {
    },


    populateDataSource: function (newdata) {
        var self = this;

        if (newdata != undefined) {
            self.data = newdata;
        } else {

        }

        self.ds = new kendo.data.DataSource({
            data: self.data,
        })
        self.ds.fetch(function () {

            if ($.cookie("hasAccount") == "true" && (($(".exitem").length > 0) || $(".exitemHoriz").length > 0)) {

            }
        })

    },

    getHighScoreByGameID: function (gameID) {
        var i
        for (i = 0; i < objHighScores.length; i++) {
            if (objHighScores[i].GameID == gameID) {
                return objHighScores[i]
            }
        }
        objHighScores
        //var self = this;
        //if (self.ds == undefined) {
        //    self.populateDataSource();
        //}
        //return new Promise(function (resolve, reject) {
        //    var ds = exHighScores.ds;
        //    ds.filter([]);
        //    var filters = [];
        //    filters.push({ field: "GameID", operator: "eq", value: gameID });
        //
        //    var groupsObj;
        //    ds.query({
        //        filter: {
        //            logic: "or",
        //            filters: filters
        //        }
        //    }).then(function (e) {
        //        var item = ds.view();
        //        if (item[0] && item[0].GameScore != undefined) {
        //            resolve(item)
        //        } else {
        //            reject("no data for " + gameID)
        //        }
        //    });
        //})
    },
}


var updateExList = function () {

    //console.log('Update exlist');
    $(".circle-score").remove();
    if ($.cookie("hasAccount") == "true" && ($(".exitem").length > 0) || $(".exitemHoriz").length > 0) {
        $.each($(".exitem .textlink"), function (idx, item) {

            var href = $(item).find("a").attr("href");
            var gameIDx = href.lastIndexOf("/") + 1;
            var ex = href.substring(gameIDx)
            var dataItem;
            dataItem = exHighScores.getHighScoreByGameID(ex)

            if (dataItem != undefined) {

            var colorclass = "red";
            var intScore = parseInt(dataItem.GameScore);
            if (intScore < 50) { colorclass = "red" }
            if (intScore > 49 && intScore < 75) { colorclass = "darkyellow" }
            if (intScore > 74 && intScore < 100) { colorclass = "yellow" }
            if (intScore == 100) { colorclass = "green" }

                $(item).parent().find(".exicon").append("<div data-ex='" + dataItem.GameID + "' data-name='" + dataItem.Nickname + "' data-time='" + dataItem.GameTime + "'  data-score='" + dataItem.GameScore + "'  data-gamemode='" + dataItem.GameMode + "'  class='circle-score " + colorclass + "' >" + dataItem.GameScore + "</div>")

            }
        })

        $(".exicon").kendoTooltip({
            filter: ".circle-score",
            position: "top",

            content: function (e) {
                var target = e.target;

                var score = "<div> Score: " + target.attr("data-score") + "%" + "</div>";
                var gTime = "<div> Time: " + getFormattedTime(target.attr("data-time")) + "</div>";
                var nickname = "<div style='white-space:nowrap;'> User: " + target.attr("data-name") + "</div>";
                var gmode = "<div style='white-space:nowrap;'> Game mode: " + GameModeName(target.attr("data-gamemode")) + "</div>";
                var pText = "<div class='score-popup' > " + score + gTime + nickname + gmode + "</div>"

                return pText
            },
        })


    }



}

var getFormattedTime = function (ms) {

    totalSeconds = Math.floor(ms / 1000);

    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    var dsec = Math.floor(ms / 100) % 10;
    var pad = "00";
    pad = pad.toString();
    seconds = seconds.toString();
    seconds = pad.substring(0, pad.length - seconds.length) + seconds;
    var dseconds = dsec.toString();
    //cseconds = pad.substring(0, pad.length - cseconds.length) + cseconds;

    var formattedTime = minutes + ":" + seconds + "." + dseconds;
    return formattedTime;
}



var getFriendlyFormattedTime = function (ms) {
    totalSeconds = Math.floor(ms / 1000);

    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    var dsec = Math.floor(ms / 100) % 10;
    if (minutes !== 0) {
        return minutes + " minutes and " + seconds + "." + dsec + " seconds";
    } else {

        return seconds + "." + dsec + " seconds";

    }
}

var paddedNumber = function (i) {
    if (i > 9) {
        return '' + i;
    } else {
        return '0' + i;
    }
}


