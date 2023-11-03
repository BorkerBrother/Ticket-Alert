

// Function to create and populate the HTML elements for each ticket
function createTicketElements(ticket, date) {

    const ticketElement = document.createElement("div");
    ticketElement.classList.add("ticket");
    ticketElement.innerHTML = `
        <h2 class="ticket-title">Ticket #${ticket.id}</h2>
        <p class="ticket-summary">Betreff: ${ticket.subject}</p>
        <p class="ticket-tags">Tags: ${ticket.tags}</P>
        <p class="ticket-date">Enddatum: ${formatDate(date)}</p>
    `;
    return ticketElement;
}



// Function to add ticket elements to the container
function addTicketToContainerIfNotExists(ticket, date) {
    const ticketContainer = document.getElementById("ticketContainer");
    const ticketElements = ticketContainer.getElementsByClassName("ticket");
    
    // Überprüfen, ob ein Ticket mit derselben ID bereits vorhand ist
    let ticketAlreadyExists = false;
    for (const ticketElement of ticketElements) {
        const titleElement = ticketElement.querySelector(".ticket-title");
        if (titleElement && titleElement.textContent.includes(`Ticket #${ticket.id}`)) {
            ticketAlreadyExists = true;
            break;
        }
    }

    // Wenn das Ticket noch nicht vorhand ist, füge es hinzu
    if (!ticketAlreadyExists) {
        const ticketElement = createTicketElements(ticket, date);
        ticketContainer.appendChild(ticketElement);

        // Füge den Klick-Event-Listener hinzu
        ticketElement.addEventListener('click', (event) => {
            openTicket(ticket.id);
        });
    }
}



// Funktion zum Öffnen eines Tickets anhand seiner ID
function openTicket(ticketId) {
    // Erstellen Sie die URL für das Ticket basierend auf seiner ID
    const ticketURL = `https://d3v-laut-samples.zendesk.com/agent/tickets/${ticketId}`+ "?zcli_apps=true"; // Annahme: Die URL-Struktur entspricht /tickets/<ticket-id>

    // Führen Sie die Weiterleitung zur Ticket-URL durch
    window.open(ticketURL);
    //document.body.appendChild(ticketURL);
}