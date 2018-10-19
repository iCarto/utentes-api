function Util () {}

Util.formatBytes = function(bytes,decimals) {
    if(bytes == 0) return '0 Bytes';
    var k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

Util.formatDate = function(date) {
    if(date instanceof Date && !isNaN(date.valueOf())) {
        var dateString = date.toISOString().slice(0,10).replace(/-/g,"");
        return dateString.substring(6,8) + '/' + dateString.substring(4,6) + '/' + dateString.substring(0,4);
    }else{
        return '-';
    }
};
