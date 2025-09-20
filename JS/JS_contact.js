document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    const form = event.target;

    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
      return;
    }

    event.preventDefault();

    const alertBox = document.getElementById("successAlert");
    const checkIcon = document.getElementById("checkIcon");
    const sendBtn = document.getElementById("sendBtn");

    checkIcon.style.animation = "none";
    void checkIcon.offsetWidth;
    checkIcon.style.animation = "popSpin 0.6s ease-out";

    alertBox.style.display = "block";
    alertBox.classList.add("animate__animated", "animate__fadeInDown");

    sendBtn.textContent = "ส่งแล้ว ✅";
    sendBtn.classList.remove("btn-primary");
    sendBtn.classList.add("btn-success");
    sendBtn.disabled = true;
  });

// กด OK เพื่อปิด alert และรีเซ็ตฟอร์ม
document.getElementById("okBtn").addEventListener("click", function () {
  const alertBox = document.getElementById("successAlert");

  alertBox.classList.remove("animate__fadeInDown");
  alertBox.classList.add("animate__fadeOutUp", "animate__faster");

  setTimeout(() => {
    alertBox.style.display = "none";
    const form = document.getElementById("contactForm");
    form.reset();

    const sendBtn = document.getElementById("sendBtn");
    sendBtn.textContent = "ส่งข้อความ";
    sendBtn.classList.remove("btn-success");
    sendBtn.classList.add("btn-primary");
    sendBtn.disabled = false;
  }, 400);

  // รีโหลดหน้าใหม่
  location.reload();
});
