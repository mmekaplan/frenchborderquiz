var svgNS = "http://www.w3.org/2000/svg";
var n;
var svgImg;
var SVGDir = "SVG/"
var imgsDir = "/images/system/ex/"

var reviewMode = 0;
var canReview = 0;
var typingStarted = 0;
var fontsize;
var labelPadding;

var myAniTimeout;


var gameMode = "pin";
// var arrQuestions = [];
var questionCount;
var arrHints = [];
var currQuestion = "";
var currQ;
var radiusRatio;
var i5;

var hideRect;
var hideText;
var hideLabel;

var ordinal;
var qid;
var objQ;
var mouseX;
var mouseY;
var anim = false;

var guesses = 0;
var correctClicks = 0;
var wrongClicks = 0;
var totalClicks = 0;
var score;
var flasher;
var flasher2;
var isFlashing = false;
var flashTimeout;
var fadeTime = 50;
var gameTime;
var gameDuration;
var gMode;

var start;
var end;
var newTime;
var totalSeconds;
var scale = 1;
var isDragChecking = false;


var scalenum = 0;

var lastLeft = 0;
var lastTop = 0;

var scrollingDisabled = false;
var usingTouch = false;
var currentDragItem;
var currentHover;

var currAreaHover = '';

var dragX;
var dragY;

var hintPattern = ["*_", "_*_", "__*__", "________________________________________"];

var airplaneDirection;
var airplaneSpeed;
var airplaneTimer = null;

var bDoAnimate = 1;

function positionPopup() {
    var winH = $(window).height();
    var winW = $(window).width();
    $(".popup-overlay").css('top', winH / 2 - 700 / 2 + window.pageYOffset);
    $(".popup-overlay").css('left', winW / 2 - 800 / 2);
}

$(document).ready(function () {

    if (lang.substr(lang.length - 3) == "-sl") {
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/css/svgMapStyles2.css'));
        guessColors = ["#dddddd ", "#ffd970", "#e2b22d", "#bf4140"];
    } else {
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/css/svgMapStyles1.css'));
    }

    //set svg size to override native width/height values
    usingTouch = isTouchDevice();
    setupEventBinding();
    setGameMode();
    scaleSVG();

    if (isChallenge == true) {
        $(".top10-wrapper").css('background-color', '#fdf6e2');
        setTimeout(function () { if ($("#divDown").is(":visible") == true) { $("#divDown").trigger("click"); } }, 3000);

    }
    $(document).keyup(function (event) {
        if (event.keyCode == 82) { //r
            if (event.altKey) {
                $('#cmdRestart').click();
            }
        }
    }
    )

    $(document).keyup(function (event) {
        if (event.keyCode == 83) { //s
            if (event.altKey) {
                paintGroup(document.getElementById("AREA_FRANCE"), "#457788");

                var svgdiv = document.getElementById("svgDiv")
                var htmlContent = svgdiv.innerHTML;
                var canvas = document.createElement('canvas');
                canvas.setAttribute('id', 'canvas');
                canvas.width = svgdiv.getBoundingClientRect().width;
                canvas.height = svgdiv.getBoundingClientRect().height;
                document.body.appendChild(canvas);
                //rasterizeHTML.drawHTML(htmlContent, canvas);
            }
        }
    }
    )

    $(window).resize(function () {
        scaleSVG();
        positionPopup();
    });



    var pledges = parseInt($.cookie("pledges"))
    if (pledges >= 400) {
        $(".openPrintDialog").show()
        $(".openPrintDialog").on("click", function () {

            var h
            h = $("#svgDiv").html()
            $(".popup-overlay").show()
            h = h.replace("svgpoint", "svgpointprint")
            $("#popup-map").html(h);

            $(".popup-overlay, .popup-content").addClass("active");

            var origHeight = $("#svgpointprint").height();
            var origWidth = $("#svgpointprint").width();

            var aspectRatio = origWidth / origHeight;
            var newHeight = 500;
            var newWidth = newHeight * aspectRatio;
            $("#svgpointprint").attr("width", newWidth + "px");
            $("#svgpointprint").attr("height", newHeight + "px");
            $("#popup-map").css("left", (670 - newWidth) / 2)
            $("#popup-map").css("top", 0)

            makePrintable();

            positionPopup();
            return (false);
        });
    } else {
        $(".openPrintDialog").hide()
    }

    $(".printclose").on("click", function () {
        $(".popup-overlay, .popup-content").removeClass("active");

        $("#popup-map").html("");
        return (false);
    });


});

function isTouchDevice() {
    return 'ontouchstart' in window
        || 'onmsgesturechange' in window;
};


function moveGamePartList() {
    var svg = document.getElementById("svgpoint");
    var pnt = svg.getBBox();
    var p = $(".gamewindow:first");
    var position = p.position();
    if (p.width() > 500) {
        setTimeout(function () {
            $(".gamelist").css({
                "position": "absolute",
                top: p.position().top - 80,
                left: p.position().left + 100,
                width: p.width() - 180,
                "z-index": 9999,
                backgroundColor: "white",
                padding: "10px",
                opacity: 0.8,
                "font-size": "21px",
                border: "1px solid gray",
                "border-radius": "10px"

            })
        }, 1000)
    }


}

function initGame() {
    anim = detectAnimation()
    scaleSVG()
    console.log("init")
    updateReviewLink();
    disableReviewLink();
    hidePromptInputForm();
    $(".gamepartlist").show();
    clearHints();
    $(".showafter").css({ opacity: '' });

    $('#INFOTEXT').css({ opacity: "0.001" })


    if (lang.substr(lang.length - 3) == "-sl") {
        fontsize = 20
        labelPadding = 18
    } else {
        fontsize = 12
        labelPadding = 8
    }
    if (reviewMode == 0) {
        clearCorrect();
    } else {
        var data = {};
        data.GameID = gameID;
        data.UserID = '-';
        data.EventID = 'Review'

        //$.ajax({
        //    type: 'POST',
        //    contentType: "application/json; charset=utf-8",
        //    url: '/services/services.aspx/InsertGameEvent',
        //    data: JSON.stringify(data),
        //    async: false,
        //    success: function (response) {
        //        //console.log(response)
        //    },
        //    error: function (error) {
        //        console.log("error");
        //    }

        //})
    }
    objCountry = jQuery.grep(objCountry2, function (n) { return (n.quiz == 1 && n.correct == 0) });

    questionCount = objCountry.length;
    if (questionCount == 0) { moveGamePartList(); }
    q = "";

    guesses = 0;
    correctClicks = 0;
    wrongClicks = 0;
    totalClicks = 0;
    currQuestion = "";
    typingStarted = 0;
    clearScore();
    hideExtraInfo();
    $(".city3").remove();
    $(".city2").remove();


    if (gameMode != 'prompt2') {
        $("#dlstgamelist").show();
    }




    $("#currQuestion").html("");

    if (gameMode.substr(0, 8) == "dragDrop") {
        if (gameMode == 'dragDrop') { $("#currQuestion").html("| " + dragDropText1) } else { $("#currQuestion").html("| " + dragDropTextFlags1) }
        $("#imgQuestionFlag").hide();
    }



    if (gameMode == "prompt") {
        $("#currQuestion").html("| " + inputLabel);
        $("#imgQuestionFlag").show();

    }

    if (gameMode == "prompt2") {
        $("#imgQuestionFlag").hide();
        updateScore();
        var i
        for (i = 0; i < objCountry.length; i++) {
            objCountry[i].cleanText = cleanUpSpecialChars(objCountry[i].qText)
        }

    }

    if (showInfoText == 0) {
        $("#divExtraInfo").hide();
        $("#divExtraInfo").height(0);
    }


    if (gameMode == "video") {
        $("#currQuestion").html("");
        $("#imgQuestionFlag").hide();
        $("#HUDWrapper").hide();
        $("#divExtraInfo").hide();
        $('#timer').hide;
        $("#HUD").hide();
    }


    stopTimer();
    stopFlashing();
    setupCompletion();


    clearLabels();


    svgImg = document.getElementById("svgDiv")

    formatInfoText();

    initMap(svgImg);
    n = svgImg.getElementsByTagName("g");
    initGroups(n);

    objEventBinding();

    var svgtop;

    svgtop = $("svg").offset().top - 20;

    //get exercise values

    if (gameMode == '-') { gameMode = 'learn' };
    if (gameMode != 'learn' && gameMode != 'wikipedia' && gameMode != 'show') {
        $("#HUDGroup").show();
        if (objCountry.length > 0) startTimer();
    } else {
        $("#HUDGroup").hide();

    }
    if (objCountry.length == 0) $("#HUDGroup").hide();
    var i = 0;
    var strJSON = '';
    var e;
    var p;
    var posX;
    var posY;

    //if (($.cookie("memberId") == null || $.cookie("memberId") == '') == false) {
    //    var data = {};
    //    data.GameID = exID;
    //    data.UserID = $.cookie("memberId");
    //    data.EventID = 'Start'

    //    $.ajax({
    //        type: 'POST',
    //        contentType: "application/json; charset=utf-8",
    //        url: '/services/services.aspx/InsertGameEvent',
    //        data: JSON.stringify(data),
    //        async: false,
    //        success: function (response) {
    //            //console.log(response)
    //        },
    //        error: function (error) {
    //            console.log("error");
    //        }

    //    })

    //}

}

