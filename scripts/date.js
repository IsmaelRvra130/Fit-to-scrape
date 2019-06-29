var makeDate = function() {
    var d = new Date();
    var formmattedDate = "";

    formmattedDate += (d.getMonth() + 1) + "_";

    formmattedDate += d.getDate() + "_";

    formmattedDate += d.getFullYear();

    return formmattedDate;
}

module.exports = makeDate;
