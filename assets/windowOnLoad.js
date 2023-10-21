window.onload = function (){
    
    var client = ZAFClient.init();

    checkAllTicketsForExpiry(client);
    
}