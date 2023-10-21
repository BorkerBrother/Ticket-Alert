



// Function to create and populate the HTML elements for each ticket
function createTicketElements(ticket) {
    const ticketElement = document.createElement("div");
    ticketElement.classList.add("ticket");
    ticketElement.innerHTML = `
        <h2 class="ticket-title">Ticket #${ticket.id}</h2>
        <p class="ticket-summary">Summary: ${ticket.summary}</p>
        <p class="ticket-status">Status: ${ticket.status}</p>
    `;
    return ticketElement;
}

// Function to add ticket elements to the container
function addTicketsToContainer(tickets) {
    const ticketContainer = document.getElementById("ticketContainer");
    tickets.forEach((ticket) => {
        const ticketElement = createTicketElements(ticket);
        ticketContainer.appendChild(ticketElement);
    });
}

// Function to add ticket elements to the container
function addTicketToContainer(ticket) {
    const ticketContainer = document.getElementById("ticketContainer");
    const ticketElement = createTicketElements(ticket);
    ticketContainer.appendChild(ticketElement);

}