function updateReviewLink() {
    var obj1, obj2

    if (lang == "en" || lang == "sv" || lang.substr(lang.length - 3) == "-sl" || lang == "sv-an" || lang == "en-an" || lang == "de-an" || lang == "de" || lang == "ja" || lang == "hu" || lang == "da" || lang == "uk" || lang == "fr" || lang == "nb" || lang == "pl" || lang == "nl" || lang == "fi" || lang == "ru" || lang == "ro" || lang == "tr") {
        obj1 = jQuery.grep(objCountry2, function (n) { return (n.quiz == 1 && n.correct == 0) });
        obj2 = jQuery.grep(objCountry2, function (n) { return (n.quiz == 1) });
        if (obj1.length > 0 && obj1.length != obj2.length) {
            enableReviewlink();
        } else {

            disableReviewLink();
        }
    } else {
        $("#lnkReview").hide();
    }
}

function enableReviewlink() {
    //console.log("enable review");
    document.getElementById("lnkReview").style.pointerEvents = "default";
    document.getElementById("lnkReview").style.cursor = "pointer";
    document.getElementById("lnkReview").style.opacity = "1";
    canReview = 1;
}

function disableReviewLink() {
    //console.log("disable review");
    document.getElementById("lnkReview").style.pointerEvents = "auto";
    document.getElementById("lnkReview").style.cursor = "default";
    document.getElementById("lnkReview").style.opacity = "0.3";
    canReview = 0;
}

function setCorrect(id) {
    //console.log("SetCorrect " + id)
    var i
    for (i = 0; i < objCountry2.length; i++) {
        if (objCountry2[i].id == id) {
            objCountry2[i].correct = 1;
        }
    }
}

function clearCorrect(id) {
    //console.log("SetCorrect " + id)
    var i
    for (i = 0; i < objCountry2.length; i++) {
        objCountry2[i].correct = 0;
    }
}

function setReviewMode(mode) {
    reviewMode = mode;
}

function clearHints() {
    arrHints = [];
    $("#hints").empty();
    // JSON for Scratch goes here. Do not delete.
    //for (i = 0 ; i < objCountry.length; i++) {
    //    e = document.getElementById(objCountry[i].id);
    //    p = getCenterpoint(e);
    //    posX = Math.round(p.x / 900 * 480 - 240);
    //    posY = -1 * Math.round((p.y + 38) / 725 * 360 - 180) 
    //    strJSON = strJSON + '["call", "NyttLand %n %n %s", ' + posX + ', ' + posY + ', "' + objCountry[i].qText + '"]';
    //    if (i + 1 < objCountry.length) {
    //        strJSON=strJSON + ',\n'
    //    } else {
    //        strJSON = strJSON + ']],\n'
    //    }

    //}

    //console.log(strJSON);

}


function clearLabels() {

    $(".svgLabelText").remove();
    $(".labelBkgrd").remove();
    $(".labelBkgrd2").remove();
    $(".infoLink").remove();
    $(".dragItem").remove();
    $(".label").remove();
    $(".qImgWrapper").remove();
    $(".flagImage").remove();
    $(".flagRect").remove();


}

function scaleSVG() {
    var origHeight = $("#svgpoint").height();
    var origWidth = $("#svgpoint").width();

    var aspectRatio = origWidth / origHeight;
    var newWidth = $(".gamewindow").width();
    var newHeight = newWidth / aspectRatio;

    $("#svgpoint").attr("width", newWidth + "px");
    $("#svgpoint").attr("height", newHeight + "px");
    $(".svgdiv").attr("width", newWidth + "px");
    $(".svgdiv").attr("height", newHeight + "px");
    scale = newWidth / origWidth;
    scalenum++;
}


function setupEventBinding() {
    $("input[name='gameMode']").change(function () { setGameMode() });

    $('#cbSoundOn').prop('checked', (typeof sessionStorage.cbSoundOn !== 'undefined') ? (sessionStorage.cbSoundOn == 'true') : true);
    //when checkbox is updated, update stored value
    $('#cbSoundOn').change(function () { sessionStorage.cbSoundOn = $(this).prop('checked'); });

    //when checkbox is updated, update stored value
    $('#cbVoice').change(function () { sessionStorage.cbVoice = $(this).prop('checked'); playLocation(lang, q) });

    // $(window).resize(function () { scaleSVG() })
    $(window).resize(function () {
        formatInfoText();


    })


}





function objEventBinding() {

    //console.log("event binding begun " + gameMode);
    $(".q").removeAttr("onclick");
    $(".noq").removeAttr("onclick");
    $(".q").off("click");
    $(".q").attr("data-toggle", "0")
    $("body").unbind("keyup");
    $("body").unbind("keypress");


    if (gameMode == "wikipedia") {
        $(".q").attr("onclick", "playLocation(lang,this.id);window.open(this.getAttribute('data-wikipediaLink'), '_blank');showInfoText2(this);return false;");
        $(".q").attr("onmouseover", "showLabel(this,false , '#FFFFFF', true, false);");
        $(".q").attr("onmouseout", "$('#RECT_' + this.id).remove(); $('#TEXT_' + this.id).remove();hideLines(this)");
        $(this)


        //$(".q").contextmenu(function () {
        //    return false;
        //})

    } else {

        $(".q").prop("onclick", null);
        $(".q").prop("onmouseover", null);
        $(".q").prop("onmouseout", null);


        $(".q").contextmenu(function () {
            return true;
        })
    }

    if (gameMode == "learn" || gameMode == "airPlane") {
        $(".q").attr("onclick", "learn(this)");
    }

    if (gameMode == "show") {
        if (true) { //showall 
            $(".q").attr("onclick", "showLabelToggle2(this,false, '#FFFFFF', true, false);playLocation(lang,this.id,this.getAttribute('data-sayAfter'));showInfoText2(this);");
            $(".semitransparent").attr("fill-opacity", semitransparentOpacity);

            $(".semitransparent").attr("fill", semitransparentColor);
            for (var i = objCountry.length - 1; i >= 0; i--) {
                if (document.getElementById(objCountry[i].id) === null) { console.log(objCountry[i].id) };
                showLabel(document.getElementById(objCountry[i].id), false, '#ffffff', true, false); //MW
            }
        } else {
            $(".showafter").css({ opacity: 1 });
            $(".q").attr("onclick", "showLabelToggle2(this,false, '#FFFFFF', true, true);playLocation(lang,this.id,this.getAttribute('data-sayAfter'));showInfoText2(this);");
            $(".semitransparent").attr("fill-opacity", semitransparentOpacity);
            $(".semitransparent").attr("fill", semitransparentColor);
            for (var i = objCountry.length - 1; i >= 0; i--) {
                addSVGAttribute(document.getElementById(objCountry[i].id), "answered");
                if (document.getElementById(objCountry[i].id) === null) { console.log(objCountry[i].id) };
                showLabel(document.getElementById(objCountry[i].id), false, '#259853', true, true); //MW
                //paintGroup(document.getElementById(objCountry[i].id), "#f4f4f4")
            }
        }
    }


    if (gameMode == 'pinhard') {
        $(".noq").attr("onclick", "checkQuestion(this, evt)");
    }

    if (gameMode == 'pin' || gameMode == 'pinhard') {
        $(".q").attr("onclick", "checkQuestion(this, evt)");

        objCountry = shuffle(objCountry);
        if (objCountry.length > 0) nextQuestion();
    }


    if (gameMode == "prompt") {
        objCountry = shuffle(objCountry);
        showPromptInputForm();
        setTimeout(function () { nextPrompt(); }, 50);


        $("body").keypress(function (e) {

            //console.log(e.which);
            if (e.which == 13) {
                checkPromptAnswer();
                e.preventDefault();
            }

        });
    }

    if (gameMode == "prompt2") {
        showPrompt2InputForm();
        $("#dlstgamelist").hide();

        $("body").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
            }

        });
        $("body").unbind("keyup");
        $("body").keyup(function (e) {
            if (typingStarted == 0) { stopTimer(); startTimer(); typingStarted = 1 }

            checkPrompt2Answer();

        });
    }

    if (gameMode == "video") {
        i5 = 0;
        $("#lblVideo").text(exName);
        $("#lblVideo").hide();
        $("#lblVideo").css("top", "400px");
        $("#lblVideo").css("font-size", "20px");
        $("#lblVideo").css("opacity", "0.01")
        $("#lblVideo").show();

        setTimeout(function () {
            $("#lblVideo").animate({
                "font-size": "40px", "opacity": "1"
            }, 3000);
            videoLoop();
        }, 1000);
        setTimeout(function () {
            $("#imgVideo").fadeOut(500);
            $("#lblVideo").animate({
                top: "5px",
                "font-size": "20px"
            }, 1500);
            $("#HUDWrapper").fadeIn(1500);


        }, 4500);
        setTimeout(function () {
            $("#lblVideo").css("color", "black")
        }, 6000)
    } else {
        $("#lblVideo").hide();
    }


    if (gameMode.substring(0, 8) == "dragDrop") {

        //objCountry = shuffle(objCountry);
        createDragLabels();

        $(".dragItem").on("click", function () {
            bDoAnimate = 1;

            clearTimeout(hideRect);
            clearTimeout(hideText);

            $("#RECT_INFO").remove();
            $("#TEXT_INFO").remove();

            $(".dragItem").removeClass("clickedLabel");
            $(this).addClass("clickedLabel");
            if (isFlashing == true) {
                stopFlashing();
                paintGroup(document.getElementById(q), "#006633");
            }

            q = $(this).attr("id");

            q = q.replace("LABEL_", "");
            if (gameMode == "dragDrop") {
                playLocation(lang, q);
            }

            for (var i = objCountry2.length - 1; i >= 0; i--) {
                if (objCountry2[i].id == q) {
                    if (gameMode == 'dragDrop') {
                        $('#currQuestion').html(" | " + clickOnText + ' ' + objCountry2[i].qText);
                    } else {
                        $('#currQuestion').html(" | " + clickOnText + " <img style='height:20px' src='/images/system/flags/" + objCountry2[i].infoImgURL + "'>");
                    }
                }
            }

        });

        $(".q").attr("onclick", "checkDragQuestion(this, evt)");
    }

    if (gameMode == "airPlane") {
        startAirplane();


    }

    if (gameMode == "dragDropFlags") {

        $("body").keypress(function (e) {
            console.log(e.which)
            //console.log(e.which);
            if (e.which == 102 && location.hostname === "localhost" ) {
                for (var i = objCountry.length - 1; i >= 0; i--) {

                    len = getTextLength(document.getElementById(objCountry[i].id));

                    console.log(objCountry[i].id)
                    console.log(len)

                    if (document.getElementById(objCountry[i].id) === null) { console.log(objCountry[i].id) };
                    showLabel(document.getElementById(objCountry[i].id), false, '#ffffff', true, false); //MW

                    if (len<=5) {
                        $("#FLAG_" + objCountry[i].id).fadeOut(2000);
                        $("#FLAGRECT_" + objCountry[i].id).fadeOut(2000);

                    }
                }
            }

        });

    }


    //console.log("event binding complete");
}

