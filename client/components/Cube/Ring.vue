<template>
  <!-- Ring -->
  <g>
    <circle
      class="circle-inner"
      :cx="x"
      :cy="y"
      :r="circleRadius"
      fill="none"
      stroke-width="8"
    />
    <circle
      class="circle-outer"
      :cx="x"
      :cy="y"
      :r="circleRadius + 4"
      fill="none"
      stroke-width="1"
    />
  </g>
</template>

<script>
export default {
  name: "Ring",
  props: {
    x: {
      type: Number,
      required: true,
      default: 0
    },
    y: {
      type: Number,
      required: true,
      default: 0
    },
    circleRadius: {
      type: Number,
      required: false,
      default: 50
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
.circle-inner {
  stroke: #8ed7b6;
}

.circle-outer {
  stroke: #60c799;
}
</style>
