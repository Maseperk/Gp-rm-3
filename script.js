let totalOpened = 0;
let username = '';
let inventory = [];

function login() {
  username = document.getElementById("usernameInput").value.trim();
  if (username) {
    document.getElementById("userDisplay").innerText = `Logged in as: ${username}`;
    loadInventory();
    updateInventoryDisplay();
  }
}

function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.add('hidden');
  });
  document.getElementById(tabId).classList.remove('hidden');
}

function openCase() {
  if (!username) return alert("Please log in first!");

  const items = [
    { name: 'Common Item', rarity: 'common' },
    { name: 'Uncommon Item', rarity: 'uncommon' },
    { name: 'Rare Item', rarity: 'rare' },
    { name: 'Legendary Item', rarity: 'legendary' }
  ];

  const weights = [60, 25, 10, 5]; // % chance
  const result = weightedRandom(items, weights);

  animateCase(result);
}

function weightedRandom(items, weights) {
  let total = weights.reduce((a, b) => a + b);
  let rand = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    if (rand < weights[i]) return items[i];
    rand -= weights[i];
  }
}

function animateCase(item) {
  const spinner = document.getElementById("spinner");
  spinner.innerHTML = "";

  const items = generateSpinnerItems(item.name);
  items.forEach(obj => {
    const div = document.createElement("div");
    div.classList.add("spinner-item", obj.rarity);
    div.innerText = obj.name;
    spinner.appendChild(div);
  });

  const itemIndex = items.findIndex(i => i.name === item.name);
  const offset = -((itemIndex * 110) - 200);
  spinner.style.transition = "transform 2s ease-out";
  spinner.style.transform = `translateX(${offset}px)`;

  setTimeout(() => {
    document.getElementById("caseResult").innerText = `🎉 You won: ${item.name} (${item.rarity})`;
    addToInventory(item.name, item.rarity);
    updateDropHistory(item.name);
    totalOpened++;
    document.getElementById("totalCases").innerText = totalOpened;
  }, 2100);
}

function generateSpinnerItems(winningItem) {
  const pool = [
    { name: "Common Item", rarity: "common" },
    { name: "Uncommon Item", rarity: "uncommon" },
    { name: "Rare Item", rarity: "rare" },
    { name: "Legendary Item", rarity: "legendary" }
  ];

  const items = [];
  for (let i = 0; i < 20; i++) {
    const random = pool[Math.floor(Math.random() * pool.length)];
    items.push(random);
  }
  items[10] = pool.find(i => i.name === winningItem);
  return items;
}

function addToInventory(itemName, rarity) {
  inventory.push({ name: itemName, rarity });
  saveInventory();
  updateInventoryDisplay();
}

function updateInventoryDisplay() {
  const list = document.getElementById("inventoryList");
  list.innerHTML = '';

  const rarities = ["legendary", "rare", "uncommon", "common"];
  rarities.forEach(r => {
    const group = inventory.filter(i => i.rarity === r);
    if (group.length) {
      const title = document.createElement("li");
      title.innerText = `-- ${r.toUpperCase()} --`;
      list.appendChild(title);

      group.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item.name;
        list.appendChild(li);
      });
    }
  });
}

function updateDropHistory(itemName) {
  const list = document.getElementById("dropHistory");
  const li = document.createElement("li");
  li.innerText = itemName;
  list.insertBefore(li, list.firstChild);
}

function saveInventory() {
  if (username) {
    localStorage.setItem(`inventory_${username}`, JSON.stringify(inventory));
  }
}

function loadInventory() {
  if (username) {
    const saved = localStorage.getItem(`inventory_${username}`);
    inventory = saved ? JSON.parse(saved) : [];
  }
}

function startBattle(size) {
  if (!username) return alert("Please log in first!");
  const status = document.getElementById("battleStatus");
  status.innerText = `Searching for a ${size}v${size} battle...`;

  setTimeout(() => {
    status.innerText = `🎮 Match found! Starting ${size}v${size} battle...`;
  }, 2000);
}
