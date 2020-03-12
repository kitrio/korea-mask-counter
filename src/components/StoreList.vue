<template>
  <v-app>
    <div id="maskMap" />
    <v-container
      fluid
      grid-list-md
    >
      <p>힘내요 대한민국</p>
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
        lg2
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
export default {
  name: 'StoreList',
  data () {
    return {
      search: '',
      storeUrl: 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=',
      list: [],
      map: null,
      tileLayer: null,
      layers: []
    }
  },
  watch: {

  },
  mounted () {
    this.getStoreMask()
    this.initMap()
    this.initLayers()
  },
  methods: {
    getStoreMask () {
      const encoded = encodeURI(this.search)
      this.axios({
        method: 'get',
        url: this.storeUrl + encoded
      }).then((response) => {
        this.list = this.temp// response.data
        // console.log(encoded)
        // console.log(this.storeUrl + encoded)
        // console.log(response.data)
      })
    },
    initMap () {
      this.maskMap = this.$leaflet.map('maskMap').setView([35.224198, 129.0138931], 14)
      this.$leaflet.tileLayer = this.$leaflet.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 16,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      )
      this.$leaflet.tileLayer.addTo(this.maskMap)
    },
    initLayers () {
      var LeafIcon = this.$leaflet.Icon.extend({
        options: {
          shadowUrl: 'assets/leaf-shadow.png',
          iconSize: [38, 95],
          shadowSize: [50, 64],
          iconAnchor: [22, 94],
          shadowAnchor: [4, 62],
          popupAnchor: [-3, -76]
        }
      })

      var greenIcon = new LeafIcon({ iconUrl: 'assets/leaf-green.png' })

      this.$leaflet.marker([, ], { icon: greenIcon }).addTo(this.maskMap)
    }
  }
}
</script>

<style>
  #maskMap {height: 500px;}
</style>
