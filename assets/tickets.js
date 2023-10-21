

// Function to create and populate the HTML elements for each ticket
function createTicketElements(ticket) {
    const ticketElement = document.createElement("div");
    ticketElement.classList.add("ticket");
    ticketElement.innerHTML = `
        <h2 class="ticket-title">Ticket #${ticket.id}</h2>
        <p class="ticket-summary">Betreff: ${ticket.subject}</p>
        <p class="ticket-status">Status: ${ticket.status}</p>
    `;
    return ticketElement;
}



// Function to add ticket elements to the container
function addTicketToContainerIfNotExists(ticket) {
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
        const ticketElement = createTicketElements(ticket);
        ticketContainer.appendChild(ticketElement);
    }
}




