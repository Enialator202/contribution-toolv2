document.getElementById('breakdownToggle').addEventListener('change', function() {
    const expenseBreakdown = document.getElementById('expenseBreakdown');
    const expenseInput = document.getElementById('expenses');
    if (this.checked) {
      expenseBreakdown.classList.remove('hidden');
      expenseInput.setAttribute('disabled', 'true');
    } else {
      expenseBreakdown.classList.add('hidden');
      expenseInput.removeAttribute('disabled');
    }
  });
  
  document.getElementById('addExpense').addEventListener('click', function() {
    const expenseList = document.getElementById('expenseList');
    const newExpense = document.createElement('div');
    newExpense.classList.add('expense-item');
    newExpense.innerHTML = `
      <input type="text" class="expense-name" placeholder="Expense Name">
      <input type="number" class="expense-value" min="0" placeholder="$ Amount">
    `;
    expenseList.appendChild(newExpense);
  });
  
  function showError(input, message) {
    const inputGroup = input.closest('.input-group');
    const error = document.createElement('div');
    error.className = 'error-message';
    error.innerText = message;
    inputGroup.classList.add('error');
    inputGroup.appendChild(error);
  }
  
  function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.input-group').forEach(group => group.classList.remove('error'));
  }
  
  document.getElementById('calculateBtn').addEventListener('click', function() {
    clearErrors();
    
    const income1 = document.getElementById('income1');
    const income2 = document.getElementById('income2');
    let expenses = document.getElementById('expenses');
  
    if (!income1.value) {
      showError(income1, "Please enter Partner 1's income.");
    }
  
    if (!income2.value) {
      showError(income2, "Please enter Partner 2's income.");
    }
  
    if (document.getElementById('breakdownToggle').checked) {
      let totalExpenses = 0;
      let errorFound = false;
      document.querySelectorAll('.expense-item').forEach(item => {
        const value = item.querySelector('.expense-value').value;
        if (!value || parseFloat(value) === 0) {
          showError(item.querySelector('.expense-value'), "Please enter a valid expense.");
          errorFound = true;
        }
        totalExpenses += parseFloat(value) || 0;
      });
  
      if (errorFound || totalExpenses === 0) {
        return;
      }
  
      expenses.value = totalExpenses;
    }
  
    const totalIncome = parseFloat(income1.value) + parseFloat(income2.value);
    const partner1Share = (parseFloat(income1.value) / totalIncome) * parseFloat(expenses.value);
    const partner2Share = (parseFloat(income2.value) / totalIncome) * parseFloat(expenses.value);
  
    document.getElementById('results').innerHTML = `
      <h3>Results:</h3>
      <p>Partner 1 should contribute: $${partner1Share.toFixed(2)}</p>
      <p>Partner 2 should contribute: $${partner2Share.toFixed(2)}</p>
    `;
  
    if (Math.abs(income1.value - income2.value) / totalIncome > 0.3) {
      document.getElementById('results').innerHTML += `
        <p style="color: red;">Significant income disparity detected!</p>
      `;
    }
  });
  
  document.getElementById('downloadBtn').addEventListener('click', function() {
    const income1 = document.getElementById('income1').value;
    const income2 = document.getElementById('income2').value;
    const resultsContent = document.getElementById('results').innerHTML;
    
    const pdfContent = `
      ** Relationship Budget Report **
  
      Partner 1 Income: $${income1}\n
      Partner 2 Income: $${income2}\n
  
      Contributions:\n${resultsContent.replace(/<[^>]+>/g, '')}
    `;
  
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'budget_results.pdf';
    link.click();
  });
  
  document.querySelectorAll('.info-icon').forEach(icon => {
    icon.addEventListener('click', function() {
      const tooltip = this.nextElementSibling;
      tooltip.classList.toggle('show');
    });
  });
  