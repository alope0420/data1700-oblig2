package no.oslomet.alope0420.data1700.oblig2;

import jakarta.validation.constraints.*;

public class Ticket {

    @NotBlank
    public String movie;

    @Min(value = 1)
    @Max(value = 100)
    public Integer count;

    @NotBlank
    public String firstname;

    @NotBlank
    public String lastname;

    @Pattern(regexp = "^[2-9]\\d{7}|(?:\\+|00)\\d{6,}$")
    public String tel;

    /*
    * Validation pattern for e-mail addresses, adapted for case-insensitivity. Source: How to Find or Validate an Email Address. (n.d.).
    * Retrieved February 11, 2024, from https://www.regular-expressions.info/email.html
    */
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")
    public String email;

    public Ticket(String movie, Integer count, String firstname, String lastname, String tel, String email) {
        this.movie = movie;
        this.count = count;
        this.firstname = firstname;
        this.lastname = lastname;
        this.tel = tel;
        this.email = email;
    }
}
