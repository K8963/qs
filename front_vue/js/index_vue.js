const ros = new ROSLIB.Ros();
var app = new Vue({
  el: "#app",
  data: {
    // message: displayData,
    displayData: {},
  },
  methods: {
    init_ros() {
      ros.connect("ws://localhost:9090");
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
          this.displayData = message;
        });
      });
    },
    getData(message) {
      this.displayData = message;
      return displayData
    }
  },
  created() {
    this.init_ros()
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    displayData: function (newMessage, oldMessage) {
      console.log(newMessage);
    }
  },
});
