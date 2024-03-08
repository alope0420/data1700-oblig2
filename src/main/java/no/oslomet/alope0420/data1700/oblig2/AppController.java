package no.oslomet.alope0420.data1700.oblig2;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@Validated
@RestController
public class AppController implements ErrorController {

    private final ArrayList<Ticket> tickets = new ArrayList<>();

    @PostMapping("/tickets/add")
    public void addTickets(@Valid Ticket ticket) {
        tickets.add(ticket);
    }

    @GetMapping("/tickets/list")
    public ArrayList<Ticket> listTickets() {
        return tickets;
    }

    @PostMapping("/tickets/clear")
    public void clearTickets() {
        tickets.clear();
    }

    @RequestMapping("/error")
    public String handleError(HttpServletResponse response) {
        return "<img style=\"display:block;margin:auto\" " +
                "src=\"https://http.cat/" + response.getStatus() +"\">";
    }
}
