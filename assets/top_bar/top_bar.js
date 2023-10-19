
// Find the "Refresh" button element by attributes
const refreshButton = document.querySelector('[data-garden-id="buttons.icon_button"][aria-label="Ansichtsbereich aktualisieren"]');


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
  
      // Loop through custom fields and log each one
      ticket.custom_fields.forEach(function(customField) {
        if (customField) {
          const customFieldDate = customField.value;
          //console.log(ticket.id , customFieldDate);

          const testDate = new Date(customFieldDate);
          formatDate(testDate);

          //console.log(ticket);
          //console.log(ticket.status);

          if(!(ticket.status == "closed")){

          //console.log(testDate);
            if (isDateExpired(testDate)) {
              // Das Datum ist abgelaufen, ändere den Ticketstatus hier
              changeTicketStatus(client, ticket.id, 'new'); // Du kannst hier den gewünschten Status verwenden
              clickRefreshButton();
            }
          }
          
        } 
        
        else {
          console.log('Custom field not found for this ticket');
        }

      });
      });
    });
  }

  
  function clickRefreshButton() {
    
    const buttons = document.getElementById('HTMLButtonElement');
    console.log(buttons);
    
    // Find the "Refresh" button element by attributes

    const refreshButton = document.getElementById('ember1629');
    console.log('Gefundenes Button-Objekt:', refreshButton);
    //console.log(getAllElements());

    if (refreshButton) {
      // Trigger a click event on the "Refresh" button
      refreshButton.click();
    } else {
      console.error('Unable to find the "Refresh" button. It may not be available on this page.');
    }
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
  