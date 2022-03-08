import { createStore } from 'vuex'

export default createStore({
  state: {
    // 使用者目前所選縣市，預設值為台北市
    currCity: '臺北市',
    // 使用者目前所選的行政區，預設值為北投區
    currDistrict: '北投區',
    //存放API回傳的縣市/行政區的列表資訊
    location: [],
    //存放API回傳的所有藥局資訊
    stores: [],
    keywords: '',
    showModal: false,
    infoBoxSid: null,
  },
  mutations: {
    setcurrCity(state, payload) {
      state.currCity = payload;
    },
    setcurrDistrict(state, payload) {
      state.currDistrict = payload;
    },
    setAreaLocation(state, payload) {
      state.location = payload;
    },
    setStores(state, payload) {
      state.stores = payload;
    },
    setKeywords(state, payload) {
      state.keywords = payload;
    },
    setShowModal(state, payload) {
      state.showModal = payload;
    },
    setInfoBoxSid(state, payload) {
      state.infoBoxSid = payload;
    }
  },
  actions: {
    //取得行政資料
    async fetchLocation({ commit }) {
      const json = await fetch('https://raw.githubusercontent.com/kurotanshi/mask-map/master/raw/area-location.json')
        .then((res) => res.json())
      //透過commit 操作location
      commit('setAreaLocation', json)
    },
    //取得藥局資訊
    async fetchPharmacies({ commit }) {
      const json = await fetch('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json')
        .then((res) => res.json())
      //整理資料格式拆出經緯
      const data = json.features.map((d) => ({
        ...d.properties,
        latitude: d.geometry.coordinates[0],
        longtitude: d.geometry.coordinates[1],
      }))

      //透過commit 操作location
      commit('setStores', data)
    }


  },
  modules: {
  },
  getters: {
    cityList(state) {
      // 城市
      return state.location.map((d) => d.name)
    },
    districtList(state) {
      //行政區，利用Optional Chaining 處理預設值問題
      return state.location.find((d) => d.name === state.currCity)?.districts || [];
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
    },
    filteredStores(state) {
      //依縣市、行政區分組
      const { stores } = state;
      // 加入關鍵字功能
      return state.keywords
        ? stores.filter((d) => d.name.includes(state.keywords))
        : stores.filter((d) => d.county === state.currCity && d.town === state.currDistrict)
    },
    currDistrictInfo(state, getters) {
      //目前所選行政區資訊
      return getters.districtList.find((d) => d.name === state.currDistrict) || {};
    }
  }
})
