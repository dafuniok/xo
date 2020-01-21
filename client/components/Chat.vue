<template>
  <!-- Chat  -->
  <!-- eslint-disable -->
  <div>
    <div class="v-card chat">
      <ul ref="messages" class="messages">
        <li v-for="(message, index) in messages" :key="index" class="message">
          <i :title="message.date">
            {{ message.date.split("T")[1].slice(0, -2) }} </i>: {{ message.text }}
        </li>
      </ul>
    </div>
    <input
      v-model="message"
      class="inputMessage"
      type="text"
      placeholder="Type here..."
      @keyup.enter="sendMessage"
    >
  </div>
</template>

<script>
// TODO:: Use chat
import socket from "~/plugins/socket.io.js"

export default {
  asyncData(context, callback) {
    socket.emit("last-messages", function(messages) {
      callback(null, {
        messages,
        message: ""
      })
    })
  },
  data() {
    return {
      messages: [],
      message: ""
    }
  },
  watch: {
    messages: "scrollToBottom"
  },
  beforeMount() {
    socket.on("new-message", message => {
      this.messages.push(message)
    })
  },
  mounted() {
    this.scrollToBottom()
  },
  methods: {
    sendMessage() {
      if (!this.message.trim()) {
        return
      }
      const message = {
        date: new Date().toJSON(),
        text: this.message.trim()
      }
      this.messages.push(message)
      this.message = ""
      socket.emit("send-message", message)
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
      })
    }
  }
}
</script>

<style scoped>
/* Font */
.messages {
  font-size: 150%;
}

.inputMessage {
  font-size: 100%;
}

.log {
  color: gray;
  font-size: 70%;
  margin: 5px;
  text-align: center;
}

/* Messages */
.chat {
  height: 200px;
  max-width: 480px;
  margin-bottom: 60px;
}

.messages {
  height: 100%;
  margin: 0;
  font-size: 18px;
  overflow-y: scroll;
  padding: 10px 20px 10px 20px;
}

/* Input */
.inputMessage {
  bottom: 36px;
  height: 60px;
  left: 0;
  outline: none;
  padding-left: 10px;
  position: fixed;
  right: 0;
  width: 100%;
}
</style>
