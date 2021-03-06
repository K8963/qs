const ros = new ROSLIB.Ros();
let displayData = {};
// 初始化
function init() {
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
      init();
      clearInterval(readyStateCheckInterval);
    }
  }, 100);
}
function init_ros() {
  ros.connect("ws://localhost:9090");
}
ros.on("error", function (error) {
  this.rosStatus = false;
  console.log(error);
});
ros.on("close", function () {
  this.rosStatus = false;
  console.log("---未建立连接---");
});
ros.on("connection", async () => {
  console.log("---连接成功---");
  var listener = new ROSLIB.Topic({
    ros: ros,
    name: "/zone3/data_display",
  });

  await listener.subscribe((message) => {
    getData(message);
  });
});

function getData(message) {
  displayData = message;
  return displayData
}