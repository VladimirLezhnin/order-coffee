document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const addButton = document.querySelector('.add-button');
    const submitButton = document.querySelector('.submit-button');

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

    addButton.addEventListener('click', () => {
        const newBeverage = document.querySelector('.beverage').cloneNode(true);
        const newIndex = document.querySelectorAll('.beverage').length + 1;
        newBeverage.querySelector('.beverage-count').textContent = `Напиток №${newIndex}`;
        newBeverage.querySelectorAll('input[type="radio"]').forEach((input, index) => {
            const newRadioName = `milk${newIndex}${index}`;
            input.name = newRadioName;
            input.checked = false; // Сбросить выбор
        });
        form.insertBefore(newBeverage, addButton.parentNode);
        updateRemoveButtons();
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

    updateRemoveButtons(); // Инициализация кнопок удаления

    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Предотвращаем отправку формы
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.textContent = 'Заказ принят!';
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        setTimeout(() => modal.remove(), 3000); // Удаление модального окна через 3 секунды
    });
});
