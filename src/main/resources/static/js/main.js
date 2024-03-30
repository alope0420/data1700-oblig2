'use strict';

import {visualizeAsyncOperation, showToast, showHttpErrorToast} from './util.js';

// Define all existing field ids, so we can loop through them instead of copy-pasting everything 6 times
const fieldIds = ['movie', 'count', 'firstname', 'lastname', 'tel', 'email'];

$('document').ready(async () => {
    // Add validation styles when user has unfocused an input after entering data
    $('#add-tickets-form input, select')
        .blur(ev => {
            if ($(ev.currentTarget).val()) {
                $(ev.currentTarget).parent().addClass('was-validated');
            }
        })
        // ... or when they try to submit with invalid fields
        .on('invalid', ev => {
            $(ev.currentTarget).parent().addClass('was-validated');
        });

    $('#add-tickets-form').submit(async ev => {
        ev.preventDefault();
        await addTickets();
    });

    $('#dark-mode-button').click(() => {
        $('html').attr('data-bs-theme', (index, attr) => attr ? null : 'dark');
    });

    $('#client-validation-switch').click(ev => {
        $('#add-tickets-form').attr('novalidate', ev.currentTarget.checked ? null : true);
    });

    $('#fill-dummy-info-button').click(fillDummyInfo);
    $('#clear-tickets-button').click(clearTickets);
    await refreshTicketTable();
})

async function addTickets() {
    await visualizeAsyncOperation('#add-tickets-button', async () => {
        // Construct ticket object
        let ticket = {};
        for (const fieldId of fieldIds) {
            ticket[fieldId] = $('#' + fieldId).val();
        }

        // Clear form and reset validation
        $('#add-tickets-form').trigger('reset');
        $('#add-tickets-form .was-validated').removeClass('was-validated');

        // Post ticket order to backend, then refresh table
        await $.post('/tickets/add', ticket)
            .fail(xhr => showHttpErrorToast(xhr, 'Kjøp av billetter mislyktes.'));
        await refreshTicketTable();
        showToast('Billettene ble kjøpt', 'success');
    });
}

async function clearTickets() {
    await visualizeAsyncOperation('#clear-tickets-button', async () => {
        await $.post('/tickets/clear')
            .fail(xhr => showHttpErrorToast(xhr, 'Sletting av billetter mislyktes.'));
        await refreshTicketTable();
        showToast('Alle billettene ble slettet', 'success');
    });
}

async function refreshTicketTable() {
    // Request tickets list from backend
    let tickets = await $.get('/tickets/list')
        .fail(xhr => showHttpErrorToast(xhr, 'Henting av billetter mislyktes.'));

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

// Fill the form with dummy data for testing purposes
async function fillDummyInfo() {
    await visualizeAsyncOperation('#fill-dummy-info-button', async () => {
        // Get dummy information from API, and take first result only
        let dummyInfo = await $.get('https://randomuser.me/api/?nat=no');
        dummyInfo = dummyInfo.results[0];

        // Generate random movie choice and ticket count
        const movieOptions = $('#movie option:not([disabled])');
        const movieIndex = Math.floor(Math.random() * movieOptions.length);
        const ticketCount = Math.ceil(Math.min(...Array.from({length: 20}, Math.random)) * 100);

        // Fill form with dummy values
        $('#movie').val(movieOptions[movieIndex].value);
        $('#count').val(ticketCount);
        $('#firstname').val(dummyInfo.name.first);
        $('#lastname').val(dummyInfo.name.last);
        $('#tel').val(dummyInfo.phone);
        $('#email').val(dummyInfo.email);
    });
}