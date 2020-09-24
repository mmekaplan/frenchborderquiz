// JavaScript source code

function cleanUpSpecialChars(s) {
    var r = s.toLowerCase();
    if (r.substring(0, 3).toLowerCase() == 'the') {
        r = r.substring(3)
    }

    if (r.substring(r.length - 5).toLowerCase() == ' city') {
        r = r.substring(0, r.length - 5)
    }

    r = r.replace(new RegExp(/[àáâãäåāă]/g), "a");
    r = r.replace(new RegExp(/ç/g), "c");
    r = r.replace(new RegExp(/[èéêëē]/g), "e");
    r = r.replace(new RegExp(/[ìíîïī]/g), "i");
    r = r.replace(new RegExp(/[śšș]/g), "s");
    r = r.replace(new RegExp(/ñ/g), "n");
    r = r.replace(new RegExp(/ń/g), "n");
    r = r.replace(new RegExp(/[ļľ]/g), "l");
    r = r.replace(new RegExp(/ž/g), "z");
    r = r.replace(new RegExp(/ķ/g), "k");
    r = r.replace(new RegExp(/ß/g), "ss");
    r = r.replace(new RegExp(/[òóôõöồøŏő]/g), "o");
    r = r.replace(new RegExp(/[ùúûüū]/g), "u");
    r = r.replace(new RegExp(/[ýÿ]/g), "y");
    r = r.replace(new RegExp(/[ýÿ]/g), "y");
    r = r.replace(new RegExp(/[’'ʿ‘ ]/g), "");
    r = r.replace(new RegExp(/æ/g), "ae");




    r = r.replace(/\s*\(.*?\)\s*/g, ''); //Removes everything between brackets
    r = r.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // trim

    r = remove_vietnamese_accents(r)
    return r;
}

function getCleanName(dirtyText) {
    var cleanText = dirtyText.replace(/\ /g, '_');

    cleanText = cleanText.replace(/[|&!;$%=@"'<>()+?,.:#]/g, "");
    cleanText = cleanText.replace("/", "");
    cleanText = cleanText.replace("/", ""); //In case there are two slashes... Do not remove!
    return cleanText;
}


function remove_vietnamese_accents(str) {
    accents_arr = new Array(
        "à", "á", "ạ", "ả", "ã", "â", "ầ", "ấ", "ậ", "ẩ", "ẫ", "ă",
        "ằ", "ắ", "ặ", "ẳ", "ẵ", "è", "é", "ẹ", "ẻ", "ẽ", "ê", "ề",
        "ế", "ệ", "ể", "ễ",
        "ì", "í", "ị", "ỉ", "ĩ",
        "ò", "ó", "ọ", "ỏ", "õ", "ô", "ồ", "ố", "ộ", "ổ", "ỗ", "ơ",
        "ờ", "ớ", "ợ", "ở", "ỡ",
        "ù", "ú", "ụ", "ủ", "ũ", "ư", "ừ", "ứ", "ự", "ử", "ữ",
        "ỳ", "ý", "ỵ", "ỷ", "ỹ",
        "đ",
        "À", "Á", "Ạ", "Ả", "Ã", "Â", "Ầ", "Ấ", "Ậ", "Ẩ", "Ẫ", "Ă",
        "Ằ", "Ắ", "Ặ", "Ẳ", "Ẵ",
        "È", "É", "Ẹ", "Ẻ", "Ẽ", "Ê", "Ề", "Ế", "Ệ", "Ể", "Ễ",
        "Ì", "Í", "Ị", "Ỉ", "Ĩ",
        "Ò", "Ó", "Ọ", "Ỏ", "Õ", "Ô", "Ồ", "Ố", "Ộ", "Ổ", "Ỗ", "Ơ",
        "Ờ", "Ớ", "Ợ", "Ở", "Ỡ",
        "Ù", "Ú", "Ụ", "Ủ", "Ũ", "Ư", "Ừ", "Ứ", "Ự", "Ử", "Ữ",
        "Ỳ", "Ý", "Ỵ", "Ỷ", "Ỹ",
        "Đ"
    );

    no_accents_arr = new Array(
        "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
        "a", "a", "a", "a", "a", "a",
        "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e",
        "i", "i", "i", "i", "i",
        "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o",
        "o", "o", "o", "o", "o",
        "u", "u", "u", "u", "u", "u", "u", "u", "u", "u", "u",
        "y", "y", "y", "y", "y",
        "d",
        "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A",
        "A", "A", "A", "A", "A",
        "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E",
        "I", "I", "I", "I", "I",
        "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O",
        "O", "O", "O", "O", "O",
        "U", "U", "U", "U", "U", "U", "U", "U", "U", "U", "U",
        "Y", "Y", "Y", "Y", "Y",
        "D"
    );

    return str_replace(accents_arr, no_accents_arr, str);
}

function str_replace(search, replace, str) {
    var ra = replace instanceof Array, sa = str instanceof Array, l = (search = [].concat(search)).length, replace = [].concat(replace), i = (str = [].concat(str)).length;
    while (j = 0, i--)
        while (str[i] = str[i].split(search[j]).join(ra ? replace[j] || "" : replace[0]), ++j < l);
    return sa ? str : str[0];
}

function detectAnimation() {
    var animation = false,
        animationstring = 'animation',
        keyframeprefix = '',
        domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
        pfx = '',
        elem = document.createElement('div');

    if (elem.style.animationName !== undefined) { animation = true; }



    if (animation === false) {
        for (var i = 0; i < domPrefixes.length; i++) {
            if (elem.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                pfx = domPrefixes[i];
                animationstring = pfx + 'Animation';
                keyframeprefix = '-' + pfx.toLowerCase() + '-';
                animation = true;
                break;
            }
        }
    } 

    if (navigator.userAgent.indexOf('MSIE') !== -1
        || navigator.appVersion.indexOf('Trident/') > -1) {
        animation=false;
    }

    return animation;
}
