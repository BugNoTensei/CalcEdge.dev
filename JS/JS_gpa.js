const tableBody = document.getElementById("tableBody");
const form = document.getElementById("gpaForm");
const resultDiv = document.getElementById("result");
const addRowBtn = document.getElementById("addRow");

function createRow() {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" placeholder="ชื่อวิชา (ไม่บังคับ)" /></td>
    <td><input type="number" class="credit" min="0" max="15" step="0.5" required /></td>
    <td><input type="number" class="grade" min="0" max="4" step="0.5" required /></td>
    <td><button type="button" class="btn btn-remove text-white flex-grow-1" onclick="removeRow(this)">ลบ</button></td>
  `;

  // เปลี่ยนข้อความเตือนของ Validity
  const creditInput = row.querySelector(".credit");
  creditInput.oninvalid = function (e) {
    e.target.setCustomValidity("กรุณากรอกจำนวนหน่วยกิต (0-15)");
  };
  creditInput.oninput = function (e) {
    e.target.setCustomValidity("");
  };

  const gradeInput = row.querySelector(".grade");
  gradeInput.oninvalid = function (e) {
    e.target.setCustomValidity("กรุณากรอกคะแนนเกรด (0-4)");
  };
  gradeInput.oninput = function (e) {
    e.target.setCustomValidity("");
  };

  tableBody.appendChild(row);
}

function removeRow(btn) {
  btn.parentElement.parentElement.remove();
}

function formatNumber(num) {
  // สำหรับตัวเลขที่มีทศนิยมน้อยกว่าหรือเท่ากับ 2 ตำแหน่ง ให้แสดง 2 ตำแหน่ง
  if (num === Math.floor(num)) {
    // ถ้าเป็นจำนวนเต็ม
    return num.toFixed(2);
  } else if (num * 100 === Math.floor(num * 100)) {
    // ถ้ามีทศนิยม 2 ตำแหน่งพอดี
    return num.toFixed(2);
  } else {
    // ถ้ามีทศนิยมมากกว่า 2 ตำแหน่ง
    return num.toFixed(5);
  }
}

function calculateGPA(event) {
  event.preventDefault();

  let totalCredit = 0;
  let totalGradePoint = 0;
  let rows = tableBody.querySelectorAll("tr");

  if (rows.length === 0) {
    resultDiv.innerHTML = `<p style="font-weight: bold; color:rgb(255, 0, 0); font-size: 35px;">กรุณาเพิ่มข้อมูลก่อน!!!!</p>`;
    return;
  }

  let summaryHTML = `
    <table style="width:100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f0f4f8;">
          <th>ชื่อวิชา</th>
          <th>หน่วยกิต</th>
          <th>เกรด</th>
          <th>รวม</th>
        </tr>
      </thead>
      <tbody>
  `;

  rows.forEach((row) => {
    const subject = row.children[0].querySelector("input").value || "-";
    const credit = parseFloat(row.children[1].querySelector("input").value);
    const grade = parseFloat(row.children[2].querySelector("input").value);

    if (!isNaN(credit) && !isNaN(grade)) {
      const gradePoint = grade * credit;
      totalCredit += credit;
      totalGradePoint += gradePoint;

      const displayGradePoint = formatNumber(gradePoint);

      summaryHTML += `
        <tr>
          <td>${subject}</td>
          <td>${credit}</td>
          <td>${grade}</td>
          <td>${displayGradePoint}</td>
        </tr>
      `;
    }
  });

  summaryHTML += `</tbody></table>`;

  const gpa = totalCredit > 0 ? totalGradePoint / totalCredit : 0;
  const formattedGPA = totalCredit > 0 ? formatNumber(gpa) : "-";

  let gpaFormatted = formattedGPA;
  const gpaParts = formattedGPA.split(".");
  if (gpaParts.length > 1) {
    const integerPart = gpaParts[0];
    const decimalPart = gpaParts[1].slice(0, 2);
    gpaFormatted = `<span style="font-weight: bold; color: #4CAF50; font-size: 35px;">${integerPart}.${decimalPart}</span>${gpaParts[1].slice(
      2
    )}`;
  }

  summaryHTML += `<p style="margin-top: 20px; display: block; font-size: 24px"><strong>GPA:</strong> ${gpaFormatted}</p>`;

  const gpaValue = parseFloat(formattedGPA);
  let feedbackMessage = "";

  if (gpaValue >= 3.75) {
    feedbackMessage = "ยอดเยี่ยม! คุณทำได้ดีมาก!";
  } else if (gpaValue >= 3.5) {
    feedbackMessage = "ดีมาก! พยายามต่อไป!";
  } else {
    feedbackMessage = "เป็นกำลังใจให้! ทำดีที่สุดแล้ว!";
  }

  summaryHTML += `<p style="margin-top: 1px; font-weight: bold; display: block;">${feedbackMessage}</p>`;

  resultDiv.innerHTML = summaryHTML;
}

form.addEventListener("submit", calculateGPA);
addRowBtn.addEventListener("click", createRow);

for (let i = 0; i < 3; i++) createRow();
