"use strict";

//Hamburgar bar
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const header = document.querySelector(".header")

if (header) {

    hamburger.addEventListener("click", mobileMenu);

    function mobileMenu() {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    }

    const navLink = document.querySelectorAll(".nav-link");

    navLink.forEach(n => n.addEventListener("click", closeMenu));

    function closeMenu() {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }

    // Ändra färg på header vid scroll
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.header');
        const bars = document.querySelectorAll('.bar'); // Hämtar alla element med klassen 'bar'
        const navLogo = document.querySelector('.nav-logo')
        const navLinks = document.querySelectorAll('.nav-link')


        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // Ny bakgrundsfärg för headern
            navLogo.style.color = '#f99d5f';
            bars.forEach(bar => {
                bar.style.backgroundColor = '#f99d5f'; // Ny färg för varje 'bar' element
            });
            navLinks.forEach(link => {
                link.style.color = '#f99d5f'; // Ny textfärg
            });

        } else {
            header.style.backgroundColor = 'transparent'; // Ursprunglig bakgrundsfärg
            navLogo.style.color = 'white';
            navLinks.forEach(link => {
                link.style.color = 'white'; // Ny textfärg
            });
            bars.forEach(bar => {
                bar.style.backgroundColor = 'white'; // Ursprunglig färg för varje 'bar' element
            });
        }
    });

    // Kontroll av href
    document.querySelectorAll('a.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Kontrollera om href börjar med '#' (intern länk)
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault(); // Förhindra standardbeteendet

                const targetID = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetID);

                // Kontrollera om målelementet finns
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 88.3, // Justera för eventuell fast header
                        behavior: 'smooth'
                    });
                }
            }
            // Om href inte börjar med '#', gör ingenting (länken fungerar som vanligt)
        });
    });
}

// funktion för modal
function showModal() {
    const modal = document.getElementById('bookingConfirmationModal');
    modal.style.display = 'block';

    // stäng modal
    const closeModalButton = document.getElementById('closeModal');
    closeModalButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Stäng modal
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}


//Posta bokning
const tableBooking = document.getElementById('table-booking')

if (tableBooking) {
    tableBooking.addEventListener('submit', function bookTable(event) {
        event.preventDefault(); // Förhindrar att formuläret skickas innan valideringen
        let url = ('https://api.dollar.se/api/posttable')
        const customer_name = document.getElementById('guestname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('number').value;
        const reservation_date = document.getElementById('reservation-date').value;
        const reservation_time = document.getElementById('reservation-time').value;
        const number_of_guests = document.getElementById('guests').value
        const errorsEl = document.getElementById('errors')

        //Valedering
        let errors = [];

        if (customer_name === "") {
            errors.push("Skriv in ditt namn");
        }

        if (phone === "" || isNaN(phone)) {
            errors.push("Skriv in ditt telefonnummer");
        }

        if (email === "") {
            errors.push("Skriv in din emailadress");
        }

        if (number_of_guests === "" || isNaN(number_of_guests)) {
            errors.push("Skriv in antal gäster");
        }

        if (reservation_date === "") {
            errors.push("Välj datum");
        }

        if (reservation_time === "") {
            errors.push("Välj tid");
        }

        // Kontrollera öppettider
        const dayOfWeek = new Date(reservation_date).getDay(); // 0 = Söndag, 1 = Måndag, etc.
        const time = reservation_time;

        const isValidTime = (time >= '11:00' && time <= '21:00'); // Default öppettider Måndag - Torsdag

        switch (dayOfWeek) {
            case 0: // Söndag
                errors.push("Restaurangen är stängd på söndagar");
                break;
            case 1: // Måndag
            case 2: // Tisdag
            case 3: // Onsdag
            case 4: // Torsdag
                if (!isValidTime) {
                    errors.push("Endast bokningar mellan 11:00 och 21:00 är tillåtna");
                }
                break;
            case 5: // Fredag
                if (time < '11:00' || time > '23:00') {
                    errors.push("Endast bokningar mellan 11:00 och 01:00 är tillåtna på fredagar");
                }
                break;
            case 6: // Lördag
                if (time < '16:00' || time > '23:00') {
                    errors.push("Endast bokningar mellan 16:00 och 01:00 är tillåtna på lördagar");
                }
                break;
        }

        if (errors.length > 0) {
            //Felmeddelanden
            errorsEl.innerHTML = `
        <ul class="span-ul">
                ${errors.map(error => `<li class="span-li"> <p class="span-p"> ${error}</p></li>`).join('')}
            </ul>        `
        } else {
            let bookedTable = {
                customer_name: customer_name,
                email: email,
                phone: phone,
                reservation_date: reservation_date,
                reservation_time: reservation_time,
                number_of_guests: number_of_guests
            };

            // Skicka bokningsdata till servern
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookedTable)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Något gick fel med bokningen');
                    }
                })
                .then(data => {
                    console.log('Booking successful:', data);
                    tableBooking.reset();
                    document.getElementById('errors').innerHTML = '';
                    showModal();


                })
                .catch(error => {
                    console.error('Fel:', error);
                });
        }
    });
};

//Logga in

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', function login(event) {
    event.preventDefault();
    const url = "https://api.dollar.se/api/admin/inlog"
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const errors = []

    if (username == "" || password == "") {
        errors.push("Skriv in ditt användarnamn/lösenord")
    };

    if (errors.length > 0) {
        document.getElementById('errors-login').innerHTML = `<p>${errors}</p>`
    }


    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Inloggningen misslyckades');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.response.token);
            loginForm.reset();
        })
        .catch(error => {
            console.error('Fel vid inloggning:', error.message);
            // Här kan du lägga till kod för att hantera felaktig inloggning
        });

});