const sheetUrl = "https://docs.google.com/spreadsheets/d/1IQlptvWtIuEz6OYdV0O6V2otKCDvntouPMT28PK-1iM/gviz/tq?tqx=out:csv";
const spreadsheetId = '1IQlptvWtIuEz6OYdV0O6V2otKCDvntouPMT28PK-1iM'; 
const range = 'A:F'; 
const apiKey = 'AIzaSyBOp1oklgrGyatPARiTIDYMt70876EDiV0';
const accessToken = 'ya29.a0AeDClZDAuTLyCBBD_fU2ZDrjrrG34YzwzlwtviFy65THj2bagOkSKklPmZVe1_u942p_3_5xMz7bp12fLwwkff7nkplFEN3dneusJ71RHvb7wWiqyzcPq7aIgVnIsEyChktITi0YVtdlKmuYXCakfu7HG8394CDuPpFnuODNaCgYKAdASARISFQHGX2Mite_PnL-CMSg8Vx_WdfDMVg0175';
//refeshToken
const url2 = "https://oauth2.googleapis.com/token";
const params = {
  code: '4/0AVG7fiSKU49JWu3rCvMNDWObpWEhDjDd9GpKlh_dmYxPKSh7gUH-kGLs6wv_4LQnO2nzyA',
  client_id: '387330197465-k1rliup96791v78e5d7agvh4o0eig3p3.apps.googleusercontent.com',
  client_secret: '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',
  redirect_uri: 'http://localhost:5501/callback',
  grant_type: 'authorization_code'
};

// Lấy dữ liệu khi tải trang
window.onload = fetchTasks;

function getnewtoken(){
fetch(url2, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams(params)
})
.then(response => response.json())
.then(data => {
  console.log("Access Token:", data.access_token);
  localStorage.setItem('token',data.access_token);
  console.log("Refresh Token:", data.refresh_token);
})
.catch(error => console.error("Lỗi:", error));
}

//end test
const newRow = [
  ["","Giá trị A mới", "Giá trị B mới","C","D"] // Giá trị cần thêm vào cột A và B
];
const url1 = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

function add_new_data(){
          fetch(url1, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              values: newRow
            })
          })
          .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
          })
          .then(data => {
            console.log("Thêm dữ liệu thành công:", data);
          })
          .catch(error => {
            console.error("Lỗi:", error);
          });
}


// URL API với ID của bảng tính, phạm vi và API Key
const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

fetch(url)
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  })
  .then(data => {
    const values = data.values;
    if (values && values.length > 0) {
      values.forEach(row => {
        const colA = row[0] || null; // Lấy dữ liệu từ cột A
        const colB = row[1] || null; // Lấy dữ liệu từ cột B
        //console.log(`A: ${colA}, B: ${colB}`);
      });
    } else {
      console.log("Không có dữ liệu.");
    }
  })
  .catch(error => {
    console.error("Lỗi:", error);
  });





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

      rows.forEach((row, rowindex) => {
        const columns = row.split(',');
        const title = columns[1].replace(/['"]/g, '').trim();
        const content = columns[2].replace(/['"]/g, '').trim();
        const startTime = columns[3].replace(/['"]/g, '').trim();
        const endTime = columns[4].replace(/['"]/g, '').trim();
        const typeTask = columns[5].replace(/['"]/g, '').trim();

        const endDate = parseDate(endTime);

        if (!isNaN(endDate)) {
          tasks.push({ title, content, startTime, endDate, typeTask, rowindex });
        }
      });

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

      tasks.forEach((task, index) => {
        const isExpired = task.endDate < today;
        const typeIcon = getTypeIcon(task.typeTask);
        const taskCard = `
          <div class="task-card ${isExpired ? 'expired-task' : ''}">
            <div class="task-title">${task.title}</div>
            <div class="task-content">${task.content}</div>
            <div class="task-dates">
              <strong>Bắt đầu:</strong> ${task.startTime} <br>
              <strong>Kết thúc:</strong> ${task.endDate.toLocaleDateString()}
            </div>
            <div class="task-type">
            ${task.typeTask}
            <img src="${typeIcon}" class="type-icon" alt="${task.typeTask}">
            </div>
            <button class="button-30" onclick="editTask('${task.title}', '${task.content}', '${task.startTime}', '${task.endDate}', '${task.typeTask}')">Sửa</button>
            <button class="button-31" onclick="deleteTask(${task.rowindex + 1 })">Xóa</button>
          </div>`;
        taskContainer.insertAdjacentHTML('beforeend', taskCard);
      });
    })
    .catch(error => {
      console.error("Lỗi khi lấy dữ liệu:", error);
    });
}

//điều hướng nút edit task
function editTask(title, content, startTime, endTime, typeTask) {
  const url = `edit_task.html?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}&typeTask=${encodeURIComponent(typeTask)}`;
  window.location.href = url;
}

function getTypeIcon(typeTask) {
    switch (typeTask.toLowerCase()) {
      case 'shopping':
        return 'images/trolley.png';
      case 'daily expenses':
        return 'images/budget.png';
      case 'event':
        return 'images/event.png';
      case 'sports':
        return 'images/running.png';
      case 'travel':
        return 'images/travel.png';
      default:
        return 'path/to/default-icon.png';
    }
  }

function openGoogleForm() {
  window.open("https://docs.google.com/forms/d/e/1FAIpQLSeLrPl31p2lKM9vt7twBtDwHN7_bFAAKroJ3NKkz1-QCXnYJQ/viewform", "_blank");
}

//delete function
async function deleteTask(index) {
  try {
      const sheetId = await getSheetId(); // Lấy sheetId chính xác
      // Bước 3: Xóa hàng bằng batchUpdate API
      const urlDelete = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
      const deleteRequest = {
          requests: [
              {
                  deleteDimension: {
                      range: {
                          sheetId: sheetId, // Sử dụng sheetId chính xác
                          dimension: "ROWS",
                          startIndex: index,
                          endIndex: index + 1,
                      }
                  }
              }
          ]
      };

      await fetch(urlDelete, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(deleteRequest)
      });

      alert("Task đã được xóa!");
      window.location.reload(); 
  } catch (error) {
      console.error("Lỗi khi xóa task:", error);
  }
}



async function getSheetId() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties&key=${apiKey}`;
  const response = await fetch(url, {
      headers: {
          'Authorization': `Bearer ${accessToken}`
      }
  });
  const data = await response.json();
  const sheets = data.sheets;

  // Giả sử bạn muốn lấy `sheetId` của sheet đầu tiên
  if (sheets && sheets.length > 0) {
      return sheets[0].properties.sheetId;
  } else {
      throw new Error("Không tìm thấy sheet nào trong bảng tính.");
  }
}
