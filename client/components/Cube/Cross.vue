<template>
  <!-- Cross -->
  <g>
    <!-- Inner Cross -->
    <path
      :d="
        `M ${x - 20} ${y - 20} l ${size} ${size}
         M ${x + 20} ${y - 20} l ${-size} ${size}`
      "
      :stroke="fillColor"
      stroke-width="7"
    />
    <!-- Border path starts on smallest top left point and moves on clockwise -->
    <!-- eslint-disable -->
    <path
      :d="`M ${x - bigEdgeLength} ${y - 22} l ${bigEdgeLength} ${bigEdgeLength}
             ${bigEdgeLength} ${-bigEdgeLength} ${smallEdgeLength} ${smallEdgeLength}
             ${-bigEdgeLength} ${bigEdgeLength} ${bigEdgeLength} ${bigEdgeLength} ${-smallEdgeLength} ${smallEdgeLength}
             ${-bigEdgeLength} ${-bigEdgeLength} ${-bigEdgeLength} ${bigEdgeLength} ${-smallEdgeLength} ${-smallEdgeLength}
             ${bigEdgeLength} ${-bigEdgeLength} ${-bigEdgeLength} ${-bigEdgeLength} ${smallEdgeLength + 0.35} ${-(smallEdgeLength + 0.35)}`"
      :stroke="borderColor"
      stroke-width="1"
      fill="none"
    />
  </g>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "Cross",
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
    size: {
      type: Number,
      required: false,
      default: 40
    },
    bigEdgeLength: {
      type: Number,
      required: false,
      default: 17
    },
    smallEdgeLength: {
      type: Number,
      required: false,
      default: 5
    },
    fillColor: {
      type: String,
      required: false,
      default: "#fbaaa2"
    },
    borderColor: {
      type: String,
      required: false,
      default: "#fa8a80"
    }
  },
  data() {
    return {}
  },
  methods: {
    ...mapGetters({
      gridConfig: "grid/config"
    })
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

.opponent-circle-inner {
  stroke: #f87e72;
}

.opponent-circle-outer {
  stroke: #c76960;
}
</style>
