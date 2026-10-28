const API_URL = "http://localhost:5000/api/feedback";

const form = document.getElementById("feedbackForm");
const message = document.getElementById("message");
const feedbackList = document.getElementById("feedbackList");
const submitBtn = document.getElementById("submitBtn");

// 1. Submit feedback (CREATE & UPDATE both)
form.addEventListener("submit", async function(event) {
  event.preventDefault();

  const idInput = document.getElementById("feedbackId");
  const id = idInput ? idInput.value : "";

  const feedback = {
    name: document.getElementById("name").value.trim(),
    rating: Number(document.getElementById("rating").value),
    comment: document.getElementById("comment").value.trim()
  };

  submitBtn.disabled = true;

  try {
    let response;
    if (id) {
      // Update karne ke liye PUT request
      response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback)
      });
    } else {
      // Naya data bhejane ke liye POST request
      response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback)
      });
    }

    if (!response.ok) throw new Error("Action failed");

    message.style.color = "green";
    message.textContent = id ? "Feedback updated successfully!" : "Feedback submitted successfully!";

    form.reset();
    if(idInput) idInput.value = ""; 
    submitBtn.textContent = "Submit Feedback";
    await loadFeedback();

  } catch (error) {
    message.style.color = "red";
    message.textContent = "Operation failed. Check backend.";
  } finally {
    submitBtn.disabled = false;
  }
});

// 2. Get all feedback (READ)
async function loadFeedback() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to load feedback");

    const resJson = await response.json();
    const dataList = resJson.data || resJson; 

    feedbackList.innerHTML = "";

    if (!Array.isArray(dataList) || dataList.length === 0) {
      feedbackList.textContent = "No feedback available yet.";
      return;
    }

    dataList.forEach(function(item) {
      const card = document.createElement("div");
      card.className = "feedback-card";

      // 🌟 Yahan HTML mein Edit aur Delete ke buttons automatic jodh diye hain!
      card.innerHTML = `
        <h3>👤 ${item.name}</h3>
        <p>Rating: ${item.rating}/5</p>
        <p>Comment: ${item.comment}</p>
        <div style="margin-top: 10px;">
          <button style="background: #3498db; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;" onclick="setupEdit('${item._id}', '${item.name}', ${item.rating}, '${item.comment.replace(/'/g, "\\'")}')">✏️ Edit</button>
          <button style="background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;" onclick="deleteFeedback('${item._id}')">🗑️ Delete</button>
        </div>
      `;
      feedbackList.appendChild(card);
    });

  } catch (error) {
    feedbackList.textContent = "Unable to load feedback.";
  }
}

// 3. Delete feedback (DELETE)
window.deleteFeedback = async function(id) {
  if (!confirm("Are you sure you want to delete this feedback?")) return;
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Delete failed");
    alert("Feedback deleted successfully!");
    await loadFeedback(); 
  } catch (error) {
    alert("Could not delete feedback.");
  }
};

// 4. Edit mode setup helper
window.setupEdit = function(id, name, rating, comment) {
  let idInput = document.getElementById("feedbackId");
  if (!idInput) {
    idInput = document.createElement("input");
    idInput.type = "hidden";
    idInput.id = "feedbackId";
    form.appendChild(idInput);
  }
  idInput.value = id;
  document.getElementById("name").value = name;
  document.getElementById("rating").value = rating;
  document.getElementById("comment").value = comment;
  submitBtn.textContent = "Update Feedback";
};

loadFeedback();
