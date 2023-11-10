<template>
  <div class="signup-form">
    <img src="@/assets/logo.png" alt="Logo" class="logo" />
    <h1>Sign Up</h1>
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
          type="text"
          v-model="formData.email"
          class="form-control"
          placeholder="Email"
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
      <div class="form-group">
        <input
          type="password"
          v-model="formData.confirmPassword"
          class="form-control"
          placeholder="Confirm Password"
        />
      </div>
      <p v-if="passwordsNotMatch" class="error-message">
        Passwords do not match
      </p>
      <p v-if="usernameExistsError" class="error-message">
        {{ usernameExistsError }}
      </p>
      <button type="submit" class="btn btn-primary">Sign Up</button>
    </form>
    <router-link to="/login" class="signup-link"
      >already have an account?</router-link
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
        email: "",
        password: "",
        confirmPassword: "",
      },
      passwordsNotMatch: false,
      usernameExistsError: "",
    };
  },
  methods: {
    handleSubmit() {
      if (this.formData.password !== this.formData.confirmPassword) {
        this.passwordsNotMatch = true;
        return;
      } else {
        this.passwordsNotMatch = false;
      }

      const data = {
        username: this.formData.username,
        email: this.formData.email,
        password: this.formData.password,
      };

      const csrftoken = this.getCookie("csrftoken");

      const config = {
        headers: {
          "X-CSRFToken": csrftoken,
        },
      };

      axios
        .post("http://localhost:8000/sign_up/", data, config)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error.response.data.error);
          if (error.response.data.error === "Username already exists") {
            this.usernameExistsError = "Username already exists";
            console.log(this.usernameExistsError);
            console.log("testtest");
          }
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
.signup-form {
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
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
}

.logo {
  width: 50px;
  height: auto;
  margin-right: 80px;
  position: absolute;
  top: 5;
  left: 0;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #2094f0;
  color: white;
  cursor: pointer;
}

.btn:hover {
  background-color: #2094f0;
}

.error-message {
  color: red;
}
</style>
