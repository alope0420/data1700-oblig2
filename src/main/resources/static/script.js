'use strict';

// Define all existing field ids, so we can loop through them instead of copy-pasting everything 6 times
const fieldIds = ['movie', 'count', 'firstname', 'lastname', 'tel', 'email'];

$('document').ready(() => {
    $('#dark-mode-switch').change(ev => {
        $('html').attr('data-bs-theme', ev.currentTarget.checked ? 'dark' : null);
    });

    $('#client-validation-switch').click(ev => {
        $('#add-tickets-form').attr('novalidate', ev.currentTarget.checked ? null : true);
    });

    // Add validation styles when user has entered data and unfocused input
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

    $('#add-tickets-form').submit(ev => {
        ev.preventDefault();
        addTickets();
    });

    $('#fill-dummy-info-button').click(fillDummyInfo);
    $('#clear-tickets-button').click(clearTickets);
    refreshTicketTable();
})

async function addTickets() {
    try {
        // Disable button and show spinner
        $('#add-tickets-button').prop('disabled', true);
        $('#add-tickets-button i').removeClass('d-none');

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

    } finally {
        // Hide spinner on button
        $('#add-tickets-button').prop('disabled', false);
        $('#add-tickets-button i').addClass('d-none');
    }
}

async function clearTickets() {
    try {
        // Disable button and show spinner
        $('#clear-tickets-button').prop('disabled', true);
        $('#clear-tickets-button i').removeClass('d-none');

        await $.post('/tickets/clear');
        await refreshTicketTable();

    } finally {
        // Hide spinner on button
        $('#clear-tickets-button').prop('disabled', false);
        $('#clear-tickets-button i').addClass('d-none');
    }
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
    try {
        // Disable button and change icon to spinner
        $(this).prop('disabled', true);
        $(this).find('.bi').addClass('d-none');
        $(this).find('.spinner-border').removeClass('d-none');

        // Get dummy information from API, and take first result only
        let dummyInfo = await $.get('https://randomuser.me/api/?nat=no');
        dummyInfo = dummyInfo.results[0];

        // Generate random movie choice and ticket count
        const movieOptions = $('#movie option[value!=""]');
        const movieIndex = Math.floor(Math.random() * movieOptions.length);
        const ticketCount = Math.ceil(Math.min(...Array.from({length: 20}, Math.random)) * 100);

        // Fill form with dummy values
        $('#movie').val(movieOptions[movieIndex].value);
        $('#count').val(ticketCount);
        $('#firstname').val(dummyInfo.name.first);
        $('#lastname').val(dummyInfo.name.last);
        $('#tel').val(dummyInfo.phone);
        $('#email').val(dummyInfo.email);

    } finally {
        // Enable button and change icon back
        $(this).find('.bi').removeClass('d-none');
        $(this).find('.spinner-border').addClass('d-none');
        $(this).prop('disabled', false);
    }
}