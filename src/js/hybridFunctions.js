
const isAndroid = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android/i.test(userAgent)) return true;
  return false;
};

const isIos = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/iPad|iPhone|iPod/i.test(userAgent)) return true;
  return false;
};

const isMobile = () => window.cordova && (isAndroid() || isIos());
const something = isMobile();

const getBrowserCamera = () => navigator.mediaDevices
  .getUserMedia({
    audio: false,
    video: {
      facingMode: 'user',
      width: 500,
      height: 500,
    },
  });

const hybridFunctions = {
  isAndroid,
  isIos,
  isMobile,
  getBrowserCamera,
  something,
};

export default hybridFunctions;
