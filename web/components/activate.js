const formActivate = document.getElementById("formActivate");
const formForget = document.getElementById("formForget");
const oldPasswordInp = document.getElementById("oldPassword");
const newPasswordInp = document.getElementById("newPassword");
const confirmPasswordInp = document.getElementById("confirmPassword");
const email = decodeURIComponent(window.location.pathname.split("/").pop());

async function handleActivate() {
  const oldPassword = oldPasswordInp.value;
  const newPassword = newPasswordInp.value;
  const confirmPassword = confirmPasswordInp.value;
  console.log("URL completa:", window.location.href);
  console.log("Query string:", window.location.search);
  console.log("Email:", email);
  if (!email) {
    alert("Email is required");
    return;
  }
  if (newPassword !== confirmPassword) {
    alert("As senhas não coincidem. Por favor, tente novamente.");
    return;
  }
  const response = await fetch(`/activate-user/${encodeURIComponent(email)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, oldPassword, newPassword }),
  });
  const data = await response.json();
  if (!response.ok) {
    alert(data.message);
  }
  alert(data.message);
  window.location.href = "/";
}

const emailForget = document.getElementById("emailForget");
async function forgetPassword() {
  const email = emailForget.value;
  console.log("Email for forget password:", email);
  try {
    const response = await fetch(`/forget-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    alert(data.message);
    window.location.href = "/";
  } catch (error) {
    console.error("Forget password error:", error);
    alert(error);
  }
}
if (formForget) {
  formForget.addEventListener("submit", (e) => {
    e.preventDefault();
    forgetPassword();
  });
}
if (formActivate) {
  formActivate.addEventListener("submit", async (e) => {
    e.preventDefault();
    handleActivate();
  });
}
