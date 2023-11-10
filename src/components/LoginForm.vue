<template>
  <div class="login-form">
    <img src="@/assets/logo.png" alt="Logo" class="logo" />

    <h1>Login</h1>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <input
          type="text"
          v-model="formData.username"
          class="form-control"
          placeholder="Username"
        />
      </div>
      <div class="form-group">
        <input
          type="password"
          v-model="formData.password"
          class="form-control"
          placeholder="Password"
        />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
      <p v-if="error" style="color: red">{{ error }}</p>
    </form>
    <router-link to="/signup" class="signup-link"
      >Not registered yet?</router-link
    >
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      formData: {
        username: "",
        password: "",
      },
      error: null, // Ajout de la propriété pour stocker le message d'erreur
    };
  },
  methods: {
    handleSubmit() {
      console.log("Handling submit...");
      const data = {
        username: this.formData.username,
        password: this.formData.password,
      };
      console.log(this.formData.username);

      const csrftoken = this.getCookie("csrftoken");

      const config = {
        headers: {
          "X-CSRFToken": csrftoken,
        },
      };

      axios
        .post("http://localhost:8000/login/", data, config)
        .then((response) => {
          console.log(response.data);
          if (response.status === 200) {
            localStorage.setItem("user", JSON.stringify(response.data));
            console.log("localStorage:", localStorage);
            this.$router.replace({ name: "transcriptionForm" });
          }
        })
        .catch((error) => {
          this.error = error.response.data.message; // Affichage du message d'erreur dans l'interface
          console.error(error);
        });
    },
    getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    },
  },
};
</script>

<style>
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  margin: 10px 0;
}

.form-control {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  background-color: #2094f0;
  color: white;
  cursor: pointer;
}
.logo {
  width: 100px;
  height: auto;
  margin-right: 100px;
  position: absolute;
  top: 5;
  left: 5;
}
.btn:hover {
  background-color: #2094f0;
}
</style>
