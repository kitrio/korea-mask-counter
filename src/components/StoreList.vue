<template>
  <v-app>
    <l-map
      ref="maskMap"
      :max-zoom="16"
      :zoom="zoom"
      :center="center"
      @update:center="centerUpdate"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <l-marker :lat-lng="withPopup">
        <l-popup>
          
        </l-popup>
      </l-marker>
    </l-map>
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
              color="#00FF00"
            >
              <v-card-text>{{ item.addr }}</v-card-text>
              <v-card-text>{{ item.name }}</v-card-text>
              <v-card-text>들어오는 시간{{ item.stock_at }}</v-card-text>
              <v-card-text>마지막 확인된 시간{{ item.created_at }}</v-card-text>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
export default {
  name: 'StoreList',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  data () {
    return {
      search: '',
      storeByAddr: 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=',
      storeByGeo: 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?',
      list: [],
      layers: [],
      currentLocation: [],
      zoom: 16,
      center: [35.224198, 129.0138931],
      markers: {
        latitude: '',
        longitude: ''
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.mapContainer = this.$refs.refMaskMap
    })
  },
  methods: {
    getStoreByAddr () {
      const encoded = encodeURI(this.search)
      this.axios({
        method: 'get',
        url: this.storeByAddr + encoded
      }).then((response) => {
        this.list = response.data// this.temp
        // console.log(this.storeUrl + encoded)
        // console.log(response.data)
        this.marker()
      })
    },
    getStoreByGeo (lat, lng) {
      const currentLocation = `lat=${lat}&lng=${lng}&m=1500`
      this.axios({
        method: 'get',
        url: this.storeByGeo + currentLocation
      }).then((response) => {
        this.list = response.data
      }).catch(() => {
        alert('서버가 응답하지 않습니다.')
      })
    },
    centerUpdate (center) {
      this.center = center
      this.getStoreByGeo(center.lat, center.lng)
      console.log(center)
      console.log(center.lat)

      // this.maker(center)
    },
    marker (center) {
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
        const icon = new LeafIcon({ iconUrl: `assets/${this.setIcon(obj.remain_stat)}` })
        L.marker([obj.lat, obj.lng], { icon: icon }).addTo(this.$refs.refMaskMap)
      }
    },
    setIcon (remainStat) {
      const icon = new Map()
      icon.set('full', 'leaf-green.png')
      icon.set('some', 'leaf-yellow.png')
      icon.set('few', 'leaf-red.png')
      icon.set('empty', 'leaf-gray.png')
      icon.set('break', 'leaf-gray.png')
      return icon.get(remainStat)
    },
    getLocationAllow () {
      navigator.geolocation.getCurrentPosition(function (pos) {
        const latitude = pos.coords.latitude
        const longitude = pos.coords.longitude
        console.log('현재 위치는 : ' + latitude + ', ' + longitude)
        // L.map('maskMap').invalidateSize()
        // this.$refs.refMaskMap.panTo(new L.LatLng(latitude, longitude))
      })
    }
  }
}
</script>

<style>
  #maskMap {height: 500px;}
</style>
