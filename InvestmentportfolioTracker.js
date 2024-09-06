// Initialize Chart.js
const ctx = document.getElementById('pie-chart').getContext('2d');
const pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: []
        }]
    }
});


let investments = [{},]
let editIndex = null;
// Utility Functions
function updateTotalValue() {
    const investments = JSON.parse(localStorage.getItem('investments')) || [];
    const totalValue = investments.reduce((total, investment) => total + parseFloat(investment.currentValue), 0);
    document.getElementById('total-value-amount').textContent = totalValue.toFixed(2);
}

function updateInvestmentList() {
    const investments = JSON.parse(localStorage.getItem('investments')) || [];
    console.log(investments); // Check if data is being retrieved

    const listBody = document.getElementById('investment-list-body');
    listBody.innerHTML = ''; // Ensure the table body is cleared before populating

    investments.forEach((investment, index) => {
        console.log(investment); // Check if each investment is being processed
        const percentageChange = ((investment.currentValue - investment.investedAmount) / investment.investedAmount * 100).toFixed(2);
        const row = document.createElement('tr');
        row.innerHTML = `
         <td>${investment.assetName}</td>
                <td>${investment.assetName}</td>
                <td>$${parseFloat(investment.investedAmount).toFixed(2)}</td>
                <td>$${parseFloat(investment.currentValue).toFixed(2)}</td>
                <td>${percentageChange}%</td>
                <td>
                    <button onclick="openUpdateModal(${index})">Update</button>
                    <button onclick="removeInvestment(${index})">Remove</button>
                </td>
            `;
        listBody.appendChild(row);
    });

    updatePieChart();
    updateTotalValue();
}


function updatePieChart() {
    const investments = JSON.parse(localStorage.getItem('investments')) || [];
    const labels = investments.map(inv => inv.assetName);
    const data = investments.map(inv => inv.currentValue);
    const backgroundColor = data.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`);

    pieChart.data.labels = labels;
    pieChart.data.datasets[0].data = data;
    pieChart.data.datasets[0].backgroundColor = backgroundColor;
    pieChart.update();
}

function openAddInvestmentModal() {
    editIndex = null; // Reset editIndex when adding a new investment
    document.getElementById('asset-name').value = '';
    document.getElementById('amount-invested').value = '';
    document.getElementById('current-value').value = '';
    document.getElementById('investment-id').value = '';
    document.getElementById('add-investment-modal').style.display = 'block';
}

function openUpdateModal(index) {
    const investments = JSON.parse(localStorage.getItem('investments')) || [];
    const investment = investments[index];
    document.getElementById('investment-id').value = investment.id;
    document.getElementById('asset-name').value = investment.assetName;
    document.getElementById('amount-invested').value = investment.investedAmount;
    document.getElementById('current-value').value = investment.currentValue;
    editIndex = index; // Set editIndex to the current investment index
    document.getElementById('add-investment-modal').style.display = 'block';
}

function closeAddInvestmentModal() {
    document.getElementById('add-investment-modal').style.display = 'none';
}

function addInvestment() {
    // event.preventDefault();
    const id = document.getElementById('investment-id').value || Date.now(); // Generate ID if not present
    const assetName = document.getElementById('asset-name').value;
    const investedAmount = document.getElementById('amount-invested').value;
    const currentValue = document.getElementById('current-value').value;
    if (!assetName || investedAmount <= 0 || currentValue <= 0) {
        alert('Please enter valid values');
        return;
    }

    let investments = JSON.parse(localStorage.getItem('investments')) || [];

    if (editIndex === null) {
        // Add a new investment
        investments.push({ id, assetName, investedAmount, currentValue });
    } else {
        // Update an existing investment (maintain the same ID)
        investments[editIndex] = { id, assetName, investedAmount, currentValue };
        editIndex = null; // Reset after updating
    }

    localStorage.setItem('investments', JSON.stringify(investments)); // Save to localStorage
    updateInvestmentList(); // Update the table and chart
    closeAddInvestmentModal(); // Close the modal
}




function updateInvestment(event, index) {
    event.preventDefault();
    const assetName = document.getElementById('asset-name').value;
    const investedAmount = document.getElementById('amount-invested').value;
    const currentValue = document.getElementById('current-value').value;

    if (!assetName || investedAmount <= 0 || currentValue <= 0) {
        alert('Please enter valid values');
        return;
    }
    let investments = JSON.parse(localStorage.getItem('investments')) || [];

    if (editIndex === null) {
        // Add a new investment
        investments.push({ assetName, investedAmount, currentValue });
    } else {
        // Update an existing investment
        investments[editIndex] = { assetName, investedAmount, currentValue };
        editIndex = null; // Reset after updating
    }


    localStorage.setItem('investments', JSON.stringify(investments));

    closeAddInvestmentModal();
    updateInvestmentList();
}

function removeInvestment(index) {
    const investments = JSON.parse(localStorage.getItem('investments')) || [];
    investments.splice(index, 1);
    localStorage.setItem('investments', JSON.stringify(investments));
    updateInvestmentList();
}


document.getElementById('close-add-investment').addEventListener('click', closeAddInvestmentModal());


// Initial load
updateInvestmentList();




