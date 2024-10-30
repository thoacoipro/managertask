const sheetUrl = "https://docs.google.com/spreadsheets/d/1IQlptvWtIuEz6OYdV0O6V2otKCDvntouPMT28PK-1iM/gviz/tq?tqx=out:csv";

function parseDate(dateString) {
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return new Date(`${year}-${month}-${day}`);
  }
  return new Date(dateString);
}

function fetchTasks() {
  fetch(sheetUrl)
    .then(response => response.text())
    .then(csvData => {
      const rows = csvData.split('\n').slice(1);
      let tasks = [];

      rows.forEach(row => {
        const columns = row.split(',');
        const title = columns[1].replace(/['"]/g, '').trim();
        const content = columns[2].replace(/['"]/g, '').trim();
        const startTime = columns[3].replace(/['"]/g, '').trim();
        const endTime = columns[4].replace(/['"]/g, '').trim();
        const typeTask = columns[5].replace(/['"]/g, '').trim();

        const endDate = parseDate(endTime);

        if (!isNaN(endDate)) {
          tasks.push({ title, content, startTime, endDate, typeTask });
        }
      });

      // Sắp xếp: task đã hết hạn xuống dưới cùng
      const today = new Date();
      tasks.sort((a, b) => {
        const aExpired = a.endDate < today;
        const bExpired = b.endDate < today;
        if (aExpired && !bExpired) return 1;
        if (!aExpired && bExpired) return -1;
        return a.endDate - b.endDate;
      });

      // Hiển thị task
      const taskContainer = document.querySelector("#taskContainer");
      taskContainer.innerHTML = "";

      tasks.forEach(task => {
        const isExpired = task.endDate < today;
        const taskCard = `
          <div class="task-card ${isExpired ? 'expired-task' : ''}">
            <div class="task-title">${task.title}</div>
            <div class="task-content">${task.content}</div>
            <div class="task-dates">
              <strong>Bắt đầu:</strong> ${task.startTime} <br>
              <strong>Kết thúc:</strong> ${task.endDate.toLocaleDateString()}
            </div>
            <div class="task-type">${task.typeTask}</div>
          </div>`;
        taskContainer.insertAdjacentHTML('beforeend', taskCard);
      });
    })
    .catch(error => {
      console.error("Lỗi khi lấy dữ liệu:", error);
    });
}

function openGoogleForm() {
  window.open("https://docs.google.com/forms/d/e/1FAIpQLSeLrPl31p2lKM9vt7twBtDwHN7_bFAAKroJ3NKkz1-QCXnYJQ/viewform", "_blank");
}

// Lấy dữ liệu khi tải trang
window.onload = fetchTasks;
