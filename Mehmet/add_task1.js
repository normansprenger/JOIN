const dueDateInput = document.getElementById('due-date');
        const errorMessage = document.getElementById('error-message');

        dueDateInput.addEventListener('blur', function() {
            // Placeholder validation function
            const isValid = validateDueDate(dueDateInput.value);

            if (!isValid) {
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Invalid due date. Please enter in dd/mm/yyyy format.';
            } else {
                errorMessage.style.display = 'none';
            }
        });

        function validateDueDate(inputValue) {
            // Placeholder validation logic
            // You can implement your own date validation here
            // For simplicity, this example checks if the input matches a basic date format
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            return dateRegex.test(inputValue);
        }
        document.getElementById('due-date').addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9/]/g, '');
        });
        
        function setTodayDate() {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
            const year = today.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            document.getElementById('due-date').value = formattedDate;
        }
        

        