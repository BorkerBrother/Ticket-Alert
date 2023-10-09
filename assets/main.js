
// MAIN FUNCTION

(function () {
  // Import Zendesk SDK - Client
  // get() - read
  // set() - write
  // on() - listen
  // request() - Http Request 
  var client = ZAFClient.init();

    
    // Starte die Überprüfungsfunktion beim Laden der App 
    checkAndUpdateTicketStatus(client);

    // Interval für die Überprüfungsfunktion (alle 24 Stunden)
    var checkIntervalInMilliseconds = 24 * 60 * 60 * 1000; // 24 Stunden
    setInterval(function() {
      checkAndUpdateTicketStatus(client);
    }, checkIntervalInMilliseconds);
    
    // Size from App if in sidebar
    client.invoke('resize', { width: '200px', height: '200px' });

    // Get USER INFO as get
    client.get('ticket.requester.id').then(
        function(data) {
          var user_id = data['ticket.requester.id'];
          requestUserInfo(client, user_id);
        }
      );

    
      // Ticket Status
      client.request('ticket.status').then(function(data){
       // console.log(data);
      })

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
             
            });
          },
          function(response) {
            console.error(response.responseText);
          }
        );
    });

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

  var client = ZAFClient.init();

  // Datum aus eingabe lesen
  var inputDate = document.getElementById("dueDate").value;

  // Datum setzen
  var dateToSet = new Date(inputDate);


  // Formatieren des Datums in das gewünschte Format
  var formattedDate = formatDateToUTC(dateToSet);

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
    // DOM CONTENT LOAD
    var button = document.getElementById('button');
    button.addEventListener('click', onSetDateButtonClick);
    
  });

// Funktion zum Formatieren des Datums in UTC ("yyyy-mm-dd" Format)
function formatDateToUTC(date) {
  var year = date.getUTCFullYear();
  var month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Monat ist nullbasiert
  var day = date.getUTCDate().toString().padStart(2, '0');
  return year + '-' + month + '-' + day;
}


// ----------------------------  Change Status   ------------------------------ 

// Wenn Datum abgelaufen, setzte ticket status auf neu 

// Funktion zum Ändern des Ticketstatus


// Funktion zum Überprüfen und Aktualisieren des Ticketstatus
function checkAndUpdateTicketStatus(client) {
  // Hole das aktuelle Ticket
  var ticketId;
  // Get Ticket_id
  client.get('ticket.id').then(function(data) {
  //console.log(data);
      
  // Die Ticket-ID als Integer abrufen
  ticketId = parseInt(data['ticket.id']);

    // Hole das Datum aus dem benutzerdefinierten Feld
    client.get('ticket.customField:custom_field_19134886927633').then(function(data) {
      var customFieldDate = data['ticket.customField:custom_field_19134886927633'];

      // Konvertiere das Datum in ein Date-Objekt
      var dateToCheck = new Date(customFieldDate);

      // Überprüfe, ob das Datum abgelaufen ist
      if (isDateExpired(dateToCheck)) {
        // Das Datum ist abgelaufen, ändere den Ticketstatus hier
        changeTicketStatus(client, ticketId, 'new'); // Du kannst hier den gewünschten Status verwenden
      }
    });
  });
}


// Hier wird die Funktion zur Überprüfung des Ticketstatus aufgerufen
function isDateExpired(date) {
  var currentDate = new Date();
  return date < currentDate;
}

// Funktion zum Ändern des Ticketstatus
function changeTicketStatus(client, ticketId, newStatus) {
  var statusField = 'status';

  var ticketData = {};
  ticketData[statusField] = newStatus;

  client.request({
    url: '/api/v2/tickets/' + ticketId + '.json',
    type: 'PUT',
    dataType: 'json',
    data: {
      ticket: ticketData
    }
  }).then(
    function(response) {
      console.log('Ticketstatus wurde erfolgreich geändert:', newStatus);
    },
    function(response) {
      console.error('Fehler beim Ändern des Ticketstatus:', response.responseText);
    }
  );
}
