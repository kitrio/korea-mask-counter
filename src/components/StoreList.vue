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
        @keydown.enter="getStoreMask"
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
export default {
  name: 'StoreList',
  data () {
    return {
      search: '',
      storeUrl: 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=',
      list: [],
      mapContainer: null,
      tileLayer: null,
      layers: [],
      currentLocation: []
    }
  },
  watch: {
    mapMove: function () {
      this.mapContainer.on('moveend', function (ev) {
        console.log('-----------------')
        console.log(ev.latlng)
        console.log(ev)
      })
    }
  },
  mounted () {
    this.initMap()
    this.$nextTick(() => {
      //      this.mapContainer = this.$refs.refMaskMap
      // this.getLocationAllow()
    })
  },
  methods: {
    getStoreMask () {
      this.getLocationAllow()
      const encoded = encodeURI(this.search)
      this.axios({
        method: 'get',
        url: this.storeUrl + encoded
      }).then((response) => {
        this.list = response.data// this.temp
        // console.log(response.data)
        this.mapContainer.panTo([50, 30])
        console.log(this.mapContainer.getCenter())

        this.marker()
      })
    },
    initMap () {
      this.mapContainer = L.map('maskMap').setView([35.224198, 129.0138931], 14)
      this.tileLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 16,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      )
      this.tileLayer.addTo(this.mapContainer)
      this.mapContainer.on('zoomend', function () {
        // callback
        console.log('zooooooooom')
      })

      this.mapContainer.on('dragend', function () {
        // callback
        console.log('draaaaaaag')
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
        const icon = new LeafIcon({ iconUrl: `assets/${this.setIcon(obj.remain_stat)}` })
        L.marker([obj.lat, obj.lng], { icon: icon }).addTo(this.mapContainer)
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
        // this.mapContainer.setView(new L.LatLng(35.224198, 129.0138931), 11, { animation: true })
        this.$refs.refMaskMap.panTo([50, 30])
        // this.$refs.refMaskMap.panTo(new L.LatLng(latitude, longitude))
      })
    }
  }
}
</script>

<style>
  #maskMap {height: 500px;}
</style>
