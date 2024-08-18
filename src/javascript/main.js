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
if (loginForm) {

    loginForm.addEventListener('submit', function login(event) {
        event.preventDefault();
        const url = "https://api.dollar.se/api/admin/inlog"
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const errors = []

        if (username == "" || password == "") {
            errors.push("Skriv in ditt användarnamn/lösenord");
        };

        if (errors.length > 0) {
            document.getElementById('errors-login').innerHTML = `<p>${errors}</p>`
            return;

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
                window.location.href = 'cms.html';
                loginForm.reset();
                document.getElementById('errors-login').innerHTML = ``

            })
            .catch(error => {
                console.error('Fel vid inloggning:', error.message);
                document.getElementById('errors-login').innerHTML = `<p>Fel användarnamn/lösenord</p>`

            });

    });
};

// Kontrollera token så snart sidan laddas
const containerBigCms = document.getElementById("container-big-cms");
if (containerBigCms) {
    window.onload = init()
    function init() {
        if (!localStorage.getItem('token')) {
            window.location.href = 'login.html'
        }
    }


    const menuForm = document.getElementById('menu-form');
    const menySend = document.getElementById('menu-send');
    // Tar bort meddelanden mennyn tillagd
    function clearMessage() {
        menySend.innerHTML = "";
    }
    if (containerBigCms) {
        document.getElementById('category').addEventListener('input', clearMessage);
        document.getElementById('description').addEventListener('input', clearMessage);
        document.getElementById('price').addEventListener('input', clearMessage);


        menuForm.addEventListener("submit", function (event) {
            event.preventDefault();
            let token = localStorage.getItem('token')
            const category = document.getElementById('category').value;
            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;
            const price = document.getElementById('price').value;
            const spanErrors = document.getElementById('errors');
            let url = "https://api.dollar.se/api/cms";

            //validering
            let errors = [];

            if (name === "") {
                errors.push('Välj kategori');
            }

            if (description === "") {
                errors.push('Skriv en beskrivning');
            }

            if (price === "" || isNaN(price)) {
                errors.push('Skriv in ett giltigt pris');
            }

            if (errors.length > 0) {
                spanErrors.innerHTML = errors.join('<br>');
                return;
            }

            let menu = {
                category: category,
                name: name,
                description: description,
                price: price
            };

            //post anrop
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Lägger till Authorization header med token

                },
                body: JSON.stringify(menu)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Meny kunde inte läggas till');
                    }
                })
                .then(data => {
                    console.log('Meny tillagd:', data);
                    location.reload();
                    menuForm.reset();
                    menySend.innerHTML = "Meny tillagd";
                })
                .catch(error => {
                    console.error('Fel vid tillägg av meny:', error.message);
                });
        });
    }


    // Hämta elementet som ska fyllas med CMS-innehåll
    const cmsContent = document.querySelector('.get-div-content');

    async function fetchCmsContent() {
        let url = "https://api.dollar.se/api/cms";
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Kunde inte hämta CMS-innehåll');
            }

            const data = await response.json();

            displayCmsContent(data);

        } catch (error) {
            console.error('Fel vid hämtning av CMS-innehåll:', error.message);
            if (cmsContent) {
                cmsContent.innerHTML = `<p>${error.message}</p>`;
            }
        }
    }

    // Funktion för att visa data på sidan
    function displayCmsContent(data) {

        console.log(data)
        // Rensa tidigare innehåll
        cmsContent.innerHTML = '';

        // Kontrollera om data är en array
        if (Array.isArray(data.results)) {
            data.results.forEach(item => {
                cmsContent.innerHTML += `
                <div class="cms-item">
                    <h1>${item.category}</h1>
                    <h2>${item.name}</h2>
                    <p>${item.description}</p>
                    <p>Pris: ${item.price} kr</p>
                    <button class="Delete" data-id="${item.id}">Radera</button>
                    <button class="Update" data-id="${item.id}">Upptadera</button>

                </div>
            `;
            });
        } else {
            // Om data inte är en array, visa bara ett objekt
            cmsContent.innerHTML = `
            <div class="cms-item">
                <h1>${data.name}</h1>
                <p>${data.description}</p>
                <p>Pris: ${data.price} kr</p>
                <button id="Delete" data-id="${data.id}">Radera</button>
                <button id="Update" data-id="${data.id}">Upptadera</button>


            </div>
        `;
        }
    }

    //Uppdatera 
    document.addEventListener('click', function(event) {
        if(event.target.classList.contains('Update')) {
            let id = event.target.dataset.id;
            const token = localStorage.getItem('token');
            let url = `https://api.dollar.se/api/cms/${id}`;
    
            fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    throw new Error("Misslyckad hämtning");
                }
            })
            .then(data => {
                const item = data.results[0];
                const category = item.category;
                const name = item.name;
                const description = item.description;
                const price = item.price;
    
                // Fyll i modalen med hämtade data
                document.getElementById('updateCategory').value = category;
                document.getElementById('updateName').value = name;
                document.getElementById('updateDescription').value = description;
                document.getElementById('updatePrice').value = price;
    
                // Visa modalen
                const modal = document.getElementById('updateModal');
                modal.style.display = "block";
    
                // Hantera uppdateringsformuläret
                const updateForm = document.getElementById('updateForm');
                updateForm.onsubmit = function(e) {
                    e.preventDefault();
    
                    const updatedItem = {
                        category: document.getElementById('updateCategory').value,
                        name: document.getElementById('updateName').value,
                        description: document.getElementById('updateDescription').value,
                        price: document.getElementById('updatePrice').value
                    };
    
                    fetch(url, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(updatedItem)
                    })
                    .then(response => {
                        if(response.ok) {
                            alert('Maträtten uppdaterades!');
                            modal.style.display = "none"; // Stäng modalen efter uppdatering
                            location.reload(); // Uppdatera sidan för att visa ändringar
                        } else {
                            throw new Error("Misslyckad uppdatering");
                        }
                    })
                    .catch(error => console.error('Error updating item:', error));
                };
    
                // Stäng modal om användaren klickar på "stäng" knappen
                document.querySelector('.close').addEventListener('click', function() {
                    modal.style.display = "none";
                });
    
                // Stäng modal om användaren klickar utanför modalen
                window.addEventListener('click', function(event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                });
            })
            .catch(error => console.error('Error fetching item:', error));
        }
    });
    

    //Radera
    document.addEventListener('click', async function (event) {
        if (event.target.classList.contains('Delete')) {
            try {
                let id = event.target.dataset.id;
                let url = `https://api.dollar.se/api/cms/${id}`;

                const token = localStorage.getItem('token');

                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Raderingen misslyckades');
                }

                const data = await response.json();
                console.log('Raderingen lyckades:', data);

                // Ta bort det raderade elementet från DOM
                event.target.closest('.cms-item').remove();

            } catch (error) {
                console.error('Fel vid Radering:', error.message);
            }
        }
    });


    // Anropa fetchCmsContent när sidan laddas
    document.addEventListener('DOMContentLoaded', fetchCmsContent);
}

