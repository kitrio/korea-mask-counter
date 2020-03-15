<template>
  <v-app>
    <div
      id="maskMap"
    />
    <v-container
      grid-list-md
    >
      <p> 코로나 19 함께 극복해요 이겨 낼수 있습니다! </p>
      <p> 약사님, 우체국, 하나로마트 직원 분들께도 감사드립니다. </p>
      <v-text-field
        v-model="search"
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="주소로 찾기"
        @keydown.enter="getStoreByAddr"
      />
      <v-layout
        row
        wrap
        xs12
        sm6
        md4
        lg4
      >
        <v-flex
          v-for="(item, index) in list.stores"
          :key="index"
        >
          <a
            :href="`https://www.google.com/maps/place/${item.addr}/@${item.lat},${item.lng}`"
            target="_blank"
          >
            <v-hover
              v-slot:default="{ hover }"
              open-delay="100"
            >
              <v-card
                :elevation="hover ? 12 : 2"
                :color="setColor(item.remain_stat)"
              >
                <v-card-text>{{ item.addr }}</v-card-text>
                <v-card-text>{{ item.name }}</v-card-text>
                <v-card-text>들어오는 시간{{ item.stock_at }}</v-card-text>
                <v-card-text>마지막 확인된 시간{{ item.created_at }}</v-card-text>
                <v-card-text>마스크 {{ setName(item.remain_stat) }}</v-card-text>
              </v-card>
            </v-hover>
          </a>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import L from 'leaflet'
export default {
  name: 'StoreList',
  data () {
    return {
      search: '',
      list: [],
      mapContainer: null,
      tileLayer: null,
      layers: [],
      center: [35.224198, 129.0138931]
    }
  },
  mounted () {
    this.initMap()
    this.getLocationAllow()
  },
  methods: {
    initMap () {
      this.mapContainer = L.map('maskMap', {
        center: this.center,
        zoom: 14
      })
      this.tileLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 16,
          attribution: '오류사항:mario64aq@gmail.com</br> &copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      )
      this.tileLayer.addTo(this.mapContainer)
      this.mapContainer.on('dragend', () => {
        // callback
        this.getStoreByGeo()
      })
    },
    getStoreByAddr () {
      const encoded = encodeURI(this.search)
      this.axios({
        method: 'get',
        url: process.env.VUE_APP_STORE_BY_ADDR_URL + encoded
      }).then(response => {
        this.list = response.data
        this.mapContainer.panTo([this.list.stores[0].lat, this.list.stores[0].lng])
        this.marker()
      })
    },
    getStoreByGeo () {
      this.center[0] = this.mapContainer.getCenter().lat
      this.center[1] = this.mapContainer.getCenter().lng
      this.axios({
        method: 'get',
        url: process.env.VUE_APP_STORE_BY_GEO_URL + `lat=${this.center[0]}&lng=${this.center[1]}&m=1500`
      }).then(response => {
        this.list = response.data
        this.marker()
      })
    },
    marker () {
      const LeafIcon = L.Icon.extend({
        options: {
          shadowUrl: 'assets/leaf-shadow.png',
          iconSize: [38, 65],
          shadowSize: [50, 40],
          iconAnchor: [22, 74],
          shadowAnchor: [4, 62],
          popupAnchor: [-3, -76]
        }
      })
      for (const place in this.list.stores) {
        const obj = this.list.stores[place]
        const icon = new LeafIcon({ iconUrl: `assets/leaf-${this.setColor(obj.remain_stat)}.png` })
        L.marker([obj.lat, obj.lng], { icon: icon }).bindPopup(obj.name).openPopup().addTo(this.mapContainer)
      }
    },
    setColor (remainStat) {
      const color = new Map()
      color.set('planty', 'green')
      color.set('some', 'yellow')
      color.set('few', 'red')
      color.set('empty', 'gray')
      color.set('break', 'gray')
      color.set('null', 'null')
      return color.get(remainStat)
    },
    setName (remainStat) {
      const color = new Map()
      color.set('planty', '100개 이상 충분해요')
      color.set('some', '100에서 30개')
      color.set('few', '부족해요')
      color.set('empty', '재고 없어요')
      color.set('break', '판매중지')
      color.set('null', '판매중지')
      return color.get(remainStat)
    },
    getLocationAllow () {
      navigator.geolocation.getCurrentPosition(pos => {
        this.center[0] = pos.coords.latitude
        this.center[1] = pos.coords.longitude
        this.mapContainer.panTo(this.center, 15)
        this.getStoreByGeo()
      })
    }
  }
}
</script>

<style scoped>
  #maskMap {margin-left: 3.5em; margin-right: 3.5em; height: 30rem;}
</style>
