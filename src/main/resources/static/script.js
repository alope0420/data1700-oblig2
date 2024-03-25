'use strict';

// Define all existing field ids, so we can loop through them instead of copy-pasting everything 6 times
const fieldIds = ['movie', 'count', 'firstname', 'lastname', 'tel', 'email'];


$('document').ready(() => {
    $('#dark-mode-switch').change(ev => {
        $('html').attr('data-bs-theme', ev.target.checked ? 'dark' : null);
    });

    $('#client-validation-switch').click(ev => {
        $('#add-tickets-form').attr('novalidate', ev.target.checked ? null : '');
    });

    // Add validation styles when user has entered data and unfocused input
    $('#add-tickets-form input, select')
        .blur(ev => {
            if (ev.target.value) {
                ev.target.parentElement.classList.add('was-validated');
            }
        })
        // ... or when they try to submit with invalid fields
        .on('invalid', ev => {
            ev.target.parentElement.classList.add('was-validated');
        });

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

    // Clear form and reset validation
    $('#add-tickets-form').trigger('reset');
    $('#add-tickets-form .was-validated').removeClass('was-validated');

    // Post ticket order to backend
    await $.post('/tickets/add', ticket);

    // Add ticket to tickets array and refresh table
    await refreshTicketTable();
}

async function clearTickets() {
    await $.post('/tickets/clear');
    await refreshTicketTable();
}

async function refreshTicketTable() {
    // Request tickets list from backend
    let tickets = await $.get('/tickets/list');

    // Clear table body
    const table = $('#tickets-table-body');
    table.empty();

    // Re-add all tickets to table
    for (const ticket of tickets.reverse()) {
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
    let dummyInfo = await $.get('https://randomuser.me/api/?nat=no');
    dummyInfo = dummyInfo.results[0];

    const movieOptions = $('#movie option[value!=""]');
    const movieIndex = Math.floor(Math.random() * movieOptions.length);
    const ticketCount = Math.ceil(Math.min(...Array.from({length: 20}, Math.random)) * 100);

    $('#movie').val(movieOptions[movieIndex].value);
    $('#count').val(ticketCount);
    $('#firstname').val(dummyInfo.name.first);
    $('#lastname').val(dummyInfo.name.last);
    $('#tel').val(dummyInfo.phone);
    $('#email').val(dummyInfo.email);
}