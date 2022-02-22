import LoadingPage from '../pages/LoadingPage.vue';
import NotFoundPage from '../pages/404.vue';
import PredictingPage from '../pages/PredictingPage.vue';
import MorseCodePage from '../pages/MorseCodePage.vue';

const routes = [
  {
    path: '/',
    component: LoadingPage,
  },
  {
    path: '/predicting',
    component: PredictingPage,
  },
  {
    path: '/morse-code',
    component: MorseCodePage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
