const formLogin = document.getElementById("formlogin");
const mailInput = document.getElementById("email");
const passInput = document.getElementById("password");
async function handleLogin() {
  const email = mailInput.value;
  const password = passInput.value;

  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    alert(data.message || "Login failed");
  } else {
    window.location.href = "/main";
  }
}

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  handleLogin();
});
