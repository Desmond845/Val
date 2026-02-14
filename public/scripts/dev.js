const PASSWORD = "jehovah_hide_123";
document.addEventListener("DOMContentLoaded", () => {
  loadData();
});

async function loadData() {
  try {
    const response = await fetch(
      `/api/dev/stats?password=${PASSWORD}`
    );
    // if (!response.ok) throw new Error('Failed to fetch');
    if (response.ok) {
      const data = await response.json();

      
      updateStats(data.stats);
      updateFriendsTable(data.friends);
      updateUrlGrid(data.friends); // New URL grid
      let date = new Date();
      document.getElementById("last-updated").textContent =
        formatRelativeTime(date);

      setInterval(() => {
        document.getElementById("last-updated").textContent =
          formatRelativeTime(date);
      }, 1000);
    } else {
    }
  } catch (error) {
    console.error("API FAILURE:", error);
  }
}
// Format dates as relative time (e.g., "2 hours ago", "Last week", or "11 Feb 2026, 11:35 am")
function formatRelativeTime(dateInput) {
  if (!dateInput) return "—";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Invalid date";

  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  // Less than 60 seconds
  if (diffSec < 60) {
    return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`;
  }
  // Less than 60 minutes
  if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  }
  // Less than 24 hours
  if (diffHr < 24) {
    return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
  }
  // Less than 7 days
  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }
  // Between 7 and 13 days
  if (diffDays < 14) {
    return "Last week";
  }
  // Older – show absolute date
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // convert 0 to 12
  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
}
function updateStats(stats) {
  document.getElementById("total-friends").textContent =
    stats.totalFriends || 0;
  document.getElementById("total-views").textContent = stats.totalViews || 0;
  document.getElementById("viewed-msgs").textContent =
    stats.viewedMessages || 0;
  document.getElementById("total-devices").textContent =
    stats.totalDevices || 0;
}

function updateFriendsTable(friends) {
  const tbody = document.getElementById("friends-body");
  tbody.innerHTML = "";

  if (!friends || friends.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem;">No friends in manifest.</td></tr>`;
    return;
  }

  friends.forEach((friend) => {
    const row = document.createElement("tr");

    const firstViewed = friend.firstViewed
      ? formatRelativeTime(friend.firstViewed)
      : "—";
    const lastViewed = friend.lastViewed
      ? formatRelativeTime(friend.lastViewed)
      : "—";

    const messagePreview =
      friend.message.length > 60
        ? friend.message.substring(0, 60) + "…"
        : friend.message;

    const viewedBadge = friend.viewed
      ? '<span class="badge badge-success"><i class="fas fa-check-circle"></i> Viewed</span>'
      : '<span class="badge badge-warning"><i class="fas fa-hourglass-half"></i> Pending</span>';

    const deviceDisplay =
      friend.devices && friend.devices.length > 0
        ? `<span class="device-chip" title="${friend.devices.join(", ")}">${
            friend.devices.length
          } device${friend.devices.length > 1 ? "s" : ""}</span>`
        : '<span class="device-chip">None</span>';

    row.innerHTML = `
                    <td><strong>${friend.name}</strong></td>
                    <td title="${friend.message}">${messagePreview}</td>
                    <td>${viewedBadge}</td>
                    <td>${friend.viewCount || 0}</td>
                    <td>${firstViewed}</td>
                    <td>${lastViewed}</td>
                    `;
    //                     <td>${deviceDisplay}</td>
    //                     <td>
    //                         <button class="btn" style="padding: 6px 12px;" onclick="viewMessage('${friend.name}')">
    // <i class="fas fa-eye"></i>
    //                         </button>
    //                         <button class="btn" style="padding: 6px 12px;" onclick="resetViews('${friend.name}')">
    //                             <i class="fas fa-undo-alt"></i>
    //                         </button>
    //                     </td>
    tbody.appendChild(row);
  });
}

function updateUrlGrid(friends) {
  const grid = document.getElementById("urlGrid");
  grid.innerHTML = "";

  if (!friends || friends.length === 0) {
    grid.innerHTML =
      '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">No launch codes generated.</div>';
    return;
  }

  friends.forEach((friend) => {
    const card = document.createElement("div");
    card.className = "url-card";

    // Use friend.id (uniqueId) if available; fallback to name for demo
    const link = friend.id
      ? `${window.location.origin}/friends/${friend.id}`
      : `${window.location.origin}/friends/${encodeURIComponent(friend.name)}`;

    card.innerHTML = `
                    <div class="url-info">
                        <div class="url-name">${friend.name}</div>
                        <div class="url-lik" title="${link}">${link}</div>
                    </div>
                    <button class="copy-btn" onclick="copyToClipboard('${link}', this)">
                        <i class="fas fa-copy"></i>
                    </button>
                `;
    grid.appendChild(card);
  });
}

function copyToClipboard(text, btn) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const originalHtml = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.style.background = "#238636";
      btn.style.borderColor = "#238636";
      btn.style.color = "white";
      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.style.background = "";
        btn.style.borderColor = "";
        btn.style.color = "";
      }, 1500);
    })
    .catch((err) => {
      alert("Failed to copy: " + err);
    });
}

function searchFriends() {
  const term = document.getElementById("search").value.toLowerCase();
  const rows = document.querySelectorAll("#friends-body tr");
  rows.forEach((row) => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(term) ? "" : "none";
  });
}
function copyAllLinks() {
  const links = Array.from(document.querySelectorAll(".url-link"))
    .map((el) => el.textContent)
    .join("\n");
  navigator.clipboard.writeText(links).then(() => alert("All links copied!"));
}

function refreshData() {
  loadData();
  const btn = document.querySelector(".refresh-btn i");
  btn.style.transform = "rotate(180deg)";
  setTimeout(() => (btn.style.transform = "rotate(0deg)"), 500);
}