var airplaneRotation = 0;

function learn(x) {
    showLabel(x, 8000, '#FFFFFF', false, false);
    playLocation(lang, x.id, x.getAttribute('data-sayAfter'));
    showInfoText2(x);
    //if (showInfoImageTop == 1) {
    //    $('#imgQuestionFlag').show();
    //    $('#imgQuestionFlag').attr('src', '/images/system/flags/' + x.getAttribute('data-infoImgURL'));
    //}
}

function startAirplane() {

    console.log("TOP: " + $("#gameselect").offset().top)
    $('body').prepend('<img id="imgAirplane" src="/images/system/airplane.png" style="width:25px;height:25px"/>')
    var width1 = parseInt($("#svgpoint").css("width"));
    var width2 = parseInt($("#imgAirplane").css("width"));
    var left = Math.round((width1 - width2) / 2) + $("#svgpoint").offset().left;
    $("#imgAirplane").css("left", left)

    var height1 = parseInt($("#svgpoint").css("height"));
    var height2 = parseInt($("#imgAirplane").css("height"));
    var top = Math.round((height1 - height2) / 2) + $("#svgpoint").offset().top;
    $("#imgAirplane").css("top", top)

    var startLeft = left
    var startTop = top;

    airplaneDirection = 0;
    airplaneSpeed = 2;

    if (airplaneTimer != null) { clearInterval(airplaneTimer); airplaneTimer = null }

    airplaneTimer = setInterval(function () {
        var deltaX = airplaneSpeed * Math.cos(toRadians(airplaneDirection))
        var deltaY = airplaneSpeed * Math.sin(toRadians(airplaneDirection))
        left = left + deltaX;
        top = top + deltaY;
        $("#imgAirplane").css("left", parseInt(left))
        $("#imgAirplane").css("top", parseInt(top))
        var rotate = Math.round(airplaneDirection + 90).toString() + 'deg'
        if (airplaneRotation > 360) { airplaneRotation = airplaneRotation - 360 }
        $("#imgAirplane").css({ 'transform': 'rotate(' + rotate + ')' });
        airplaneDirection = airplaneDirection + airplaneRotation;
        $("#score").html(airplaneDirection + "|" + deltaX + "|" + deltaY);


        if (parseInt($("#imgAirplane").css("left")) < 0 || $("#imgAirplane").css("left") > 1200 || $("#imgAirplane").css("top") < 0 || $("#imgAirplane").css("top") > 2000) {
            $("#imgAirplane").css("left", startLeft)
            $("#imgAirplane").css("top", startTop)
            airplaneDirection = 0;
            airplaneSpeed = 2;
        }

    }, 25);


    $(document).keydown(function (e) {
        if (e.keyCode == 39) {
            if (airplaneRotation == 0) { airplaneRotation = 3 } else {
                airplaneRotation = airplaneRotation + 0.5;
            }
            return false
        }

        if (e.keyCode == 37) {
            if (airplaneRotation == 0) { airplaneRotation = - 3 } else {
                airplaneRotation = airplaneRotation - 0.5;
            }
            return false
        }

        if (e.keyCode == 38) {
            if (airplaneSpeed == 2) airplaneSpeed = 5;
            if (airplaneSpeed == 5) airplaneSpeed = 10;
            return false
        }

        if (e.keyCode == 40) {
            airplaneSpeed = 2;
            if (airplaneSpeed < 0) { airplaneSpeed = 0 }
            return false
        }

        if (e.keyCode == 72) {
            'h'
            left = startLeft;
            top = startTop;
            airplaneSpeed = 2;
        }

    });

    $(document).keyup(function (e) {
        if (e.keyCode == 37) {
            airplaneRotation = 0;
            return false
        }

        if (e.keyCode == 39) {
            airplaneRotation = 0;
            return false
        }

    });



}


function toRadians(angle) {
    return angle * (Math.PI / 180);
}


function moveAirplane() {

}

function videoLoop() {           //  create a loop function
    setTimeout(function () {
        var objArea;
        //console.log(1000 * i5);
        if (i5 > 0 && i5 < objCountry.length + 1) {
            unPaintGroup(document.getElementById(objCountry[i5 - 1].id));
            var currG = document.getElementById(objCountry[i5 - 1].id);
            $(currG).find(".city").attr("r", "7");
        }
        if (i5 < objCountry.length) {
            playCorrectAnswerSound(1);
            paintGroup(document.getElementById(objCountry[i5].id), "#ffffff");
            var currG = document.getElementById(objCountry[i5].id);
            $(currG).find(".city").attr("r", "9");
        }
        setTimeout(function () {
            if (i5 < objCountry.length + 1) {
                playLocation(lang, objCountry[i5 - 1].id);
            }
        }, 2000);

        setTimeout(function () {
            if (i5 < objCountry.length + 1) {
                objArea = document.getElementById(objCountry[i5 - 1].id);
                showLabel(objArea, 6000, "#eeeeee", false, false, false);
            }
        }, 2200);
        //  increment the counter
        if (i5 < (objCountry.length)) {            //  if the counter < 10, call the loop function
            videoLoop();             //  ..  again which will trigger another 
        } else {


            setTimeout(function () {
                $("#lblVideo").hide();
                $("#lblVideo").css("top", "400px");
                $("#lblVideo").css("font-size", "10px");
                $("#lblVideo").css("opacity", "0.01")
                $("#lblVideo").show();
                $("#lblVideo").animate({
                    "font-size": "35px", "opacity": "1"
                }, 2000);

                $("#HUDWrapper").hide();
                $("#lblVideo").text("online.seterra.com/" + lang);
                //console.log("www.seterra.com");

                $("#imgVideo").fadeIn(1500);

                $("#lblVideo").css("color", "white");
            }, 2000

            )
        }                        //  ..  setTimeout()
        i5++;
    }, 4000)
}