const menuContainer = document.getElementById('get-menu');
if (menuContainer) {
    //Get anrop med filtrerad kategori
    document.addEventListener('DOMContentLoaded', () => {
        const getHamburgare = document.getElementById('hamburgare-get');
        const getDryck = document.getElementById('dryck-get');
        const getEfterratt = document.getElementById('efterratt-get');
        const menuContainer = document.getElementById('get-menu');

        let fullMenu = []; // Variabel för att lagra hela menyn

        fetchMenu();

        getHamburgare.addEventListener('click', () => {
            displayMenuItems(filterMenu('Hamburgare'));
            setActiveCategory(getHamburgare);

        });

        getDryck.addEventListener('click', () => {
            displayMenuItems(filterMenu('Vin'));
            setActiveCategory(getDryck
            );

        });

        getEfterratt.addEventListener('click', () => {
            displayMenuItems(filterMenu('Efterrätt'));
            setActiveCategory(getEfterratt);

        });

        function fetchMenu() {
            const url = 'https://api.dollar.se/api/getmenu';

            fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Hämtningen misslyckades');
                    }
                    return response.json();
                })
                .then(data => {
                    fullMenu = data.results; // Spara hela menyn
                    displayMenuItems(fullMenu); // Visa hela menyn som standard
                })
                .catch(error => {
                    console.error('Hämtning misslyckades', error.message);
                });
        }

        function filterMenu(category) {
            return fullMenu.filter(item => item.category === category);
        }

        function displayMenuItems(items) {
            menuContainer.innerHTML = ''; 

            if (Array.isArray(items)) {
                items.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('menu-item');

                    const itemName = document.createElement('h3');
                    itemName.textContent = item.name;

                    const itemDescription = document.createElement('p');
                    itemDescription.textContent = item.description;

                    const itemPrice = document.createElement('span');
                    itemPrice.textContent = `Pris: ${item.price} kr`;

                    itemElement.appendChild(itemName);
                    itemElement.appendChild(itemDescription);
                    itemElement.appendChild(itemPrice);

                    menuContainer.appendChild(itemElement);
                });
            } else {
                console.error('Mysslyckades', items);
            }
        }
        function setActiveCategory(activeButton) {
            [getHamburgare, getDryck, getEfterratt].forEach(button => {
                button.classList.remove('active');
            });

            activeButton.classList.add('active');
        }
    });
};
const containerBigBooking = document.getElementById('container-big-booking')

