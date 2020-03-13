<template>
  <v-app>
    <div
      id="maskMap"
      ref="refMaskMap"
    />
    <v-container
      fluid
      grid-list-md
    >
      <p>힘내요 </p>
      <v-text-field
        v-model="search"
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="찾기"
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
          <v-hover
            v-slot:default="{ hover }"
            open-delay="180"
          >
            <v-card
              :elevation="hover ? 12 : 2"
              v-bind:color="setColor(item.remain_stat)"
            >
              <v-card-text>{{ item.addr }}</v-card-text>
              <v-card-text>{{ item.name }}</v-card-text>
              <v-card-text>들어오는 시간{{ item.stock_at }}</v-card-text>
              <v-card-text>마지막 확인된 시간{{ item.created_at }}</v-card-text>
              <v-card-text>마스크 {{ setName(item.remain_stat) }}</v-card-text>
            </v-card>
          </v-hover>
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
      currentLocation: [],
      center: [35.224198, 129.0138931]
    }
  },
  mounted () {
    this.initMap()
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
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      )
      this.tileLayer.addTo(this.mapContainer)
      const getStoreByGeo = this.getStoreByGeo
      this.mapContainer.on('zoomend', function () {
        // callback
        // getStoreByGeo()
      })

      this.mapContainer.on('dragend', function () {
        // callback
        getStoreByGeo()
      })
    },
    getStoreByAddr () {
      const encoded = encodeURI(this.search)
      this.axios({
        method: 'get',
        url: process.env.VUE_APP_STORE_BY_ADDR_URL + encoded
      }).then((response) => {
        this.list = response.data// this.temp
        this.mapContainer.panTo([50, 30])
        this.marker()
      })
    },
    getStoreByGeo () {
      this.center[0] = this.mapContainer.getCenter().lat
      this.center[1] = this.mapContainer.getCenter().lng
      this.axios({
        method: 'get',
        url: process.env.VUE_APP_STORE_BY_GEO_URL + `lat=${this.center[0]}&lng=${this.center[1]}&m=1500`
      }).then((response) => {
        this.list = response.data
        this.marker()
      })
    },
    marker () {
      const LeafIcon = L.Icon.extend({
        options: {
          shadowUrl: 'assets/leaf-shadow.png',
          iconSize: [38, 75],
          shadowSize: [50, 60],
          iconAnchor: [22, 74],
          shadowAnchor: [4, 62],
          popupAnchor: [-3, -76]
        }
      })
      for (const place in this.list.stores) {
        const obj = this.list.stores[place]
        const icon = new LeafIcon({ iconUrl: `assets/leaf-${this.setColor(obj.remain_stat)}.png` })
        L.marker([obj.lat, obj.lng], { icon: icon }).addTo(this.mapContainer)
      }
    },
    setColor (remainStat) {
      const color = new Map()
      color.set('full', 'green')
      color.set('some', 'yellow')
      color.set('few', 'red')
      color.set('empty', 'gray')
      color.set('break', 'gray')
      return color.get(remainStat)
    },
    setName (remainStat) {
      const color = new Map()
      color.set('full', '100개 충분해요')
      color.set('some', '100에서 30개')
      color.set('few', '부족해요')
      color.set('empty', '재고 없어요')
      color.set('break', '판매중지')
      return color.get(remainStat)
    },
    getLocationAllow () {
      navigator.geolocation.getCurrentPosition(function (pos) {
        const latitude = pos.coords.latitude
        const longitude = pos.coords.longitude
        console.log('현재 위치는 : ' + latitude + ', ' + longitude)
        // L.map('maskMap').invalidateSize()
        // this.mapContainer.setView(new L.LatLng(35.224198, 129.0138931), 11, { animation: true })
        // this.$refs.refMaskMap.panTo(new L.LatLng(latitude, longitude))
      })
    }
  }
}
</script>

<style>
  #maskMap {height: 500px;}
</style>