function formatInfoText() {
    var infotext = document.getElementById("INFOTEXT");
    if (infotext != null) {
        var rect = infotext.getBoundingClientRect();
        var svg = document.getElementById("svgpoint");
        var x = rect.left + window.pageXOffset;
        var y = rect.top + window.pageYOffset;
        $('#divExtraInfo').css({
            top: y + "px",
            left: x + "px",
            width: rect.width,
            height: rect.height,
            opacity: 0.85

        });

        $('#divExtraInfo').addClass("divExtraInfoFloat")

        var itext = $('#divExtraInfo').html();
        //console.log(itext + "ITEXT");
        if (itext.length < 2) {
            $('#divExtraInfo').css({
                opacity: 0.1
            })
        }

        if (lang != 'en' && lang != 'en-an') {
            $('#divExtraInfo').css({
                opacity: 0.01
            })
        }

    }
}


function hoverdiv() {

    var div2 = document.getElementById("imgZoom")
    var pos
    pos = div2.getBoundingClientRect();
    $("#divFlagZoom").css({ left: (Math.round(pos.left + 40)) + "px" });

    $("#divFlagZoom").css({ top: Math.round(window.scrollY + pos.top - 60) + "px" });
    $("#divFlagZoom").toggle();
    return false;
}

function showInfoText2(s) {
    var str;


    if (s.getAttribute("data-infoImgURL") != "") {
        str = "<img id ='imgZoom'  src='/images/system/flags/" + s.getAttribute("data-infoImgURL") + "' style='float:left;height:17px;border:1px solid #dddddd' onmouseover=\"hoverdiv()\" onmouseout=\"hoverdiv()\">" + ' &nbsp; '
        $("#divFlagZoom").html("<img src='/images/system/flags/" + s.getAttribute("data-infoImgURL") + "'>")

    }
    else { str = "" };
    $("#divExtraInfo").html(str + s.getAttribute('data-infoText'));

    formatInfoText();



}

function hideExtraInfo() {
    $("#divExtraInfo").html("");
}

function logmouseover(id) {


}

function createDragLabels() {
    if (gameMode == 'dragDropFlags') { objCountry = shuffle(objCountry); }

    if (usingTouch == true) {
        if (gameMode == 'dragDrop') {
            for (var i = objCountry.length - 1; i >= 0; i--) {
                $("#dragLabels").prepend("<div id='LABEL_" + objCountry[i].id + "' class='dragItem' data-errors='0' ><div class='dragHandle'>" + HTMLClean(objCountry[i].qText) + "<div class='dragInnerHandle' ></div></div></div>")
            }
        }

        if (gameMode == 'dragDropFlags') {
            for (var i = objCountry.length - 1; i >= 0; i--) {
                $("#dragLabels").prepend("<div id='LABEL_" + objCountry[i].id + "' class='dragItem' data-errors='0' style='height:36px;'><div class='dragHandle'><img id='IMG_" + objCountry[i].id + "' src='/images/system/flags/" + HTMLClean(objCountry[i].infoImgURL) + "' style='height:30px;margin-left:auto;margin-right:auto;display:block'><div class='dragInnerHandle' ></div></div></div>")
            }
        }

    } else {
        if (gameMode == 'dragDrop') {
            for (var i = objCountry.length - 1; i >= 0; i--) {
                $("#dragLabels").prepend("<div id='LABEL_" + objCountry[i].id + "' class='dragItem' data-errors='0'  ><div class='dragHandle'> " + HTMLClean(objCountry[i].qText) + "</div></div>")
            }
        }
        if (gameMode == 'dragDropFlags') {
            for (var i = objCountry.length - 1; i >= 0; i--) {
                $("#dragLabels").prepend("<div id='LABEL_" + objCountry[i].id + "' class='dragItem' data-errors='0' style='height:32px;'  ><div class='dragHandle' ><img id='IMG_" + objCountry[i].id + "' src='/images/system/flags/" + HTMLClean(objCountry[i].infoImgURL) + "' style='height:26px;margin-left:auto;margin-right:auto;display:block'></div></div>")
            }
        }
    }
    $(".gamepartlist").hide();
}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function nextQuestion() {

    // objCountry = shuffle(objCountry);
    objQ = objCountry[0];
    q = objQ.id;
    qText = objQ.qText;

    if (gameMode == 'pinhard') {
        qText = qText + " (" + (questionCount - objCountry.length + 1) + "/" + questionCount + ")"
    }
    qImg = objQ.qImgURL;


    if (lastLeft == 0) {
        lastLeft = window.innerWidth / 2;
        lastTop = window.innerHeight / 2;
    }

    makeQuizLabel(showInfoImageTop, qText, objQ.infoImgURL);

    if (gameMode == 'pin' || gameMode == 'pinhard') { currQuestion = clickOnText + ' ' + qText; } else { currQuestion = '' };
    $('#currQuestion').html(" | " + currQuestion);
    if (window.location.href.indexOf("shownext=1") != -1) {
        if (objCountry.length > 1) {
            $('#currQuestion').html($('#currQuestion').html() + " | " + objCountry[1].qText);
        }
    }

    if (showInfoImageTop == 1 && (gameMode == 'pin' || gameMode == 'pinhard') && objQ.infoImgURL != "") {
        $("#imgQuestionFlag").show();
        $("#imgQuestionFlag").attr("src", "/images/system/flags/" + objQ.infoImgURL);
    } else {
        $("#imgQuestionFlag").hide();
    }


    $(".qLabel").remove();

    playLocation(lang, objQ.id);
    setTimeout("formatInfoText()", 500);

    bDoAnimate = 1;

}


function nextPrompt() {


    $("#inpCountry").val("");
    $("#inpCountry").css("color", "#000000");
    $("#hints").empty();

    var objArea = document.getElementById(objCountry[0].id);
    objArea.setAttribute("class", "q");

    if (currQ != undefined) {
        if (objCountry.length > 1) {
            do {
                objCountry = shuffle(objCountry);
            } while (objCountry[0].id == currQ.id)
        }
    }
    objQ = objCountry[0];

    $("#imgQuestionFlag").hide();


    q = objQ.id;
    qText = objQ.qText;

    var objArea = document.getElementById(objQ.id);

    if (lang.substr(lang.length - 3) != "-sl") {
        objArea.setAttribute("class", "q prompted");
    }

    arrHints = [];
    $("#hints").hide();
    if (objQ.hints && objQ.hints != "") {
        arrHints = objQ.hints.split(",");
    }

    var elemCountry = $("#" + objQ.id);
    var hintIdx = elemCountry.attr("hint-index") - 1;

    if (arrHints.length > 0) {

        $("#hints").append('<ul></ul>');

        if (hintIdx > -1) {
            $("#hints").show();
            for (var i = 0; i <= hintIdx; i++) {
                if (i < arrHints.length) {
                    $("#hints ul").append('<li><div class="hint" >' + arrHints[i] + '</div></li>')
                }
            }
        }

    } else {
        $("#hints").empty();
        // get hint from hint pattern
        if (hintIdx > -1) {
            getHintFromPattern(hintIdx, objQ.qText);

            $("#hints").append("HINT: " + getHintFromPattern(hintIdx, objQ.qText));
            $("#hints").show();

        }
    }

    showThisPrompt(q, false, "#eeeeee", true);
    $("#inpCountry").focus();
}




function skipQuestion() {
    currQ = objQ;

    var lines = document.getElementById(currQ.id).getElementsByTagName("line");
    if (lines.length > 0) {
        lines[lines.length - 1].setAttribute("opacity", "0");
    }

    var errors = $("#" + currQ.id).attr("data-errors");
    var objArea = document.getElementById(objQ.id);
    objArea.setAttribute("class", "q");
    if (!errors || errors == 0) {


    } else {

        if (errors < 3) {
            paintGroup(objArea, guessColors[errors]);

        } else {
            paintGroup(objArea, guessColors[3]);
        }
    }

    nextPrompt();
}

function repaintGroup(g) {
    var errors;
    var errors = $(g).attr("data-errors");
    if (errors < 3) {
        paintGroup(g, guessColors[errors]);

    } else {
        paintGroup(g, guessColors[3]);
    }

    if (g.querySelectorAll(".city").length != 0 || g.querySelectorAll(".city1").length != 0) showLabel(g, false, labelColors[Math.min(g.getAttribute("data-errors"), 3)], false, false, false);

}

