document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const addButton = document.querySelector('.add-button');
    const submitButton = document.querySelector('.submit-button');

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    const modal = document.createElement('div');
    modal.className = 'modal';
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '✖';
    modal.appendChild(closeButton);
    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    function showModal(message, table) {
        modal.innerHTML = `<p>${message}</p>`;
        modal.appendChild(table);
    
        const timeLabel = document.createElement('label');
        timeLabel.textContent = 'Выберите время заказа: ';
        timeLabel.className = 'time-label';
    
        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.className = 'input-time';
        timeLabel.appendChild(timeInput);
    
        modal.appendChild(timeLabel);
    
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Оформить';
        submitButton.className = 'submit-button';
        modal.appendChild(submitButton);
    
        modal.appendChild(closeButton);
        overlay.style.display = 'block';
        modal.style.display = 'block';
    
        submitButton.addEventListener('click', () => {
            const selectedTime = timeInput.value;
            const currentTime = new Date();
            const selectedDate = new Date(currentTime.toDateString() + ' ' + selectedTime);
    
            if (selectedDate < currentTime) {
                timeInput.style.borderColor = 'red';
                alert("Мы не умеем перемещаться во времени. Выберите время позже, чем текущее.");
            } 
            else {
                closeModal();
            }
        });
    }
    
    function closeModal() {
        overlay.style.display = 'none';
        modal.style.display = 'none';
    }

    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    function updateRemoveButtons() {
        const beverages = document.querySelectorAll('.beverage');
        beverages.forEach(beverage => {
            if (beverage.querySelector('.remove-button')) {
                beverage.querySelector('.remove-button').remove();
            }
            if (beverages.length > 1) {
                addRemoveButton(beverage);
            }
        });
    }

    function getBeverageWord(count) {
        const num = count % 100;
        const num1 = num % 10;

        if (num > 10 && num < 20) 
            return 'напитков';
        if (num1 > 1 && num1 < 5) 
            return 'напитка';
        if (num1 === 1) return 
            'напиток';

        return 'напитков';
    }

    function createOrderTable() {
        const beverages = document.querySelectorAll('.beverage');
        const table = document.createElement('table');
        table.innerHTML = '<tr><th>Напиток</th><th>Молоко</th><th>Дополнительно</th><th>Пожелания</th></tr>';
    
        beverages.forEach(beverage => {
            const drinkType = beverage.querySelector('select').value;
            const milkRadio = beverage.querySelector('input[type="radio"]:checked');
            const milkType = milkRadio ? milkRadio.nextElementSibling.textContent.trim() : 'не указано';
            const additions = Array.from(beverage.querySelectorAll('input[type="checkbox"]:checked'))
                                   .map(input => input.nextElementSibling.textContent.trim())
                                   .join(', ');
            const wishes = beverage.querySelector('textarea').value.trim();
            const row = `<tr><td>${drinkType}</td><td>${milkType}</td><td>${additions}</td><td>${wishes}</td></tr>`;
            table.innerHTML += row;
        });
    
        return table;
    }

    addButton.addEventListener('click', () => {
        const newIndex = document.querySelectorAll('.beverage').length + 1;
        const newBeverage = document.querySelector('.beverage').cloneNode(true);
        newBeverage.querySelector('.beverage-count').textContent = `Напиток №${newIndex}`;
        newBeverage.querySelectorAll('input[type="radio"]').forEach((input, index) => {
            const newRadioName = `milk${newIndex}`;
            input.name = newRadioName;
            input.checked = false;
        });
        form.insertBefore(newBeverage, addButton.parentNode);
        updateRemoveButtons();
        addTextareaListener(newBeverage.querySelector('textarea'), newBeverage.querySelector('.output-text'));
    });

    function addRemoveButton(beverage) {
        const removeButton = document.createElement('button');
        removeButton.textContent = '✖';
        removeButton.className = 'remove-button';
        removeButton.style.position = 'absolute';
        removeButton.style.top = '10px';
        removeButton.style.right = '10px';
        removeButton.addEventListener('click', () => {
            beverage.remove();
            updateRemoveButtons();
        });
        beverage.appendChild(removeButton);
    }

    function addTextareaListener(textarea, outputDiv) {
        textarea.addEventListener('input', () => {
            const highlightedText = textarea.value.replace(/(срочно|быстрее|побыстрее|скорее|поскорее|очень нужно)/gi, '<b>$1</b>');
            outputDiv.innerHTML = highlightedText;
        });
    }

    document.querySelectorAll('.beverage').forEach(beverage => {
        addRemoveButton(beverage);
        addTextareaListener(beverage.querySelector('textarea'), beverage.querySelector('.output-text'));
    });

    updateRemoveButtons();

    submitButton.addEventListener('click', (event) => {
        event.preventDefault();
        const beveragesCount = document.querySelectorAll('.beverage').length;
        const orderMessage = `Вы заказали ${beveragesCount} ${getBeverageWord(beveragesCount)}.`;
    
        showModal(orderMessage, createOrderTable());
    });
});


