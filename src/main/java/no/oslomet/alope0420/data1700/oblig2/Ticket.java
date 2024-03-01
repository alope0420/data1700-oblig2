package no.oslomet.alope0420.data1700.oblig2;

public class Ticket {
    public String movie;
    public Integer count;
    public String firstname;
    public String lastname;
    public String tel;
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
