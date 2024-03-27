'use strict';

// Define all existing field ids, so we can loop through them instead of copy-pasting everything 6 times
const fieldIds = ['movie', 'count', 'firstname', 'lastname', 'tel', 'email'];

$('document').ready(async () => {
    $('#dark-mode-switch').change(ev => {
        $('html').attr('data-bs-theme', ev.currentTarget.checked ? 'dark' : null);
    });

    $('#client-validation-switch').click(ev => {
        $('#add-tickets-form').attr('novalidate', ev.currentTarget.checked ? null : true);
    });

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
        await $.post('/tickets/add', ticket).fail(showHttpErrorToast);
        await refreshTicketTable();
        showToast('Billettene ble kjøpt', 'success');
    });
}

async function clearTickets() {
    await visualizeAsyncOperation('#clear-tickets-button', async () => {
        await $.post('/tickets/clear').fail(showHttpErrorToast);
        await refreshTicketTable();
        showToast('Alle billettene ble slettet', 'success');
    });
}

async function refreshTicketTable() {
    // Request tickets list from backend
    let tickets = await $.get('/tickets/list').fail(showHttpErrorToast);

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

// Generalized utility function for disabling a button and changing its content while waiting for an async operation.
// I use this to show a Bootstrap spinner while resolving a related HTTP request.
// Not sure if this is a good design pattern - feedback welcome.
async function visualizeAsyncOperation(elemSelector, operation) {
    try {
        $(elemSelector).prop('disabled', true);
        $(elemSelector).find('.async-operation-inactive').addClass('d-none');
        $(elemSelector).find('.async-operation-active').removeClass('d-none');

        // Artificial delay to illustrate functionality better TODO: remove
        await new Promise(resolve => setTimeout(resolve, 500));
        await operation();

    } finally {
        $(elemSelector).find('.async-operation-active').addClass('d-none');
        $(elemSelector).find('.async-operation-inactive').removeClass('d-none');
        $(elemSelector).prop('disabled', false);
    }
}

// Display toast message to user
function showToast(text, category) {
    const toast = $('#toast-template').clone().attr('id', null);
    toast.find('.toast-body').html(text);

    // Add bootstrap color scheme if specified
    if (category)
        toast.addClass(`text-bg-${category}`);

    // Add toast to DOM, register in Bootstrap, and display to user
    $('.toast-container').append(toast);
    const instance = bootstrap.Toast.getOrCreateInstance(toast);
    instance.show();

    // Add fade-out effect when toast is going to be hidden
    toast.on('hide.bs.toast', () => toast.addClass('fade-out'));

    // Clean up once toast is no longer visible
    toast.on('hidden.bs.toast', () => {
        instance.dispose();
        toast.remove();
    });
}

// Construct error message from HTTP error object and display as toast message
function showHttpErrorToast(error) {
    error = error.responseJSON;
    showToast(`Status ${error.status} ${error.error}:<br/>${error.message}`, 'danger');
}