<template>
  <div class="transcription-form">
    <img src="@/assets/logo.png" alt="Logo" class="logo" />

    <button @click="logout" class="Btn">
      <div class="sign">
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="sign-out-alt"
          class="svg-inline--fa fa-sign-out-alt fa-w-16"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M488 256c0 13.255-10.745 24-24 24h-208v64c0 22.091-17.909 40-40 40h-160c-26.51 0-48-21.49-48-48v-192c0-26.51 21.49-48 48-48h160c22.091 0 40 17.909 40 40v64h208c13.255 0 24 10.745 24 24zm-313.941-4.485l88-72c4.686-3.821 11.447-3.149 15.269 1.537c3.822 4.686 3.149 11.447-1.537 15.269l-64.971 52.892h195.34c8.837 0 16 7.163 16 16s-7.163 16-16 16h-195.34l64.971 52.892c2.524 2.055 3.889 5.144 3.889 8.242s-1.365 6.187-3.889 8.242c-4.686 3.821-11.447 3.149-15.269-1.537l-88-72c-2.722-2.227-4.16-5.608-3.941-9.037c-0.218-3.429 1.219-6.81 3.941-9.037z"
          ></path>
        </svg>
      </div>
      <span class="text">Logout</span>
    </button>
    <h1>Transcription Form</h1>
    <div class="form-container">
      <audio controls ref="audioPlayer" class="audio-player">
        <source :src="audioUrl" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
      <p class="username">{{ username }}</p>
      <form @submit.prevent="submitTranscription">
        <div class="form-group">
          <textarea
            id="transcriptionText"
            v-model="transcriptionText"
            class="transcription-text"
            placeholder="Transcript the audio"
          ></textarea>
          <p
            v-if="errorMessage"
            class="error-message"
            v-html="errorMessage"
          ></p>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TranscriptionForm",
  data() {
    return {
      audioUrl: "",
      transcriptionText: "",
      errorMessage: "",
    };
  },
  created() {
    if (!localStorage.getItem("user")) {
      this.$router.push("/login");
    } else {
      this.getRandomUntranscribedAudio();
    }
  },
  methods: {
    getRandomUntranscribedAudio() {
      axios
        .get("http://localhost:8000/get_random_untranscribed_audio/")
        .then((response) => {
          const audioData = response.data[0];
          this.audioUrl = `http://localhost:8000/${audioData.audio_name}`;
          this.audioId = audioData.audio_id;
          this.$refs.audioPlayer.load();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    submitTranscription() {
      const user_id = JSON.parse(localStorage.getItem("user")).user;
      const audio_id = this.audioId;
      const csrftoken = localStorage.getItem("csrfToken");

      const data = {
        transcription_text: this.transcriptionText,
      };
      const config = {
        headers: {
          "X-CSRFToken": csrftoken,
        },
      };
      axios
        .post(
          `http://localhost:8000/add_transcription/${user_id}/${audio_id}/`,
          data,
          config
        )
        .then((response) => {
          console.log(response.data);
          alert("Transcription added successfully!");
          location.reload();
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.data.errors) {
              this.errorMessage = error.response.data.errors
                .map((err) => `<p>${err}</p>`)
                .join("");
            }
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    },
    logout() {
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
  },
};
</script>

<style>
.transcription-form {
  align-items: center;
  text-align: center;
  position: center;

  margin-top: 30px;
  font-family: "Arial", sans-serif;
}

.transcription-form h1 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  position: center;
}

.audio-player {
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
  position: center;
}

.form-group {
  margin-bottom: 40px;
}

.transcription-text {
  width: 900%;
  max-width: 600px;
  height: 100px;
  padding: 50px;
  border: 1px solid #ddd;
  border-radius: 20px;
  position: center;
  font-size: 16px;
}
.logo {
  width: 50px;
  height: auto;
  margin-right: 80px;
  position: absolute;
  top: 5;
  left: 0;
}
button {
  background: #2094f0;
  color: #fff;
  font-size: 17px;
  text-transform: uppercase;
  font-weight: 600;
  border: none;
  padding: 20px 30px;
  perspective: 30rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.308);
  position: center;
  overflow: hidden;
}
button.btn.btn-primary {
  background: #2094f0;
}

button.btn.btn-primary::before {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #2094f0;
  border-radius: 10px;
  background: linear-gradient(
    320deg,
    rgba(32, 148, 240, 0.678),
    rgba(145, 201, 247, 0.308)
  );
  color: #2094f0;
  z-index: 1;
  transition: background 3s;
}

button:hover::before {
  animation: rotate 1s;
  transition: all 4s;
}

@keyframes rotate {
  0% {
    transform: rotateY(180deg);
  }

  100% {
    transform: rotateY(360deg);
  }
}

.error-message {
  color: red;
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 14px;
}

.audio-player {
  width: 150%;
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 70px;
  position: center;
}

.Btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 45px;
  height: 45px;
  border: none;
  background: #2094f0;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  margin: 20px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
  background-color: rgba(32, 148, 240, 0.678);
}

.sign svg {
  width: 17px;
}

.sign svg path {
  fill: white;
}
.text {
  position: absolute;
  right: 0%;
  width: 0%;
  opacity: 0;
  color: white;
  font-size: 1.2em;
  font-weight: 600;
  transition-duration: 0.3s;
}
.Btn:hover {
  width: 210px;
  border-radius: 40px;
  background: #2094f0;
  transition-duration: 0.6s;
}

.Btn:hover .text {
  opacity: 1;
  width: 70%;
  background: #2094f0;
  transition-duration: 0.3s;
  padding-right: 10px;
}
/* button click effect*/
.Btn:active {
  transform: translate(2px, 2px);
  background: #2094f0;
}
</style>
