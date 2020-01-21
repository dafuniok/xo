<template>
  <!-- Index Page -->
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <Playground />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Playground from "@/components/Playground"

export default {
  components: {
    Playground
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

html {
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
}

html,
input {
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue",
    Helvetica, Arial, "Lucida Grande", sans-serif;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

ul {
  list-style: none;
  word-wrap: break-word;
}

/* Pages */
.pages {
  height: 100%;
  margin: 0;
  padding: 0;
  width: 100%;
}

.page {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
