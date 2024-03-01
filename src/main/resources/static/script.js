'use strict';

// Define all existing field ids so we can loop through them instead of copy-pasting everything 6 times
const fieldIds = ['movie', 'count', 'firstname', 'lastname', 'tel', 'email'];
let tickets = [];

function addTickets() {
    // Construct ticket object
    let ticket = {};
    for (const fieldId of fieldIds) {
        ticket[fieldId] = document.getElementById(fieldId).value;
    }

    // Add ticket to tickets array and refresh table
    tickets.push(ticket);
    refreshTicketTable();

    // Clear form
    document.getElementById('buyTicketForm').reset();
}

function deleteAllTickets() {
    tickets = [];
    refreshTicketTable();
}

function refreshTicketTable() {
    // Clear table body
    const table = document.getElementById('allTickets');
    table.replaceChildren();

    // Readd all tickets to table
    for (const ticket of tickets) {
        const row = table.appendChild(document.createElement('tr'));
        for (const fieldId of fieldIds) {
            const cell = row.appendChild(document.createElement('td'));
            cell.innerText = ticket[fieldId];
        }
    }
}