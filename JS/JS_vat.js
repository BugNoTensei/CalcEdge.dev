function formatAmount() {
  const input = document.getElementById("amount");
  let value = input.value.replace(/,/g, "");
  if (isNaN(value) || value === "") {
    input.value = "";
  } else {
    input.value = Number(value).toLocaleString();
  }
}

function calculate() {
  const amount = parseFloat(
    document.getElementById("amount").value.replace(/,/g, "")
  );
  const mode = document.getElementById("mode").value;
  const vatPercent = parseFloat(document.getElementById("vat").value) || 0;
  const withholdingPercent =
    parseFloat(document.getElementById("withholding").value) || 0;
  const resultDiv = document.getElementById("result");

  if (isNaN(amount) || amount <= 0) {
    resultDiv.innerHTML =
      '<p style="color:red;">กรุณากรอกจำนวนเงินให้ถูกต้อง</p>';
    return;
  }

  let beforeVAT, vatAmount, totalWithVAT, withholdingTax, netTotal;

  if (mode === "exclude") {
    beforeVAT = amount;
    vatAmount = beforeVAT * (vatPercent / 100);
    totalWithVAT = beforeVAT + vatAmount;
  } else if (mode === "include") {
    totalWithVAT = amount;
    beforeVAT = totalWithVAT / (1 + vatPercent / 100);
    vatAmount = totalWithVAT - beforeVAT;
  } else if (mode === "net") {
    beforeVAT = amount / (1 + vatPercent / 100 - withholdingPercent / 100);
    vatAmount = beforeVAT * (vatPercent / 100);
    totalWithVAT = beforeVAT + vatAmount;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  // คำนวณภาษีหัก ณ ที่จ่าย
  if (withholdingPercent > 0) {
    withholdingTax = beforeVAT * (withholdingPercent / 100);
    netTotal = totalWithVAT - withholdingTax;

    // มีหักภาษี ณ ที่จ่าย
    resultDiv.innerHTML = `
      <div class="fadeIn" style="line-height: 1.8; font-size: 1.1em;">
        <p style="display: flex; justify-content: space-between;">
          <strong>ราคาก่อน VAT</strong> <span>฿${formatCurrency(
            beforeVAT
          )}</span>
        </p>
        <p style="display: flex; justify-content: space-between;">
          <strong>VAT ${vatPercent}%</strong> <span>฿${formatCurrency(
      vatAmount
    )}</span>
        </p>
        <hr style="margin: 10px 0;">
        <p style="display: flex; justify-content: space-between;">
          <strong>ราคารวม VAT</strong> <span>฿${formatCurrency(
            totalWithVAT
          )}</span>
        </p>
        <p style="display: flex; justify-content: space-between;">
          <strong>หักภาษี ณ ที่จ่าย ${withholdingPercent}%</strong> <span>฿${formatCurrency(
      withholdingTax
    )}</span>
        </p>
        <hr style="margin: 10px 0;">
        <div style="background-color: #d4f8d4; padding: 10px 15px; border-radius: 8px;">
          <p style="margin: 0; font-size: 1.4em; font-weight: bold; display: flex; justify-content: space-between;">
            <strong>TOTAL</strong> <span>฿${formatCurrency(netTotal)}</span>
          </p>
          <p style="margin: 2px 0 0 0; font-size: 0.75em; color: #4a5568; text-align: right;">
            หลังหักภาษี ณ ที่จ่าย
          </p>
        </div>
      </div>
    `;
  } else {
    netTotal = totalWithVAT;

    // ไม่มีการหักภาษี ณ ที่จ่าย
    resultDiv.innerHTML = `
      <div class="fadeIn" style="line-height: 1.8; font-size: 1.1em;">
        <p style="display: flex; justify-content: space-between;">
          <strong>ราคาก่อน VAT</strong> <span>฿${formatCurrency(
            beforeVAT
          )}</span>
        </p>
        <p style="display: flex; justify-content: space-between;">
          <strong>VAT ${vatPercent}%</strong> <span>฿${formatCurrency(
      vatAmount
    )}</span>
        </p>
        <hr style="margin: 10px 0;">
        <p style="display: flex; justify-content: space-between;">
          <strong>ราคารวม VAT</strong> <span>฿${formatCurrency(
            totalWithVAT
          )}</span>
        </p>
        <p><strong>ไม่มีหักภาษี ณ ที่จ่าย</strong></p>
        <hr style="margin: 10px 0;">
        <div style="background-color: #d4f8d4; padding: 10px 15px; border-radius: 8px;">
          <p style="margin: 0; font-size: 1.4em; font-weight: bold; display: flex; justify-content: space-between;">
            <strong>TOTAL</strong> <span>฿${formatCurrency(netTotal)}</span>
          </p>
        </div>
      </div>
    `;
  }
}
