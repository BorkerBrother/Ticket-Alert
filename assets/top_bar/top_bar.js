
(function () {

    var client = ZAFClient.init();

    checkAndUpdateAllTickets(client);
    // Solange Ticket 
    checkAllTicketsForExpiry(client);
    
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
      
      // Durchlaufe alle Tickets und überprüfe das Ablaufdatum
      tickets.forEach(function(ticket) {
        console.log(ticket);

        const customFieldDate = ticket.custom_fields.find(field => field.id === 'custom_field_19134886927633').value;

        console.log(customFieldDate2);

        if (isDateExpired(customFieldDate)) {
          // Das Datum ist abgelaufen, ändere den Ticketstatus hier
          changeTicketStatus(client, ticket.id, 'new'); // Du kannst hier den gewünschten Status verwenden
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
  