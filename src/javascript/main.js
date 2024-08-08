"use strict";

//Hamburgar bar
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

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
window.addEventListener('scroll', function() {
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
    anchor.addEventListener('click', function(e) {
        // Kontrollera om href börjar med '#' (intern länk)
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault(); // Förhindra standardbeteendet

            const targetID = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetID);

            // Kontrollera om målelementet finns
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 68, // Justera för eventuell fast header
                    behavior: 'smooth'
                });
            }
        }
        // Om href inte börjar med '#', gör ingenting (länken fungerar som vanligt)
    });
});
