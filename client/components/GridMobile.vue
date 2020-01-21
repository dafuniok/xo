<template>
  <!-- Grid Mobile -->
  <div class="grid-mobile">
    <GridTemplate :cfg="grid" />
  </div>
</template>

<script>
import GridTemplate from "@/components/GridTemplate"
import { mapGetters } from "vuex"

export default {
  name: "GridMobile",
  components: {
    GridTemplate
  },
  data() {
    return {}
  },
  computed: {
    grid: function() {
      return this.getGrid()
    }
  },
  methods: {
    ...mapGetters({
      getGrid: "grid/config"
    })
  }
}
</script>

<style scoped>
.grid-mobile {
  padding: 0 40px;
  text-align: center;
}
</style>
