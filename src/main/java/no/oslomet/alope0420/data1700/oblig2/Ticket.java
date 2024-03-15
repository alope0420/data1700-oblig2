package no.oslomet.alope0420.data1700.oblig2;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class Ticket {

    @NotBlank
    private String movie;

    @Min(value = 1)
    @Max(value = 100)
    private Integer count;

    @NotBlank
    private String firstname;

    @NotBlank
    private String lastname;

    @Pattern(regexp = "^[2-9]\\d{7}|(?:\\+|00)\\d{6,}$")
    private String tel;

    /*
    * Validation pattern for e-mail addresses, adapted for case-insensitivity. Source: How to Find or Validate an Email Address. (n.d.).
    * Retrieved February 11, 2024, from https://www.regular-expressions.info/email.html
    */
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")
    private String email;
}
