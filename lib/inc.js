exports.get_movie_info = get_movie_info = function(GvodUrlArray) {
    var container = [];
    for(var i=0;i<GvodUrlArray.length;i++){
        var item = {
            name: getSubstr(GvodUrlArray[i]),
            link: GvodUrlArray[i]
        };
        container.push(item);
    }
    return container;
};

exports.get_movie_name = get_movie_name = function(filename, arsg){
    var tname = filename.split(arsg);
    if(tname.length>2){
        return get_movie_name(tname[(tname.length-2)], ']');
    }else{
        return tname[(tname.length-1)];
    }
}

function getSubstr(downurl){
    var resultStr = downurl
    if(downurl.indexOf("ed2k://|file|")==0){
        var tmpStr =  resultStr.split('|');
        if(tmpStr.length>3){
            if(tmpStr[2].length>0){
                resultStr = decodeURIComponent(tmpStr[2]);
            }
        }

        return resultStr;
    }else{
        return resultStr;
    }
}

//function ThunderEncode(t_url) {
//    var thunderPrefix = "AA";
//    var thunderPosix = "ZZ";
//    var thunderTitle = "thunder://";
//    var tem_t_url = t_url;
//    var thunderUrl = thunderTitle + encode64(strUnicode2Ansi(thunderPrefix + tem_t_url + thunderPosix));
//    return thunderUrl;
//}