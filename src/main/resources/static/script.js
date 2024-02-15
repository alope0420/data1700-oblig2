'use strict';

// Define all existing field ids so we can loop through them instead of copy-pasting everything 6 times
const fieldIds = ['movie', 'count', 'firstname', 'lastname', 'tel', 'email'];

// Regex patterns for field validation
const validationPatterns = {
    // For movie, firstname, and last name, no validation is needed apart from checking for non-emptiness:
    // movie is a select control and therefore has no invalid values;
    // as for names, we cannot really make any assumptions about what a valid or invalid name might look like.
    // https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/

    // Pattern for non-negative integers. Accepts only numeric characters; floats are considered invalid.
    'count': /^\d+$/,

    // Validation pattern for phone numbers. Accepts 8-digit numbers in the range 20 00 00 00 - 99 99 99 99,
    // or foreign numbers with an international call prefix (+ or 00) followed by at least 6 digits.
    'tel': /^(?:[2-9]\d{7}|(?:\+|00)\d{6,})$/,

    // Validation pattern for e-mail addresses. Source: How to Find or Validate an Email Address. (n.d.).
    // Retrieved February 11, 2024, from https://www.regular-expressions.info/email.html
    'email': /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
}

let tickets = [];

function addTickets() {
    if (!validateForm())
        return; // Don't add tickets if form has invalid data

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

// In a real-world project, it would probably be preferable to use HTML attributes such as "required" and "pattern"
// for client-side input validation. However, it seems that the assignment specifically expects a JavaScript solution.
function validateForm() {
    // Remove any old error messages
    document.querySelectorAll('.error-message').forEach(elem => elem.remove());

    // Validate all fields and return true if all validations are successful
    return fieldIds.map(validateField).every(x => x);
}

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    let errorMessage;

    if (!field.value) {
        errorMessage = `Du må angi ${field.dataset.displayName}.`;
    }
    else if (validationPatterns[fieldId] && !validationPatterns[fieldId].test(field.value)) {
        errorMessage = `Ugyldig ${field.dataset.displayName}.`;
    }
    else if (fieldId === 'count' && field.value < 1) {
        errorMessage = 'Du må bestille minst én billett.';
    }
    else if (fieldId === 'count' && field.value > 100) {
        errorMessage = 'Du kan ikke bestille mer enn 100 billetter om gangen.';
    }
    else {
        // All validation checks passed
        return true;
    }

    // Otherwise, add the error message after the corresponding input field
    const errorMessageElement = document.createElement('span');
    errorMessageElement.classList.add('error-message');
    errorMessageElement.innerText = errorMessage;
    field.parentElement.appendChild(errorMessageElement);
    return false;
}