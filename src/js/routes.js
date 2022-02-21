import LoadingPage from '../pages/LoadingPage.vue';
import NotFoundPage from '../pages/404.vue';
import PredictingPage from '../pages/PredictingPage.vue';

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
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
