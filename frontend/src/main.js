import Vue from "vue";
import "normalize.css";
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/ja";
import "element-ui/lib/theme-chalk/index.css";
import VueMeta from "vue-meta";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSmile,
  faSadTear,
  faAngry,
  faSurprise,
  faMehRollingEyes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faSmile, faSadTear, faAngry, faSurprise, faMehRollingEyes);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(ElementUI, { locale });
Vue.use(VueMeta);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
