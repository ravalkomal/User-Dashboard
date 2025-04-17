let usersData = [];

const userContainer = document.getElementById('userContainer');
const loader = document.getElementById('loader');
const errorMsg = document.getElementById('error');
const searchInput = document.getElementById('searchInput');
const genderButtons = document.querySelectorAll('.filters button');
const sortSelect = document.getElementById('sortSelect');


//Api 

const API_URL = 'https://randomuser.me/api/?results=10';

async function fetchUserData(url) {
  try {
    // Show loader and hide any previous error messages
    loader.classList.remove('hidden');
    errorMsg.classList.add('hidden');

    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    // Save the fetched users and render them
    usersData = data.results;
    renderUsers(usersData);
  } catch (error) {
    console.error(error);
    errorMsg.classList.remove('hidden');
  } finally {
    loader.classList.add('hidden');
  }
}

function renderUsers(data){
    userContainer.innerHTML = '';
    data.forEach((user , index) =>{
        const card = document.createElement('div');
        card.className = 'card';
//         if (user.dob.age > 50) card.style.border = '2px solid red';

    card.innerHTML = `
      <img src="${user.picture.large}" alt="${user.name.first}">
      <div class="info">
        <h3>${user.name.first} ${user.name.last}</h3>
        <p>${user.gender} , ${user.dob.age}</p>       
        <p>${user.location.city}, ${user.location.country}</p>
 <button onclick="openModal(${index})">View Details</button>
       
      </div>
    <div>

    `;
    userContainer.appendChild(card);
    })
}
// Function to filter and sort the data, then re-render the user cards
function filterAndSort() {
  let filtered = [...usersData];
  const searchTerm = searchInput.value.toLowerCase();
  const activeGenderButton = document.querySelector('.filters button.active');
  const gender = activeGenderButton ? activeGenderButton.dataset.gender : 'all';
  const sortBy = sortSelect.value;

  // Filter by name
  if (searchTerm) {
    filtered = filtered.filter(user =>
      `${user.name.first} ${user.name.last}`.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by gender if needed
  if (gender !== 'all') {
    filtered = filtered.filter(user => user.gender === gender);
  }
  
  // Sort users by age or name
  filtered.sort((a, b) => {
    if (sortBy === 'age') return a.dob.age - b.dob.age;
    if (sortBy === 'name') {
      const nameA = `${a.name.first} ${a.name.last}`.toLowerCase();
      const nameB = `${b.name.first} ${b.name.last}`.toLowerCase();
      return nameA.localeCompare(nameB);
    }
    return 0;
  });
  
  renderUsers(filtered);
}

// Event listeners for filtering and sorting
searchInput.addEventListener('input', filterAndSort);
genderButtons.forEach(button => {
  button.addEventListener('click', function() {
    // Toggle active class on gender buttons
    genderButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    filterAndSort();
  });
});
sortSelect.addEventListener('change', filterAndSort);

fetchUserData(API_URL);
