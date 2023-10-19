// Funktion zum Formatieren des Datums in UTC ("yyyy-mm-dd" Format)

// Hier wird die Funktion zur Überprüfung des Ticketstatus aufgerufen
function isDateExpired(date) {
    var currentDate = new Date();
    return date < currentDate;
  }

function formatDateToUTC(date) {
    var year = date.getUTCFullYear();
    var month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    var day = date.getUTCDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day;
  }
  

// Formate Date 
function formatDate(date) {
var cdate = new Date(date);
var options = {
    year: "numeric",
    month: "short",
    day: "numeric"
};
date = cdate.toLocaleDateString("en-us", options);
return date;
}
  
// Export the functions to make them accessible in other files
//module.exports = { formatDateToUTC, formatDate };