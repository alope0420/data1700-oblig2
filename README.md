DATA1700 &ndash; Oblig 2
========================
OsloMet-brukernavn: alope0420

GitHub-brukernavn: alope0420

GitHub-repo URL: https://github.com/alope0420/data1700-oblig2

GitHub Pages (kun frontend): https://alope0420.github.io/data1700-oblig2/src/main/resources/static/

Fullt navn: Alexander Benjamin Rød Opedal

Kort beskrivelse av applikasjon:<br>
Enkel applikasjon for kjøp av kinobilletter.
Frontenden består av HTML/CSS/JS
    og er stylet med Bootstrap for et responsivt og moderne design,
    mens backenden er Java-basert og kjører Spring Boot.
Brukeren velger film og antall billetter, oppgir litt personalia og trykker på &laquo;Kjøp billetter&raquo;.
Før innsending blir inndataene validert, og Bootstrap brukes til å markere eventuelle feil og mangler i rødt.
Det er egne tilleggsvalideringer for
    antall,
    telefonnummer
    og e-postadresse.
Hvis valideringen lykkes, blir dataene lagret i et objekt som sendes til backenden med en POST-forespørsel.
Backenden mottar billettobjektet via en RestController og dytter det inn i en matrise.
Når frontenden får beskjed om at forespørselen var vellykket,
    sender den en GET-forespørsel for å hente ut den oppdaterte matrisen.
Denne mates så ut i en tabell nederst på nettsiden,
    og skjemaet tømmes, slik at brukeren kan gjøre en ny bestilling.
Brukeren kan trykke på &laquo;Slett alle billettene&raquo;
    for å sende en POST-forespørsel som tømmer matrisen og dermed også tabellen.

Utover kravene i oppgaveteksten har applikasjonen også
    Bootstrap &laquo;toasts&raquo; som gir tilbakemelding om vellykkede/mislykkede forespørsler,
    en knapp for mørk modus,
    en knapp for automatisk utfylling av dummy-data i skjemaet (for testformål),
    og en innstillingsmeny som åpnes i et Bootstrap &laquo;offcanvas&raquo;.
Denne inneholder en bryter for å deaktivere valideringene på frontenden, slik at man også kan teste valideringene på backenden.