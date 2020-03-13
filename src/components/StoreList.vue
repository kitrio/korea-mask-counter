<template>
  <v-app>
    <div id="maskMap" />
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
export default {
  name: 'StoreList',
  data () {
    return {
      search: '',
      storeUrl: 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=',
      list: [],
      map: null,
      tileLayer: null,
      layers: [],
      LeafIcon: null
      // temp: {
      //   address: '부산광역시 북구 화명동',
      //   count: 26,
      //   stores: [{
      //     addr: '부산광역시 북구 금곡대로303번길 2, 106,107호 (화명동, 시티타워)',
      //     code: '21800553',
      //     created_at: '2020/03/11 21:35:00',
      //     lat: 35.2356316,
      //     lng: 129.0134634,
      //     name: '메디팜이화약국',
      //     remain_stat: 'empty',
      //     stock_at: '2020/03/11 16:02:00',
      //     type: '01'
      //   },
      //   {
      //     addr: '부산광역시 북구 금곡대로 270, 화명동대림타운 1층 104호 (화명동)',
      //     code: '21802955',
      //     created_at: '2020/03/11 21:35:00',
      //     lat: 35.232378,
      //     lng: 129.0138931,
      //     name: '웃는약국',
      //     remain_stat: 'few',
      //     stock_at: '2020/03/11 10:07:00',
      //     type: '01'
      //   }, {
      //     addr: '부산광역시 북구 금곡대로 287, 3층 303호 (화명동, 삼한골든뷰)',
      //     code: '21806586',
      //     created_at: '2020/03/11 21:35:00',
      //     lat: 35.2341962,
      //     lng: 129.0132956,
      //     name: '화명수약국',
      //     remain_stat: 'empty',
      //     stock_at: '2020/03/11 08:33:00',
      //     type: '01'
      //   }, {
      //     addr: '부산광역시 북구 양달로8번길 16 (화명동)',
      //     code: '21809364',
      //     created_at: '2020/03/11 21:35:00',
      //     lat: 35.2409337,
      //     lng: 129.0149199,
      //     name: '뉴경남약국',
      //     remain_stat: 'empty',
      //     stock_at: '2020/03/11 16:51:00',
      //     type: '01'
      //   }, {
      //     addr: '부산광역시 북구 화명대로 35 (화명동)',
      //     code: '21817090',
      //     created_at: '2020/03/11 21:35:00',
      //     lat: 35.2351669,
      //     lng: 129.0119922,
      //     name: '이상약국',
      //     remain_stat: 'empty',
      //     stock_at: '2020/03/11 15:16:00',
      //     type: '01'
      //   }, {
      //     addr: '부산광역시 북구 양달로 74, 화명동부종합상가 118호 (화명동)',
      //     code: '21820562',
      //     created_at: '2020/03/11 21:35:00',
      //     lat: 35.2440036,
      //     lng: 129.0211645,
      //     name: '그린약국',
      //     remain_stat: 'empty',
      //     stock_at: '2020/03/11 08:38:00',
      //     type: '01'
      //   }, {
      //     addr: '부산광역시 북구 금곡대로 224 (화명동)',
      //     code: '21825831',
      //     created_at: '2020/03/11 21:35:00',
      //     lat: 35.2283075,
      //     lng: 129.0126636,
      //     name: '비타민약국',
      //     remain_stat: 'empty',
      //     stock_at: '2020/03/11 14:57:00',
      //     type: '01'
      //   }, {
      //     addr: '부산광역시 북구 금곡대로 166, 316호 (화명동, 롯데캐슬플라자)',
      //     code: '21827389',
      //     created_at: '2020/03/11 21:35:00',
      //     lat: 35.2220606,
      //     lng: 129.0106434,
      //     name: '정약국',
      //     remain_stat: 'empty',
      //     stock_at: '2020/03/11 11:47:00',
      //     type: '01'
      //   }, {
      //     addr: '부산광역시 북구 금곡대로 287, 6층 608호 (화명동)',
      //     code: '21827800',
      //     created_at: '2020/03/11 21:35:00',
      //     lat: 35.2341962,
      //     lng: 129.0132956,
      //     name: '건강한약국',
      //     remain_stat: 'empty',
      //     stock_at: '2020/03/11 08:33:00',
      //     type: '01'
      //   }, {
      //     addr: '부산광역시 북구 학사로 15 (화명동)',
      //     code: '21827893',
      //     created_at: '2020/03/11 21:35:00',
      //     lat: 35.224198,
      //     lng: 129.0076403,
      //     name: '대학로약국',
      //     remain_stat: 'empty',
      //     stock_at: '2020/03/11 09:06:00',
      //     type: '01'
      //   }

      //   ]
      // }
    }
  },
  watch: {

  },
  mounted () {
    this.initMap()
  },
  methods: {
    getStoreMask () {
      const encoded = encodeURI(this.search)
      this.axios({
        method: 'get',
        url: this.storeUrl + encoded
      }).then((response) => {
        this.list = response.data// this.temp
        // console.log(encoded)
        // console.log(this.storeUrl + encoded)
        // console.log(response.data)
        this.mapMarker()
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
    mapMarker () {
      const LeafIcon = this.$leaflet.Icon.extend({
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
        this.$leaflet.marker([obj.lat, obj.lng], { icon: icon }).addTo(this.maskMap)
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
    }

  }
}
</script>

<style>
  #maskMap {height: 500px;}
</style>
