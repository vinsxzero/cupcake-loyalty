const formLogin = document.getElementById("formlogin");
const mailInput = document.getElementById("email");
const passInput = document.getElementById("password");
async function handleLogin() {
  const email = mailInput.value;
  const password = passInput.value;
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);
    if (data.redirect) {
      window.location.href = data.redirect;
    }

    if (!response.ok) {
      alert(data.message);
    } else {
      window.location.href = "/main";
    }
  } catch (error) {
    console.error("Login error:", error);
    alert(error);
  }
}

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  handleLogin();
});
