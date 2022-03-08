<template>
<div id="app">
   <!-- aside-menu 左側欄 側欄元件-->
    <asideMenu @triggerMarkerPopup="openPopup($event)" ref="menu"/>  

  <!-- 地圖區塊 -->
    <maskMap ref="map"/>

  <lightBox />
</div>

</template>

<script>
import { mapActions } from 'vuex';
import asideMenu from '@/components/asideMenu.vue'
import lightBox from '@/components/lightBox.vue'
import maskMap from '@/components/maskMap.vue'


export default {
  name: 'App',
  components: {
   asideMenu,
   lightBox,
   maskMap
  },
  methods:{
    ...mapActions(['fetchLocation', 'fetchPharmacies']),
    openPopup(id){
      this.$refs.map.triggerPopup(id)
    }
  },
  mounted(){
    this.fetchLocation();
    this.fetchPharmacies();
  }

}
</script>

<style lang="scss" src="./style.scss">

</style>
