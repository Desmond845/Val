// Fill hidden field with current URL
document.getElementById("currentUrl").value = window.location.href;

// Before fetch
function escapeHtml(unsafe) {
  return unsafe.replace(/[&<>"]/g, function (m) {
    if (m === "&") return ";";
    if (m === "<") return "";
    if (m === ">") return "";
    if (m === '"') return "";
  });
}

function cleanName(name) {
  return name
    .replace(/[^a-zA-Z\s]/g, "") // remove symbols
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ") // collapse spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize first letter
}

function cleanMessage(msg) {
  return msg.trim().replace(/\s+/g, " "); // collapse multiple spaces/newlines
}

// Then use it on name, email, message, url before inserting into HTML.

// Handle form submit
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  // Before fetch
  const message = document.getElementById("message").value.trim();
  if (!message) {
    document.getElementById("formStatus").innerHTML =
      "❓ Please write a message.";
    return;
  }
  const email = document.getElementById("email").value.trim();
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    document.getElementById("formStatus").innerHTML =
      "❓ Invalid email format.";
    return;
  }
  const submitBtn = e.target.querySelector("button");
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
 
  const formData = {
    name: cleanName(escapeHtml(document.getElementById("name").value)),
    email: cleanMessage(escapeHtml(document.getElementById("email").value)),
    message: cleanMessage(escapeHtml(document.getElementById("message").value)),
    url: document.getElementById("currentUrl").value,
  };

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById("formStatus").innerHTML =
        "✅ Thanks! Desmond will check it out.";
      e.target.reset();
    } else {
      throw new Error("Failed");
    }
  } catch (error) {
    document.getElementById("formStatus").innerHTML =
      "❌ Something went wrong. You can DM Desmond directly.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send to Desmond";
  }
});
