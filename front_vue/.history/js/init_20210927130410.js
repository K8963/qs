const ros = new ROSLIB.Ros();

// 初始化
function init() {
  getDate();
  setInterval(getDate, 1000);
  getLight();
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
      init();
      clearInterval(readyStateCheckInterval);
    }
  }, 100);
}