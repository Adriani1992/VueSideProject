<template>
  <div class="mask-map" id="mask-map"></div>
</template>

<script>
import L from 'leaflet'

export default {
    name:'maskMap',
    data(){
        return{
            // 因為別的地方用不到map 所以不需要放到vuex中
            map:{},
            markers:[],
        }
    },
    mounted(){
        //以下動作會將地圖初始化    
        this.map = L.map('mask-map',{
            center: [25.03, 121.55],
            zoom: 14,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
        {attribution: '<a target="_blank" href="https://www.openstreetmap.org/">&copy; OpenStreetMap 貢獻者 </a>',
        maxZoom: 18}).addTo(this.map)
    },
    computed:{
       currDistrictInfo(){
            return this.$store.getters.currDistrictInfo;
        },
        filteredStores(){
            return this.$store.getters.filteredStores;
        }
    },
    watch:{
        //切換行政區
        currDistrictInfo(dist){
            //this.map.panTo()可以指定地圖中心點
            // console.log(dist)
            this.map.panTo(new L.LatLng(dist.latitude, dist.longitude));
        },
        filteredStores(stores){
            //先清除原有的marker
            this.clearMarker();
            //根據藥局資訊加上對應maker
            stores.forEach((element)=> this.addMarker(element));
            
        }
    },
    methods:{
        addMarker(item){
            //標記的圖示，可自行替換參數
            const ICON = {
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41,41]
            };
            // console.log(item)
            //將標記放置到地圖上
            const marker = L.marker([item.longtitude, item.latitude], ICON);
            // console.log(marker)
            // Ｌ.marker 的使用方法
            // https://docs.eegeo.com/eegeo.js/v0.1.280/docs/leaflet/L.Marker/
            marker.addTo(this.map).bindPopup(`<h2 class="popup-name">${item.name}</h2>`);
            //替marker 加入id 與經緯度資訊
            marker.markerId = item.id;
            marker.lng = item.longtitude;
            marker.lat = item.latitude;
            //將marker push 到陣列裡
            this.markers.push(marker);
        },
        clearMarker(){
            //清除地圖所有標記
            this.map.eachLayer((layer)=>{
                if(layer instanceof L.Marker)
                // 講解什麼是instanceof
                // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof
                {
                    this.map.removeLayer(layer);
                }
                // 加上清空陣列
                this.markers.length = 0;
            });
        
        },
        triggerPopup(markerId){
            // 找出目標標記
            const marker = this.markers.find((d)=>d.markerId === markerId);
            // 將地圖中心指向目標標記，並開啟Popup
            this.map.flyTo(new L.LatLng(marker.lng, marker.lat), 15);
            marker.openPopup()
            // console.log(marker)
        }
    }
}
</script>

<style>

</style>