function getHint() {

    $("#hints").show();
    var elemCountry = $("#" + objQ.id);
    var hintIdx = elemCountry.attr("hint-index") ? elemCountry.attr("hint-index") : 0;

    if (arrHints.length > 0) {
        $("#hints").empty();
        $("#hints").append('<ul></ul>');
        for (var i = 0; i <= hintIdx; i++) {
            if (i < arrHints.length) {
                $("#hints ul").append('<li><div class="hint" >' + arrHints[i] + '</div></li>')
            }
        }
        hintIdx++;
        elemCountry.attr("hint-index", hintIdx);
        totalClicks++;

        var wClicks = elemCountry.attr("data-errors") ? elemCountry.attr("data-errors") : 0;

        elemCountry.attr("data-errors", parseInt(wClicks) + 1);
        updateScore();
    } else {

        if (hintPattern.length > hintIdx) {
            $("#hints").empty();
            $("#hints").append(hintLabel + ": " + getHintFromPattern(hintIdx, objQ.qText));
            hintIdx++;
            elemCountry.attr("hint-index", hintIdx);

            totalClicks++;

            var wClicks = elemCountry.attr("data-errors") ? elemCountry.attr("data-errors") : 0;

            elemCountry.attr("data-errors", parseInt(wClicks) + 1);
            updateScore();
        }
    }

    $("#inpCountry").focus();

}


function getHintFromPattern(idx, text) {

    var pattern = hintPattern[idx];
    var leading = pattern.substring(0, pattern.indexOf("*"))
    var leadingExposed = leading.length;

    var trailing = pattern.substring(pattern.indexOf("*") + 1, pattern.length)
    var trailingExposed = trailing.length;

    leadIdx = leadingExposed - 1;
    trailIdx = text.length - trailingExposed;

    var arrText = text.split("");
    for (var i = 0; i < text.length; i++) {

        if (i > leadIdx && i < trailIdx) {
            arrText[i] = "*";
        }

    }

    var hint = arrText.join("");

    return hint;
}

function handleArrowKeys(e) {
    var event = window.event || e;
    if (event.ctrlKey == true) {
        if (event.keyCode == 39) {
            $("#promptInputForm").css('left', parseInt($("#promptInputForm").css('left')) + 100);

        }
        if (event.keyCode == 37) {
            $("#promptInputForm").css('left', parseInt($("#promptInputForm").css('left')) - 100);

        }
    }
    if (event.altKey == true) {

        if (event.keyCode == 72) { //h
            event.preventDefault();
            getHint();
        }

        if (event.keyCode == 83) { //s
            event.preventDefault();
            skipQuestion();
        }
    }

    if (event.keyCode == 38) {
        $("#promptInputForm").css('top', parseInt($("#promptInputForm").css('top')) - 100);

    }
    if (event.keyCode == 40) {
        $("#promptInputForm").css('top', parseInt($("#promptInputForm").css('top')) + 100);

    }

}


function showPromptInputForm() {

    if ($(".prompt-input-form").length == 0) {

        // if (inputLabel == "") { inputLabel = "Country" };

        var formHtml = '<div id="promptInputForm" class="prompt-input-form"><input type="text" id="inpCountry" /><input id="btnSubmitAnswer" type="button" value="Submit Answer"  onclick="checkPromptAnswer()" /><input id="btnSkip" type="button" value="Skip"  onclick="skipQuestion()" /><input type="button" id="btnHint" value="Give me a hint!" onclick="getHint()"/><div id="hints" ></div></div>';
        $("body").append(formHtml)

        $('#inpCountry').on('keyup', function (event) { handleArrowKeys(event) })
        setTimeout(function () {

            $("#btnSubmitAnswer").attr("value", submitValue);
            $("#btnSkip").attr("value", skipValue);
            $("#btnHint").attr("value", hintValue);
        }, 0);
    } else {
        $(".prompt-input-form").show();
    }

}

function showPrompt2InputForm() {

    if ($(".prompt2-input-form").length == 0) {

        var formHtml = '<span id="prompt2InputForm" class="prompt2-input-form"><span id="prompt2prompt">' + enterLocation + ': </span><input type="text" id="inpC2" /><input id="btnGiveUp" type="button" value="' + giveUp + '"  onclick="prompt2GiveUp()" /></span>';
        $(formHtml).insertAfter("#HUDGroup")

    } else {
        $(".prompt2-input-form").show();
        $("#inpC2").val("");
    }
    $("#inpC2").focus();

}
function hidePromptInputForm() {
    if ($(".prompt-input-form").length != 0) {
        $(".prompt-input-form").hide();
    }

    if ($(".prompt2-input-form").length != 0) {
        $(".prompt2-input-form").hide();
    }
}


function checkPromptAnswer() {

    var guess = $("#inpCountry").val().toLowerCase();

    if (guess != "" && objCountry.length > 0) {
        var thisCountry = objQ.qText.toLowerCase();
        var elemCountry = $("#" + objQ.id);
        var objArea = document.getElementById(objQ.id)

        wrongClicks = elemCountry.attr("data-errors") ? elemCountry.attr("data-errors") : 0;

        if (cleanUpSpecialChars(guess) == cleanUpSpecialChars(thisCountry)) {

            animateCircle($("#promptInputForm").position().left + 65, $("#promptInputForm").position().top - 50, "#anicircle")


            playLocation(lang, objQ.id, objArea.getAttribute('data-sayAfter'));

            if (wrongClicks == 0) setCorrect(objQ.id)

            thisCountry = '';
            $("#inpCountry").css("color", "#669933")

            if (showInfoText == 1) {
                showInfoText2(objArea);
            };

            $(".qImgWrapper").remove();
            correctClicks++;
            totalClicks++;

            var removeIndex;
            removeIndex = -1;
            $.grep(objCountry, function (n, idx) {

                if (n.id == objQ.id) {
                    removeIndex = idx;
                }
            })
            if (removeIndex != -1) objCountry.splice(removeIndex, 1);

            objArea.setAttribute("class", "q answered");

            paintGroup(objArea, guessColors[Math.min(wrongClicks, 3)]);

            if (objArea.querySelectorAll(".city,.city1").length > 0) {
                if (showLabels == 1) { showLabel(objArea, false, labelColors[Math.min(wrongClicks, 3)], false, true) } else { showLabel(objArea, 3000, labelColors[Math.min(wrongClicks, 3)], false, false) };

                showDot(objArea);

            } else {
                if (keepAreaLabels == 1) { showLabel(objArea, false, labelColors[Math.min(wrongClicks, 3)], false, true); } else { showLabel(objArea, 3000, labelColors[Math.min(wrongClicks, 3)], false, false); }

            }


            if (objCountry.length > 0) {

                playCorrectAnswerSound(1);
                setTimeout(function () { nextPrompt(); }, 50);
            } else {
                playCorrectAnswerSound(1);
                if (totalClicks == correctClicks) {
                    playCorrectAnswerSound(3);
                } else {
                    playCorrectAnswerSound(2);

                }
                hidePromptInputForm();
                // game over
                $('#currQuestion').html(" ");
                $("#imgQuestionFlag").hide();
                stopTimer();
                updateScore();
                setupCompletion();
                showCompletion();

                q = "";
            }


        } else {
            $("#inpCountry").css("color", "#990000");
            totalClicks++;
            wrongClicks++;

            playWrongAnswerSound();

            if (wrongClicks < 3) {
                paintGroup(objArea, guessColors[wrongClicks]);

            } else {

                paintGroup(objArea, guessColors[3]);
            }

        }
        elemCountry.attr("data-errors", wrongClicks);
        updateScore();

    }
    $("#inpCountry").focus();
}

function checkPrompt2Answer() {

    var guess = $("#inpC2").val().toLowerCase();
    var cleanGuess = cleanUpSpecialChars(guess)

    var i
    var e
    for (i = 0; i < objCountry.length; i++) {
        if (cleanGuess.length < objCountry[i].cleanText.length + 4) {
            if (cleanGuess.substring(0, objCountry[i].cleanText.length) == objCountry[i].cleanText) {
                correctClicks++;
                totalClicks++;
                $("#inpC2").val(cleanGuess.substring(objCountry[i].cleanText.length, cleanGuess.length))
                e = document.getElementById(objCountry[i].id)
                paintGroup(e, "#114c29");
                if (e.querySelectorAll(".city, .city1").length > 0) {
                    showDot(e);
                }

                //-------
                var svg = document.getElementById("svgpoint");
                var p = getCenterpoint(e);
                var pnt = svg.createSVGPoint();
                pnt.x = p.x;
                pnt.y = p.y;

                var ctm = svg.getScreenCTM();
                var ipnt = pnt.matrixTransform(ctm);

                var aniX = ipnt.x + window.pageXOffset;
                var aniY = ipnt.y + window.pageYOffset;
                animateCircle(aniX, aniY, "#anicircle");
                //-------f

                var cid = objCountry[i].id
                playLocation(lang, cid);


                $("#inpC2").focus();
                playCorrectAnswerSound(1);
                if (showInfoText == 1) {
                    showInfoText2(e);
                }
                showLabel(e, false, '#14592f', true, true);
                //console.log(id)
                paintLabel(cid, 'white')
                $(e).attr("onclick", "showPrompt2Label(this)");

                e.removeClass("q")
                updateScore();
                objCountry.splice(i, 1);
                if (objCountry.length == 0) {
                    playCorrectAnswerSound(3);
                    hidePromptInputForm();
                    stopTimer();
                    updateScore();
                    setupCompletion();
                    showCompletion();
                }
                break;

            }
        }

    }
}

