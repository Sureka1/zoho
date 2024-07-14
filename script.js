document.addEventListener('DOMContentLoaded', () => {
    const logo = document.getElementById('logo');
    const logoUpload = document.getElementById('logo-upload');

    logo.addEventListener('click', () => {
        logoUpload.click();
    });

    logoUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.size <= 1048576) { 
            const reader = new FileReader();
            reader.onload = (e) => {
                logo.src = e.target.result;
                logo.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            alert('File size must be less than 1MB');
        }
    });
});

/*.........*/

const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
    "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Côte d'Ivoire", "Croatia", 
    "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
    "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", 
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
    "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
    "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo",
    "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
    "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", 
    "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", 
    "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia",
    "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
    "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
    "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka",
    "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste",
    "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", 
    "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", 
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

function populateDropdowns(stateSelectId, countrySelectId) {
    const stateSelect = document.getElementById(stateSelectId);
    const countrySelect = document.getElementById(countrySelectId);

    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

populateDropdowns('state', 'country');
populateDropdowns('customerState', 'customerCountry');

/*..........*/

function changeValue(button, change, isDecimal = false) {
    const input = button.parentElement.querySelector('input');
    let value = parseFloat(input.value);
    if (isDecimal) {
        value = (value + change).toFixed(2);
    } else {
        value += change;
    }
    if (value < 0) value = 0; 
    input.value = value;
    calculateTotals();
}

function addLineItem() {
    const table = document.getElementById('invoice-items');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td><input type="text" placeholder="Enter item name/description"></td>
        <td><input type="text" placeholder="HSN/SAC"></td>
        <td><input type="number" value="0" onchange="calculateTotals()"></td>
        <td><input type="number" value="0" step="1" onchange="calculateTotals()"></td>
        <td><input type="number" value="0" step="1" onchange="calculateTotals()"></td>
        <td><input type="number" value="0" step="1" onchange="calculateTotals()"></td>
        <td><input type="number" value="0" step="1" onchange="calculateTotals()"></td>
        <td><input type="text" value="0.01" readonly></td>
        <td><button class="delete-button" onclick="deleteRow(this)">&#x1F5D1;</button></td>
    `;

    table.appendChild(row);
    calculateTotals();
}

function deleteRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    calculateTotals();
}

function calculateTotals() {
    const rows = document.querySelectorAll('#invoice-items tr');
    let subtotal = 0;
    let sgst = 0;
    let cgst = 0;

    rows.forEach(row => {
        const qty = parseFloat(row.children[2].querySelector('input').value);
        const rate = parseFloat(row.children[3].querySelector('input').value);
        const sgstRate = parseFloat(row.children[4].querySelector('input').value);
        const cgstRate = parseFloat(row.children[5].querySelector('input').value);
        const cess = parseFloat(row.children[6].querySelector('input').value);
        const amount = qty * rate + (qty * rate * sgstRate / 100) + (qty * rate * cgstRate / 100) + (qty * rate * cess / 100);

        row.children[7].querySelector('input').value = amount.toFixed(2);

        subtotal += qty * rate;
        sgst += qty * rate * sgstRate / 100;
        cgst += qty * rate * cgstRate / 100;
    });

    document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    document.getElementById('sgst').innerText = sgst.toFixed(2);
    document.getElementById('cgst').innerText = cgst.toFixed(2);
    document.getElementById('total').innerText = (subtotal + sgst + cgst).toFixed(2);
}


