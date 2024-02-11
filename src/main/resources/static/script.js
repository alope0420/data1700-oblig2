'use strict';

/* Define all existing field ids so we can loop through them instead of copy-pasting everything 6 times */
const fieldIds = ['movie', 'count', 'firstname', 'lastname', 'tel', 'email'];
let tickets = [];

function addTickets() {
    if (!validateForm())
        return; // Don't add tickets if form has invalid data

    // Construct ticket object
    let ticket = {};
    for (const fieldId of fieldIds) {
        ticket[fieldId] = document.getElementById(fieldId).value;
    }

    tickets.push(ticket);
    refreshTicketTable();
    clearForm();
}

function clearForm() {
    for (const fieldId of fieldIds) {
        document.getElementById(fieldId).value = '';
    }
}

function deleteAllTickets() {
    tickets = [];
    refreshTicketTable();
}

function refreshTicketTable() {
    // Clear table body
    const table = document.getElementById('allTickets');
    while (table.firstChild) {
        table.firstChild.remove();
    }

    // Readd all tickets to table
    for (const ticket of tickets) {
        const row = table.appendChild(document.createElement('tr'));
        for (const fieldId of fieldIds) {
            const cell = row.appendChild(document.createElement('td'));
            cell.innerText = ticket[fieldId];
        }
    }
}

// In a real-world project, I would simply use HTML attributes such as "required" and "pattern" in order to perform
// client-side input validation. However, it seems that the assignment specifically expects a JavaScript solution.
function validateForm() {
    // Remove any old error messages
    document.querySelectorAll('.error-message').forEach(elem => elem.remove());

    // Validate all fields and return true if all validations are successful
    return fieldIds.map(validateField).reduce((a,b) => a && b);
}

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    let errorMessage;

    if (!field.value) {
        errorMessage = `Du må angi ${field.dataset.displayName}.`;
    }
    // Number.isInteger(Number(...)) ensures we treat float values as invalid
    else if (fieldId === 'count' && (!Number.isInteger(Number(field.value)) || field.value < 1 || field.value > 20)) {
        errorMessage = 'Ugyldig antall billetter. Velg et heltall mellom 1 og 20.';
    }
    // Regex matches 8-digit numbers in the range 20 00 00 00 - 99 99 99 99
    else if (fieldId === 'tel' && !field.value.match(/^[2-9]\d{7}$/)) {
        errorMessage = 'Ugyldig telefonnummer. Velg et 8-sifret norsk nummer.';
    }
    // Regex copied from https://www.regular-expressions.info/email.html
    else if (fieldId === 'email' && !field.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
        errorMessage = 'Ugyldig e-postadresse.';
    }
    else {
        // If we get to this point, all validations were successful
        return true;
    }

    // Otherwise, add the error message after the corresponding input field
    const errorMessageElement = document.createElement('span');
    errorMessageElement.classList.add('error-message');
    errorMessageElement.innerText = errorMessage;
    field.parentElement.appendChild(errorMessageElement);
    return false;
}