function showPrompt2Label(obj) {

    showLabelToggle2(obj, false, '#14592f', true, true);


    playLocation(lang, obj.id, obj.getAttribute('data-sayAfter'));
    if (showInfoText == 1) {
        showInfoText2(obj);
    }
    paintLabel(obj.id, 'white')
}

function prompt2GiveUp() {
    var i

    for (i = 0; i < objCountry.length; i++) {

        e = document.getElementById(objCountry[i].id)
        //paintGroup(e, "#114c29");
        if (e.querySelectorAll(".city, .city1").length > 0) {
            showDot(e);
        }

        var cid = objCountry[i].id

        showLabel(e, false, guessColors[3], true, false);
        //console.log(id)
        paintLabel(cid, 'white');

        e.removeClass("q")

        $(e).attr("onclick", "showLabelToggle2(this,false, guessColors[3], true, false);playLocation(lang,this.id,this.getAttribute('data-sayAfter'));showInfoText2(this);paintLabel(this.id,'white')");
        totalClicks = questionCount
        updateScore()

        setupCompletion();
        showCompletion();

    }

    hidePromptInputForm();
    stopTimer();

}

function paintLabel(cid, myColor) {
    if (document.getElementById("TEXT_" + cid)) {
        document.getElementById("TEXT_" + cid).setAttributeNS(null, 'fill', myColor);
        if (document.getElementById("TEXT_" + cid + "_sayafter")) {
            document.getElementById("TEXT_" + cid + "_sayafter").setAttributeNS(null, 'fill', myColor);
        }
    }
}


function showDot(objArea) {
    var radius

    if (objArea.querySelectorAll(".city, .city1")[0].getAttribute("r") > 1 || objArea.querySelectorAll(".city, .city1")[0].getAttribute("rx") > 1) {
        if (objArea.querySelectorAll(".city, .city1")[0].hasAttribute("r")) { radius = objArea.querySelectorAll(".city, .city1")[0].getAttribute("r") } else { objArea.querySelectorAll(".city, .city1")[0].getAttribute("rx") }
        var xmlns = "http://www.w3.org/2000/svg";
        var elem = document.createElementNS(xmlns, "circle");

        if (radius.parseInt < 3) { radius = 3 }
        objArea.querySelectorAll(".city,.city1")[0].setAttribute("stroke-width", 0.1)
        elem.setAttributeNS(null, "cx", objArea.querySelectorAll(".city,.city1")[0].getAttribute("cx"));
        elem.setAttributeNS(null, "cy", objArea.querySelectorAll(".city,.city1")[0].getAttribute("cy"));
        elem.setAttributeNS(null, "r", radius / 2.5);
        elem.setAttributeNS(null, "opacity", 0.5);
        elem.setAttributeNS(null, "fill", "#000000");
        elem.setAttribute("class", "city3")
        //e.insertBefore(elem, e.firstChild);
        objArea.appendChild(elem);
    }

}
function makeQuizLabel(fImage, value, imageURL) {
    if (window.location.href.indexOf("nocursor=1") == -1) {
        var labelID = getCleanName(value);

        if (window.location.href.indexOf("shownext=1") != -1) {
            if (objCountry.length > 1) {
                value = value + " | " + objCountry[1].qText;
            }
        }

        $("#label_" + labelID).remove();
        if (fImage == 0 || imageURL == "") {
            $("body").prepend("<div id='label_" + labelID + "' class='label'  ><div class='labelText' >" + clickOnText + ' ' + value + "</div></div>");

        } else {
            $("body").prepend("<div id='label_" + labelID + "' class='label'  ><div class='labelText' >" + clickOnText + ' ' + value + " &nbsp; <img id='imgCursorFlag' src='/images/system/flags/" + imageURL + "'  /></div></div>");

        }
        $("#label_" + labelID).offset({ left: lastLeft + 5, top: lastTop + 20 });

        $(".label").show();
        $(".label").fadeOut(8000);

        $(".gamewindow").hover(function () { $(".label").fadeIn() }, function () { $(".label").hide() });
        $(".gamewindow").mousemove(function () { $(".label").show() });



        $(window).mousemove(function (event) {

            $("#label_" + getCleanName(labelID)).offset({ top: event.pageY + 18, left: event.pageX + 5 });
            $(".label").stop();
            $(".label").css({ "opacity": "1" })
        });
    }

}



function setQuizLabel(x, y, textValue) {

    var labelID = getCleanName(textValue);
    $("body").prepend("<div id='label_" + labelID + "' class='label' data-x='" + x + "' data-y='" + y + "' ><div class='labelText' >" + textValue + "</div></div>");

    var thisLabel = $("#label_" + labelID);

    var lAdjust = ($(thisLabel).width() - 6) / 2;
    x = x - lAdjust;
    var tAdjust = ($(thisLabel).height()) / 2;
    y = y - tAdjust;
    var f = 1.8 * scale;


    var t = $("svg").eq(0).offset().top + y * scale;
    var l = $("svg").eq(0).offset().left + x * scale;

    thisLabel.css("font-size", f + "em");
    thisLabel.offset({ top: t, left: l });


}



function scaleDragLabel() {


    $(".dragItem").each(function () {



        var thisLabel = $(this);//$("#label_" + labelID);

        var f = 0.9 * scale;
        if (f < 0.7) { f = 0.7 }
        if (f > 1.2) { f = 1.2 }


        thisLabel.css("font-size", f + "em");


    });

}


function animateCircle(x, y, type) {


    if (anim == true) {
        $(type).show
        $(type).css("opacity", 1)
        var off = Math.round(parseInt($(type).css("width")) / 2)

        if (bDoAnimate == 1 || type == "#anicircle") {
            clearTimeout(myAniTimeout)

            $(type).css({ top: y - off, left: x - off, position: 'absolute' });
            //$(type).offset({ top: y - off, left: x - off });
            var el = $(type),

                newone = el.clone(true);

            el.before(newone);
            $("." + el.attr("class") + ":last").remove();
        }
    }
}

function checkQuestion(e, myEvent) {

    stopFlashing();

    var clickedOn = e.id //e.data("country");

    lastLeft = myEvent.pageX;
    lastTop = myEvent.pageY;


    if (q == clickedOn) {

        animateCircle(myEvent.pageX, myEvent.pageY, "#anicircle")

        if (wrongClicks == 0) setCorrect(q);

        addSVGAttribute(e, "answered");

        removeSVGAttribute(e, "flashing");
        correctClicks++;
        totalClicks++;
        qid++;

        var removeIndex;
        removeIndex = -1;
        $.grep(objCountry, function (n, idx) {

            if (n.id == clickedOn) {
                removeIndex = idx;
            }
        })
        if (removeIndex != -1) objCountry.splice(removeIndex, 1);

        $(".label").remove();

        //if (objQ.infoImgURL != null || objQ.infoText != "") {
        //    makeInfoLabel(objQ.id, objQ.infoText, objQ.infoImgURL);
        //}


        e.setAttribute("data-errors", wrongClicks);
        if (showInfoText == 1) {
            showInfoText2(e);
        };


        if (wrongClicks < 3) {
            paintGroup(e, guessColors[wrongClicks]);

        } else {

            paintGroup(e, guessColors[3]);

        }
        var timeoutid;
        if (gameMode == 'pinhard') {
            (function (e) {
                timeoutid = setTimeout(function () {
                    unPaintGroup(e);

                    playOtherSound();
                }, 1000);
            }(e));
            e.setAttribute("data-timeoutid", timeoutid);
        }

        if (e.querySelectorAll(".city, .city1").length > 0) {
            if (showLabels == 1 && gameMode == 'pin') { showLabel(e, false, labelColors[Math.min(wrongClicks, 3)], false, true) } else { showLabel(e, 3000, labelColors[Math.min(wrongClicks, 3)], false, false) };

            if (gameMode == 'pin' && e.querySelectorAll(".city, .city1").length > 0) {
                showDot(e);

            }

        } else {
            if (keepAreaLabels == 1 && gameMode == 'pin') { showLabel(e, false, labelColors[Math.min(wrongClicks, 3)], false, true); } else { showLabel(e, 1000, labelColors[Math.min(wrongClicks, 3)], false, false); }


        }


        wrongClicks = 0;
        if (objCountry.length > 0) {

            nextQuestion();
            playCorrectAnswerSound(1);
        } else {
            playCorrectAnswerSound(1);
            if (totalClicks == correctClicks) {
                playCorrectAnswerSound(3);
            } else {
                playCorrectAnswerSound(2);

            }


            // game over

            $('#currQuestion').html(" ");
            $("#imgQuestionFlag").hide();
            if (gameMode == 'pinhard') {
                $(".noq").attr("class", "noq"); // remove q class 

                $(".q").each(function () {
                    clearTimeout(this.getAttribute("data-timeoutid"));
                    repaintGroup(this);
                });
                $(".q").attr("class", ""); // remove q class 

            }

            stopTimer();
            updateScore();
            setupCompletion();
            showCompletion();
            q = "";
        }
    } else {

        if ((objCountry.length > 0) && (($(e)[0].hasClass("answered") == false || (gameMode == 'pinhard')))) {

            showLabel(e, 2000, "#3b965f", false, false);
            paintLabel(e.getAttribute("id"), "white")
            if (wrongClicks >= 2) {

                flashCorrect(q)
            }
            wrongClicks++;
            totalClicks++;

            playWrongAnswerSound();
        }
        else {

            if (showInfoText == 1) {
                showInfoText2(e);
            };

            var myColor;
            var myLabelcolor;
            if ($(e)[0].hasClass("noq") == true) {
                myColor = "#3b965f"
                myLabelColor = "#3b965f"
            } else {
                myColor = guessColors[Math.min(e.getAttribute("data-errors"), 3)];
                myLabelColor = labelColors[Math.min(e.getAttribute("data-errors"), 3)];
            }


            if ($("#TEXT_" + e.getAttribute("id")).length == 0 || $("#TEXT_" + e.getAttribute("id")).css("display") == 'none') { showLabel(e, 3000, myLabelColor, false, false); }
            //if (e.querySelectorAll(".city").length == 0) paintGroup(e, myColor );

        }
        if (objCountry.length > 0) {
            $("#label_" + getCleanName(objQ.qText)).offset({ left: myEvent.pageX + 20, top: myEvent.pageY + 20 });
            makeQuizLabel(showInfoImageTop, objQ.qText, objQ.infoImgURL);
        }
        //hideLabel = setTimeout(function () { $("#label_" + objQ.qText).fadeOut(1000, function () { $("#label_" + objQ.qText).remove() }) }, 2000);
    }
    updateScore();
}




