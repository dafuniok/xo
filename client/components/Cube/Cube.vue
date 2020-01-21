<template>
  <!-- Cube (contains a Ring or a Cross)  -->
  <g>
    <Ring v-if="myCube" :x="x" :y="y" :circle-radius="circleRadius" />
    <Cross v-else :x="x" :y="y" />
  </g>
</template>

<script>
import Ring from "@/components/Cube/Ring"
import Cross from "@/components/Cube/Cross"
import { mapGetters } from "vuex"

export default {
  name: "Cube",
  components: {
    Ring,
    Cross
  },
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
    edgeLength: {
      type: Number,
      required: true,
      default: 25
    }
  },
  data() {
    return {
      myCube: false
    }
  },
  computed: {
    circleRadius: function() {
      return this.edgeLength / 3.4
    }
  },
  beforeMount() {
    this.myCube = this.getTurn()
  },
  methods: {
    ...mapGetters({
      getTurn: "game/getTurn"
    })
  }
}
</script>
