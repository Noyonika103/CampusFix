const API_BASE = "http://127.0.0.1:8000";

const ticketForm = document.getElementById("ticketForm");
const ticketList = document.getElementById("ticketList");

const totalCount = document.getElementById("totalCount");
const openCount = document.getElementById("openCount");
const inProgressCount = document.getElementById("inProgressCount");
const resolvedCount = document.getElementById("resolvedCount");
const highPriorityCount = document.getElementById("highPriorityCount");

const filterStatus = document.getElementById("filterStatus");
const filterPriority = document.getElementById("filterPriority");
const filterCategory = document.getElementById("filterCategory");
const applyFiltersBtn = document.getElementById("applyFilters");
const clearFiltersBtn = document.getElementById("clearFilters");

async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`);
  const data = await res.json();

  totalCount.textContent = data.total;
  openCount.textContent = data.open;
  inProgressCount.textContent = data.in_progress;
  resolvedCount.textContent = data.resolved;
  highPriorityCount.textContent = data.high_priority;
}

async function fetchTickets() {
  let url = `${API_BASE}/tickets`;

  const params = new URLSearchParams();
  if (filterStatus.value) params.append("status", filterStatus.value);
  if (filterPriority.value) params.append("priority", filterPriority.value);
  if (filterCategory.value.trim()) params.append("category", filterCategory.value.trim());

  if ([...params].length > 0) {
    url += `?${params.toString()}`;
  }

  const res = await fetch(url);
  const tickets = await res.json();

  ticketList.innerHTML = "";

  if (tickets.length === 0) {
    ticketList.innerHTML = "<p>No tickets found.</p>";
    return;
  }

  tickets.forEach(ticket => {
    const card = document.createElement("div");
    card.className = "ticket-card";

    card.innerHTML = `
      <h3>${ticket.title}</h3>
      <p>${ticket.description}</p>
      <p class="ticket-meta"><strong>Category:</strong> ${ticket.category}</p>
      <p class="ticket-meta"><strong>Location:</strong> ${ticket.location}</p>
      <p class="ticket-meta"><strong>Priority:</strong> ${ticket.priority}</p>
      <p class="ticket-meta"><strong>Status:</strong> ${ticket.status}</p>
      <p class="ticket-meta"><strong>Requester:</strong> ${ticket.requester_name}</p>
      <p class="ticket-meta"><strong>Assigned To:</strong> ${ticket.assigned_to || "Not assigned"}</p>

      <div class="ticket-actions">
        <select class="status-select">
          <option value="open" ${ticket.status === "open" ? "selected" : ""}>Open</option>
          <option value="in_progress" ${ticket.status === "in_progress" ? "selected" : ""}>In Progress</option>
          <option value="resolved" ${ticket.status === "resolved" ? "selected" : ""}>Resolved</option>
        </select>

        <input type="text" class="assign-input" placeholder="Assign to" value="${ticket.assigned_to || ""}" />

        <button class="update-btn">Update Ticket</button>
      </div>
    `;

    const statusSelect = card.querySelector(".status-select");
    const assignInput = card.querySelector(".assign-input");
    const updateBtn = card.querySelector(".update-btn");

    updateBtn.addEventListener("click", async () => {
      await updateTicket(ticket.id, statusSelect.value, assignInput.value);
    });

    ticketList.appendChild(card);
  });
}

async function createTicket(event) {
  event.preventDefault();

  const ticketData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
    location: document.getElementById("location").value,
    priority: document.getElementById("priority").value,
    requester_name: document.getElementById("requester_name").value
  };

  const res = await fetch(`${API_BASE}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(ticketData)
  });

  if (res.ok) {
    ticketForm.reset();
    await fetchDashboard();
    await fetchTickets();
  } else {
    alert("Failed to create ticket");
  }
}

async function updateTicket(ticketId, status, assigned_to) {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status,
      assigned_to
    })
  });

  if (res.ok) {
    await fetchDashboard();
    await fetchTickets();
  } else {
    alert("Failed to update ticket");
  }
}

ticketForm.addEventListener("submit", createTicket);

applyFiltersBtn.addEventListener("click", fetchTickets);

clearFiltersBtn.addEventListener("click", async () => {
  filterStatus.value = "";
  filterPriority.value = "";
  filterCategory.value = "";
  await fetchTickets();
});

fetchDashboard();
fetchTickets();