function unPaintGroup(e) {
    paintGroup(e, selectedAreaColor);
    removeSVGAttribute(e, "answered");
    var o = e.getElementsByClassName("semitransparent");
    for (var i = 0; i < o.length; i++) {
        o[i].setAttributeNS(null, "opacity", 0);
    }

    var o = e.getElementsByClassName("semitransparent semitransparentvisible");
    for (var i = 0; i < o.length; i++) {
        o[i].setAttributeNS(null, "opacity", 1);
        o[i].setAttributeNS(null, "fill-opacity", semitransparentOpacity);
        o[i].setAttributeNS(null, "fill", semitransparentColor);
    }

    var o = e.getElementsByClassName("semitransparent2");
    for (var i = 0; i < o.length; i++) {
        o[i].setAttributeNS(null, "opacity", 0);
    }


    var o = e.querySelectorAll('.city,.city1');
    for (var i = 0; i < o.length; i++) {
        o[i].setAttributeNS(null, "fill", cityFill);
    };

}

function checkDragQuestion(e, evt) {

    stopFlashing();
    var dropLabel = $("#LABEL_" + q);
    dragX = evt.pageX - window.pageXOffset;
    dragY = evt.pageY - window.pageYOffset;

    if ($(e).hasClass("answered") == false && e != undefined) {
        var clickedOn = e.id //e.data("country");

        if (q == clickedOn) {

            animateCircle(evt.pageX, evt.pageY, "#anicircle");
            $('#currQuestion').html(" | ");
            $(e).attr("class", "q answered");

            if (gameMode == "dragDropFlags") {
                playLocation(lang, q);
            }

            isDragChecking = false;


            wrongClicks = parseInt(dropLabel.attr("data-errors"));

            if (wrongClicks == 0) setCorrect(q);

            e.setAttribute("onclick", "showInfoText2(this);");
            if (showInfoText == 1) {
                showInfoText2(e);
            }

            correctClicks++;
            totalClicks++;

            qid++;

            var removeIndex;
            removeIndex = -1;
            arrObjQ = $.grep(objCountry, function (n, idx) {

                if (n.id == clickedOn) {
                    removeIndex = idx;
                    return n;
                }
            })
            if (removeIndex != -1) objCountry.splice(removeIndex, 1);



            if (wrongClicks < 3) {
                paintGroup(e, guessColors[wrongClicks]);
                moveToLabel(e, dropLabel, labelColors[wrongClicks]);
            } else {

                paintGroup(e, guessColors[3]);
                moveToLabel(e, dropLabel, labelColors[3]);
                setTimeout(function () { paintGroup(e, guessColors[3]); }, 1000)

            }

            if (e.querySelectorAll(".city, .city1").length > 0) {


                showDot(e);
            }

            if (gameMode == 'dragDrop') { $("#currQuestion").html("| " + dragDropText1) } else { $("#currQuestion").html("| " + dragDropTextFlags1) }
            q = "";

            if (objCountry.length > 0) {
                playCorrectAnswerSound(1);
                // nextQuestion();
            } else {
                playCorrectAnswerSound(1);
                if (totalClicks == correctClicks) {
                    playCorrectAnswerSound(3);
                } else {
                    playCorrectAnswerSound(2);

                }
                // game over
                $("#currQuestion").html("");
                $("#imgQuestionFlag").hide();
                stopTimer();
                updateScore();
                setupCompletion();
                showCompletion();

            }

        } else {

            if (q == "" && dragDropText != "") {
                clearTimeout(hideRect);
                clearTimeout(hideText);

                $("#RECT_INFO").remove();
                $("#TEXT_INFO").remove();

                var svg = document.getElementById("svgpoint");
                var pnt = svg.createSVGPoint();

                if (gameMode == 'dragDrop') {
                    addText(getCenterpoint(e).x, getCenterpoint(e).y, dragDropText, "INFO", "#FFFFFF", true);
                } else {
                    addText(getCenterpoint(e).x, getCenterpoint(e).y, dragDropTextFlags, "INFO", "#FFFFFF", true);
                }


                hideRect = setTimeout(function () { $("#RECT_INFO").remove() }, 5000);
                hideText = setTimeout(function () { $("#TEXT_INFO").remove() }, 5000);

            } else {
                var labelErrors = parseInt(dropLabel.attr("data-errors"));

                if ($(e)[0].hasClass("answered") == false) {

                    dropLabel.attr("data-errors", labelErrors + 1)
                    //showThisLabel(e, true, labelColors[Math.min(e.getAttribute("data-errors"), 3)], false);
                    wrongClicks = labelErrors + 1;
                    dropLabel.css("background-color", guessColors[Math.min(wrongClicks, 3)]);
                    totalClicks++;
                    if (wrongClicks > 2) { flashCorrect(q) }
                    playWrongAnswerSound();
                }
            }
        }
    } else {
        return false;
    }

    //calculate score
    updateScore();


}






function clearScore() {
    score = 0;
    correctClicks = 0;
    totalClicks = 0;
    $("#score").html("0%");
}

function updateScore() {
    score = Math.round(correctClicks / totalClicks * 100)
    if (score == 100 && correctClicks != totalClicks) { score = 99 }
    if (gameMode == 'prompt2') {
        $("#score").html(correctClicks + "/" + questionCount)
    }
    else {
        if (!isNaN(score) && score >= 0) {
            $("#score").html(score + "%");
        } else {
            $("#score").html("-");
        }
    }


}




function flashCorrect(q) {

    $(".q").each(function () {
        if (this.id == q) {
            var corrAreaObj = this;

            this.setAttribute("class", "q flashing");
            isFlashing = true;
            flashObj(corrAreaObj);
            flasher = setInterval(function () { flashObj(corrAreaObj) }, 1200);

            var b = getBBox2(this)
            var svg = document.getElementById("svgpoint");

            var pnt = svg.createSVGPoint();
            pnt.x = Math.round(b.x + b.width / 2);
            pnt.y = Math.round(b.y + b.height / 2);

            var ctm = svg.getScreenCTM();
            var ipnt = pnt.matrixTransform(ctm);

            var aniX = ipnt.x + window.pageXOffset - 8;
            var aniY = ipnt.y + window.pageYOffset - 8;

            animateCircle(Math.round(aniX), Math.round(aniY), "#anicircle2");
            if (bDoAnimate == 1) {
                bDoAnimate = 0;
                myAniTimeout = setTimeout(function () {
                    bDoAnimate = 1;
                }, 3000);
            }


            //var svgimg = document.createElementNS(svgNS, "image");
            //svgimg.setAttributeNS(null, 'height', '200');
            // svgimg.setAttributeNS(null, 'width', '200');
            //svgimg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/images/system/ripple.gif');
            //var p = getCenterpoint(corrAreaObj);
            //svgimg.setAttributeNS(null, 'x', p.x-100);
            //svgimg.setAttributeNS(null, 'y', p.y-100);
            //svgimg.setAttributeNS(null, 'opacity', '0.1');
            //svgimg.setAttributeNS(null, 'pointer-events', 'none');
            //svgimg.setAttributeNS(null, 'id', 'flashImage');


            //svgimg.setAttributeNS(null, 'visibility', 'visible');
            //$('svg').append(svgimg);
        }
    });

}


