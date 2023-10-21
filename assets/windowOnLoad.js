window.onload = function (){
    
    var client = getClient();

    checkAllTicketsForExpiry(client);
    
}