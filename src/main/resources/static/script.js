'use strict';

// Define all existing field ids, so we can loop through them instead of copy-pasting everything 6 times
const fieldIds = ['movie', 'count', 'firstname', 'lastname', 'tel', 'email'];

$('document').ready(() => {

    $('#add-tickets-form').submit(ev => {
        ev.preventDefault();
        addTickets();
    });

    $('#fill-dummy-info-button').click(fillDummyInfo);
    $('#clear-tickets-button').click(clearTickets);
    refreshTicketTable();
})

async function addTickets() {
    // Construct ticket object
    let ticket = {};
    for (const fieldId of fieldIds) {
        ticket[fieldId] = document.getElementById(fieldId).value;
    }

    // Clear form
    $("#add-tickets-form").trigger('reset');

    // ...
    await $.post("/tickets/add", ticket);

    // Add ticket to tickets array and refresh table
    await refreshTicketTable();
}

async function clearTickets() {
    await $.get("/tickets/clear");
    await refreshTicketTable();
}

async function refreshTicketTable() {
    // Request tickets list from backend
    let tickets = await $.get("/tickets/list");

    // TODO: Rewrite with JQuery
    // Clear table body
    const table = document.getElementById('all-tickets');
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

async function fillDummyInfo() {
    let dummyInfo = await $.get("https://randomuser.me/api/?nat=no");
    dummyInfo = dummyInfo.results[0];

    let movieOptions = $('#movie option[value!=""]');

    $('#movie').val(movieOptions[Math.floor(Math.random() * movieOptions.length)].value);
    $('#count').val(Math.floor(Math.random() * 100));
    $('#firstname').val(dummyInfo.name.first);
    $('#lastname').val(dummyInfo.name.last);
    $('#tel').val(dummyInfo.phone);
    $('#email').val(dummyInfo.email);
}