function flashObj(obj) {

    var correctArea = obj;
    if (isFlashing == true) {
        paintGroup(correctArea, guessColors[3]);
        var col2
        if (obj.querySelectorAll(".city").length > 0 || obj.querySelectorAll(".city1").length > 0) { col2 = "#FFFFFF" } else { col2 = "#dddddd" }
        flasher2 = setTimeout(function () { paintGroup(correctArea, col2) }, 600);
    }
}


function stopFlashing() {

    clearInterval(flasher);
    clearTimeout(flasher2);
    isFlashing = false;
}

function setGameMode() {

    gameMode = $("#drpGameMode :selected").val();
    //gameMode = "video"
    if (window.location.href.indexOf("video") > -1) {
        gameMode = "video";
        //console.log("game mode is Video")
    }
    if (gameMode == "video") {
        //selectedAreaColor = "#249753";
        //unSelectedAreaColor = "#1e8346";
        cityFill = "#70b089"
        if (gameID == "3003") {
            //document.getElementById("svgpoint").setAttribute("viewBox", "0 20 900 700");
        }

        $('#cbVoice').prop('checked', true);
        $('#imgVideo').prop("src", "/images/youtube/youtube_1.png");

    } else {
        $('#imgVideo').hide();
    }

    initGame();
}



function startTimer() {

    start = new Date;
    newTime = "0:00";

    if (reviewMode == 0 && window.location.href.indexOf("notimer=1") == -1) {
        $('#timer').html(" | 0:00");
        gameDuration = 0;
        gameTime = setInterval(function () {
            //scaleSVG();
            if (gameMode != "prompt2" || typingStarted == 1) {
                gameDuration = Math.round((new Date - start) / 100) * 100;
            } else {
                gameDuration = 0;
            }
            totalSeconds = Math.round(gameDuration / 1000);
            var minutes = Math.floor(totalSeconds / 60);
            var seconds = totalSeconds % 60;
            var csec = Math.round((gameDuration % 1000) / 100);
            var pad = "00";
            pad = pad.toString();
            seconds = seconds.toString();
            seconds = pad.substring(0, pad.length - seconds.length) + seconds;
            var cseconds = csec.toString();
            //cseconds = pad.substring(0, pad.length - cseconds.length) + cseconds;

            newTime = minutes + ":" + seconds;

            $('#timer').html(' | ' + newTime);
        }, 100);
    } else {
        if (reviewMode != 0) { $('#timer').html(" | (" + reviewingText + ")"); }

    }

}

function stopTimer() {
    end = new Date;
    clearTimeout(gameTime);
}


function hideCompletion() {
    $("#completion").fadeOut();
    $("#cmdRestart").prop('disabled', false);
    $("#drpGameMode").prop('disabled', false);
    $("#btnSaveHighScore").prop("disabled", false);
}

function showCompletion() {
    $("#completion").fadeIn();
    $("#cmdRestart").prop('disabled', true);
    $("#drpGameMode").prop('disabled', true);

    if ($.cookie("hasAccount") == "true" && reviewMode == 0 || isChallenge == true && reviewMode == 0) {
        //console.log("game complete")
        if (gameMode == "pin") { gMode = "p" };
        if (gameMode == "pinhard") { gMode = "h" };
        if (gameMode == "wikipedia") { gMode = "w" }
        if (gameMode == "learn") { gMode = "l" }
        if (gameMode == "dragDrop") { gMode = "d" }
        if (gameMode == "dragDropFlags") { gMode = "f" }
        if (gameMode == "prompt") { gMode = "t" }
        if (gameMode == "prompt2") { gMode = "y" }

        $("#nickname").val($.cookie("nickname"))

    }

    updateReviewLink();
}

function saveHighScore() {
    hideCompletion();
    $("#btnSaveHighScore").prop("disabled", true);

    $.cookie("nickname", $("#nickname").val());
    if (customID == '') {
        updateReport(gameID, customID, $.cookie("memberName"), $.cookie("memberId"), score, start, end, gameDuration, correctClicks, totalClicks - correctClicks, gMode, $.cookie("ip"), lang, $.cookie("sessionId"), $("#nickname").val())
        updateTop10(gameID, "", $.cookie("memberId"))
        sessionStorage.removeItem("ohs");
        getHighScores($.cookie("memberId"))
    }

    if (customID != '' && isChallenge == true) {
        var membid
        if (typeof $.cookie('memberId') === 'undefined') {
            membid = "-"
        } else {
            membid = $.cookie('memberId')
        }
        if (membid == "") { membid = "-" }
        updateReport(gameID, customID, "-", membid, score, start, end, gameDuration, correctClicks, totalClicks - correctClicks, gMode, "-", lang, "-", $("#nickname").val())
        var data2 = {};
        data2.strMessage = "shs: " + $.cookie("nickname") + " " + score.toString() + " " + gameDuration.toString()

        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: '/services/services.aspx/WriteToLog',
            data: JSON.stringify(data2),
            async: false,
            success: function (response) {
                //console.log(response)
            },
            error: function (error) {
                console.log("error in WriteToLog");
            }

        })

        updateTop10(gameID, customID, "")

    }

}



function playWrongAnswerSound() {
    var s = $("#WrongAnswerSound")[0];

    try {

        if ($("#cbSoundOn").prop("checked") == true) { s.pause(); s.currentTime = 0; s.play() };
    } catch (e) { }
}



function playCorrectAnswerSound(n) {

    if (n == 1) {
        var s = $("#CorrectAnswerSound")[0];
    }

    if (n == 2) {
        var s = $("#CorrectAnswerSoundEnd")[0];
    }

    if (n == 3) {
        var s = $("#CorrectAnswerSoundEnd100")[0];
    }

    try {
        if ($("#cbSoundOn").prop("checked") == true) { s.pause(); s.currentTime = 0; s.play() };
    } catch (e) { }
}


function playOtherSound() {
    var s = $("#OtherSound")[0];
    try {
        if ($("#cbSoundOn").prop("checked") == true) { s.pause(); s.currentTime = 0; s.play() };
    } catch (e) { }
}





function getDisplayName(cleanText) {
    var displayText = cleanText.replace("_", " ");
    return displayText;
}


if (SVGElement && SVGElement.prototype) {

    SVGElement.prototype.hasClass = function (className) {
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(this.getAttribute('class'));
    };

    SVGElement.prototype.addClass = function (className) {
        if (!this.hasClass(className)) {
            this.setAttribute('class', this.getAttribute('class') + ' ' + className);
        }
    };

    SVGElement.prototype.removeClass = function (className) {
        var removedClass = this.getAttribute('class').replace(new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'), '$2');
        if (this.hasClass(className)) {
            this.setAttribute('class', removedClass);
        }
    };

    SVGElement.prototype.toggleClass = function (className) {
        if (this.hasClass(className)) {
            this.removeClass(className);
        } else {
            this.addClass(className);
        }
    };

}




// utilities



Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Array.prototype.removeFirst = function () {
    var what, a = arguments, L = a.length, ax;

    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
            return this;
        }
    }
    return this;
};



function HTMLClean(s) {
    var r = s;
    r = r.replace("ł", "&#322;");
    r = r.replace("Ł", "&#321;");
    r = r.replace("ś", "&#347;");
    r = r.replace("ę", "&#281;");

    return r;
}

var sourceUrlSayAfter2

function playLocation(lang, sourceUrl, sourceUrlSayAfter) {
    var audio = $("#location");
    sourceUrlSayAfter2 = sourceUrlSayAfter;
    var _listener = function () {
        playLocation(lang, sourceUrlSayAfter2, '')
        audio[0].removeEventListener("ended", _listener);
    }


    if (typeof sourceUrl == 'undefined') {
        return;
    }
    if (sourceUrl == '') {
        audio[0].removeEventListener("ended", _listener);
        return;
    }

    if ($("#cbVoice").prop("checked") == true) {

        $("#mp3_src").attr("src", 'https://online.seterra.com/audio/' + lang + '/' + sourceUrl + ".mp3");
        $("#ogg_src").attr("src", 'https://online.seterra.com/audio/' + lang + '/' + sourceUrl + ".ogg");

        /****************/
        audio[0].pause();
        audio[0].load(); //suspends and restores all audio element

        audio[0].play(); //changed based on Sprachprofi's comment below
        /*audio[0].oncanplaythrough = audio[0].play();*/

        /****************/

        audio[0].addEventListener("ended", _listener)



    }
}

