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
        ticket[fieldId] = $('#' + fieldId).val();
    }

    // Clear form
    $("#add-tickets-form").trigger('reset');

    // Post ticket order to backend
    await $.post("/tickets/add", ticket);

    // Add ticket to tickets array and refresh table
    await refreshTicketTable();
}

async function clearTickets() {
    await $.post("/tickets/clear");
    await refreshTicketTable();
}

async function refreshTicketTable() {
    // Request tickets list from backend
    let tickets = await $.get("/tickets/list");

    // Clear table body
    const table = $('#all-tickets');
    table.empty();

    // Readd all tickets to table
    for (const ticket of tickets) {
        const row = $('<tr/>');
        table.append(row);
        for (const fieldId of fieldIds) {
            const cell = $('<td/>');
            cell.text(ticket[fieldId]);
            row.append(cell);
        }
    }
}

async function fillDummyInfo() {
    let dummyInfo = await $.get("https://randomuser.me/api/?nat=no");
    dummyInfo = dummyInfo.results[0];

    let movieOptions = $('#movie option[value!=""]');
    let movieIndex = Math.floor(Math.random() * movieOptions.length);

    $('#movie').val(movieOptions[movieIndex].value);
    $('#count').val(1 + Math.floor(Math.random() * 99));
    $('#firstname').val(dummyInfo.name.first);
    $('#lastname').val(dummyInfo.name.last);
    $('#tel').val(dummyInfo.phone);
    $('#email').val(dummyInfo.email);
}