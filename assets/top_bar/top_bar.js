
(function () {

    var client = ZAFClient.init();
  
  
    // Starte die Überprüfungsfunktion beim Laden der App 
    checkAndUpdateTicketStatus(client);
    
  
      // Get Ticket_id
    client.get('ticket.id').then(function(data) {
      //console.log(data);
    
    var ticketId;
    
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
  

  // ----------------------------  Change Status   ------------------------------ 

// Wenn Datum abgelaufen, setzte ticket status auf neu 
// Funktion zum regelmäßigen Überprüfen aller Tickets
function checkAllTicketsForExpiry(client) {
    setInterval(function() {
      // Hier rufst du die Funktion auf, die alle Tickets überprüft und den Status aktualisiert
      checkAndUpdateAllTickets(client);
    }, 30 * 1000); // 30 Sekunden Intervall (in Millisekunden)
  }
  
  // Funktion zum Überprüfen und Aktualisieren des Ticketstatus für alle Tickets
  function checkAndUpdateAllTickets(client) {
    // Rufe alle Tickets ab
    client.request('/api/v2/tickets.json').then(function(response) {
      const tickets = response.tickets;
      console.log(response);
      
      // Durchlaufe alle Tickets und überprüfe das Ablaufdatum
      tickets.forEach(function(ticket) {
        const customFieldDate = new Date(ticket.custom_fields.find(field => field.id === 'custom_field_19134886927633').value);
  
        if (isDateExpired(customFieldDate)) {
          // Das Datum ist abgelaufen, ändere den Ticketstatus hier
          changeTicketStatus(client, ticket.id, 'new'); // Du kannst hier den gewünschten Status verwenden
        }
      });
    });
  }
  
  
  // Funktion zum Ändern des Ticketstatus
  
  
  // Funktion zum Überprüfen und Aktualisieren des Ticketstatus im Ticket 
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
  