if(containerBigBooking) {
    window.onload = init()
    function init() {
        if (!localStorage.getItem('token')) {
            window.location.href = 'login.html'
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
    const getBooking = document.getElementById('get-booking');
    const getBookingContent = document.getElementById('get-booking-content');
    const urlPostTable = "https://api.dollar.se/api/posttable"; 
    const token = localStorage.getItem('token')

    // Hämtar bokningar
    fetch(urlPostTable, {
        method: "GET",  
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`

        }
    })
    .then(response => {
        if(response.ok) {
            return response.json();           
        } else { 
            throw new Error('Hämtningen misslyckad');
        }
    })
    .then(data => {
        console.log(data); 

        const results = data.results || [];
        
        if(results.length === 0) {
            getBooking.innerHTML = '<h1 class="booking-h1">Inga bokningar finns</h1>';
        } else {
            getBooking.innerHTML = '<h1 class="booking-h1">Bokningar:</h1>';

            // Visa varje bokning
            getBookingContent.innerHTML = results.map(booking => `
                <div class="booking-item" data-id="${booking.id}">
                    <p><strong>Kundnamn:</strong> ${booking.customer_name || 'Ingen kundnamn'}</p>
                    <p><strong>Telefon:</strong> ${booking.phone || 'Ingen telefon'}</p>
                    <p><strong>Email:</strong> ${booking.email || 'Ingen email'}</p>
                    <p><strong>Datum:</strong> ${new Date(booking.reservation_date).toLocaleDateString() || 'Ingen datum'}</p>
                    <p><strong>Tid:</strong> ${booking.reservation_time || 'Ingen tid'}</p>
                    <p><strong>Antal gäster:</strong> ${booking.number_of_guests || 'Ingen antal gäster'}</p>
                    <button class="delete-booking" data-id="${booking.id}">Ta Bort</button>
                </div>
            `).join('');
        }
    })
    .catch(error => {
        console.error('Fel:', error);
        getBooking.innerHTML = "<h1>Fel vid hämtning av data</h1>";
    });

    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-booking')) {
            const id = event.target.dataset.id;
            const url = `https://api.dollar.se/api/posttable/${id}`;
            const token = localStorage.getItem('token');

            fetch(url, {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Misslyckad radering");  
                }
                return response.json(); 
            })
            .then(data => {
                console.log('Raderingen lyckades:', data);
                // Ta bort det aktuella bokningselementet
                event.target.closest('.booking-item').remove();
            })
            .catch(error => {
                console.error('Fel:', error);  
            });
        }
    });
});
};