document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const inputs = form.querySelectorAll('input, textarea');

    // Mezők eseményfigyelői a valós idejű validációhoz
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
            }
        });
        
        // Blur esemény a pontosabb validációhoz
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });

    // Űrlap elküldése
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Sikeres küldés esetén
            showMessage('Az űrlap sikeresen elküldve! Köszönjük a visszajelzést!', 'success');
            form.reset();
            
            // Eltávolítjuk a valid státusz osztályokat
            inputs.forEach(input => {
                input.classList.remove('is-valid');
            });
            
            // 3 másodperc után eltűnik az üzenet
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = '';
            }, 3000);
        } else {
            showMessage('Kérjük, javítsa ki a pirossal jelölt hibákat!', 'error');
        }
    });

    // Egyedi mező validáció
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Kötelező mező ellenőrzése
        if (field.required && value === '') {
            isValid = false;
            errorMessage = 'Kötelező mező!';
        }
        
        // Mezőspecifikus validációk
        if (isValid) {
            switch(field.id) {
                case 'name':
                case 'subject':
                    if (value.length < 10) {
                        isValid = false;
                        errorMessage = 'Minimum 10 karakter szükséges!';
                    }
                    break;
                    
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        isValid = false;
                        errorMessage = 'Érvénytelen email formátum!';
                    }
                    break;
                    
                case 'phone':
                    if (!/^[\d+\-\s]{10,}$/.test(value) || value.replace(/[^\d]/g, '').length < 10) {
                        isValid = false;
                        errorMessage = 'Érvénytelen telefonszám (min. 10 számjegy)!';
                    }
                    break;
                    
                case 'message':
                    if (value.length < 10) {
                        isValid = false;
                        errorMessage = 'Az üzenet túl rövid (min. 10 karakter)!';
                    }
                    break;
            }
        }
        
        // Státusz beállítása
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            if (field.nextElementSibling && field.nextElementSibling.classList.contains('invalid-feedback')) {
                field.nextElementSibling.textContent = '';
            }
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            if (field.nextElementSibling && field.nextElementSibling.classList.contains('invalid-feedback')) {
                field.nextElementSibling.textContent = errorMessage;
            }
            field.focus();
        }
        
        return isValid;
    }

    // Visszajelzés megjelenítése
    function showMessage(msg, type) {
        formMessage.textContent = msg;
        formMessage.className = `alert alert-${type}`;
    }
});