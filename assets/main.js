

(function () {
  // Import Zendesk SDK
  // get() - read
  // set() - write
  // on() - listen
  // request() - Http Request 
    var client = ZAFClient.init();

    // Size from App if in sidebar
    client.invoke('resize', { width: '200px', height: '200px' });

    // Get USER INFO as get
    client.get('ticket.requester.id').then(
        function(data) {
          var user_id = data['ticket.requester.id'];
          requestUserInfo(client, user_id);
        }
      );

    // Ticket Info Custom Field 
    client.get('ticket.customField:custom_field_19134886927633').then(
      function(data) {
        var ticket_info = data['ticket.customField:custom_field_19134886927633'];
        //console.log(ticket_info);
        //requestTicketInfo(client, ticket_info);
      }
    );

    //////////////////// Ticket Info MAIN 
    var ticketId;

      // Get Ticket_id
      client.get('ticket.id').then(function(data) {
        //console.log(data);
      
        // Die Ticket-ID als Integer abrufen
        ticketId = parseInt(data['ticket.id']);
      
        // GET TICKET INFO as request 
        client.request('/api/v2/tickets/' + ticketId).then(
          function(tickets) {
            console.log(tickets);
      
            client.get('ticket.customField:custom_field_19134886927633').then(function(data) {
              // Datum aus dem benutzerdefinierten Feld abrufen
              var customFieldDate = data['ticket.customField:custom_field_19134886927633'];
      
              // Das Datum in einen String umwandeln 
              var formattedDate = formatDate(customFieldDate);

              showInfoTicket(formattedDate);

              console.log(formattedDate);
              
            });
          },
          function(response) {
            console.error(response.responseText);
          }
        );
    });

      // Ticket info as get (Only for data)
    client.get('ticket').then(
      function(data) {
        var user_id = data['ticket'];
        //console.log(user_id);
      }
    );

    

  

  })();


///// SHOW USER INFO
  function requestUserInfo(client, user_id) {

    var settings = {
      url: '/api/v2/users/' + user_id + '.json',
      type:'GET',
      dataType: 'json',
    };
  
    client.request(settings).then(
      function(data) {
        showInfoUser(data);
        //console.log(data);
      },
      function(response) {
        showError(response);
      }
    );
  }
  

// Show Info User
  function showInfoUser(data) {
    var requester_data = {
      'name': data.user.name,
      'tags': data.user.tags,
      //'created_at': formatDate(data.user.created_at), // should be ticket info
      //'finish_at': formatDate(data.user.finish_at) //     should be ticket info
    };
    

    var source = document.getElementById("requester-template").innerHTML; // Get template from html
    var template = Handlebars.compile(source);                            // 
    var html = template(requester_data);
    document.getElementById("content").innerHTML = html;
  }

  // Show Info Ticket
  function showInfoTicket(data) {
    var requester_data = {
      //'name': data.user.name,
      //'tags': data.user.tags,
      //'created_at': formatDate(data.user.created_at), // should be ticket info
      'finish_at': data//     should be ticket info
    };
  
    var source = document.getElementById("requester-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(requester_data);
    document.getElementById("content").innerHTML = html;
  }

 // Show Error  
  function showError() {
    var error_data = {
      'status': 404,
      'statusText': 'Not found'
    };
  
    var source = document.getElementById("error-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(error_data);
    document.getElementById("content").innerHTML = html;
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

  // Funktion, die aufgerufen wird, wenn der Button geklickt wird
function onSetDateButtonClick() {

  // Hier kannst du das gewünschte Datum erstellen
  var dateToSet = new Date(); // Hier wird das aktuelle Datum verwendet, du kannst es anpassen

  // Formatieren des Datums in das gewünschte Format
  var formattedDate = formatDate(dateToSet);

  // Setzen des Datums in das benutzerdefinierte Feld
  client.set('ticket.customField:custom_field_19134886927633', formattedDate).then(
    function() {
      console.log('Datum wurde erfolgreich gesetzt:', formattedDate);
    },
    function(response) {
      console.error('Fehler beim Setzen des Datums:', response.responseText);
    }
  );
}

  document.addEventListener('DOMContentLoaded', function() {
    // Hier fügst du den Code ein, der auf das DOM zugreift
    var button = document.getElementById('button');
    button.addEventListener('click', onSetDateButtonClick);
    
  });

