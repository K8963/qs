const ros = new ROSLIB.Ros();
function $(id_name) {
  return document.getElementById(id_name);
}
var app = new Vue({
  el: "#app",
  data: {
    // message: displayData,
    displayData: {},
    lightList: [
      "左转灯",
      "右转灯",
      "近光灯",
      "远光灯",
      "前雾灯",
      "旋转报警灯",
      "前工作灯",
      "后工作灯",
      "左后转向灯",
      "右后转向灯",
      "侧照灯",
      "位置灯",
      "后位置灯",
      "制动灯",
      "倒车灯",
    ],
  },
  methods: {
    // 刹车\油门\举升\驾驶状态\EPB\档位
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
    changePos(value) {
      if (value > 0) {
        $("pos_img").src = "./img/onpos.png";
      } else {
        $("pos_img").src = "./img/pos.png";
      }
      $("pos_skillsText").innerHTML = value + "%";
      if (value < 10) {
        value = value * 4;
        $("pos_skills").style.width = value + "%";
      } else if (value < 30) {
        value = value * 2;
        $("pos_skills").style.width = value + "%";
      } else if (value < 60) {
        value = value * 1.5;
        $("pos_skills").style.width = value + "%";
      }
    },
    changeGear(value) {
      let gearItems = document.getElementsByClassName("gearStutus");
      for (let i = 0; i < gearItems.length; i++) {
        gearItems[i].classList.remove("activeS");
      }
      if (value == 0) {
        gearItems[2].classList.add("activeS");
      } else if (value == -1) {
        gearItems[1].classList.add("activeS");
      } else {
        gearItems[3].classList.add("activeS");
        gearItems[3].innerHTML = "D" + value;
      }
    },
    changeThrottle(value) {
      $("percentage_skillsText").innerHTML = value + "%";
      $("percentage_skills").style.width = value + "%";
      if (value > 0) {
        $("percentage_img").src = "./img/onpercentage.png";
      } else {
        $("percentage_img").src = "./img/percentage.png";
      }
    },
    changeSteer(value) {
      $("steer_img").style.transform = "rotate(" + value + "deg)";
      if (value < 0) {
        $("gasText").innerHTML = value + "°";
        $("brakeText").innerHTML = "0°";
      } else {
        $("gasText").innerHTML = "0°";
        $("brakeText").innerHTML = value + "°";
      }
    },
    changeDrive(value) {
      let text = $("driveText");
      let img = $("driveImg");
      if (value) {
        text.innerHTML = "自动驾驶";
        img.src = "./img/无人驾驶.png";
      } else {
        text.innerHTML = "人工驾驶";
        img.src = "./img/人工驾驶.png";
      }
    },
    changeHangangle(value) {
      if (value == 0) {
        $("imgCartBox").style.transform = "rotate(-" + value + "deg)";
        $("hangangleStutus").innerHTML = value + "°";
        $("hangangleText").style.color = "#646262";
      } else if (value > 0) {
        $("imgCartBox").style.transform = "rotate(-" + value + "deg)";
        $("hangangleStutus").innerHTML = value + "°";
        $("hangangleText").style.color = "#eee";
      } else {
        $("hangangleText").style.color = "#646262";
      }
    },
    changeEPB(value) {
      if (value == 0) {
        $("EPBText").style.color = "#646262";
        $("gearEPB").classList.remove("activeS");
      } else if (value == 1) {
        $("EPBText").style.color = "#eee";
        $("gearEPB").classList.add("activeS");
      } else if (value == 2) {
        $("EPBText").style.color = "#646262";
        $("gearEPB").classList.remove("activeS");
      } else if (value == 3) {
        $("EPBText").style.color = "red";
        $("gearEPB").classList.remove("activeS");
      }
    },
    // RTK
    changeFuel(value) {
      document.getElementById("fuel").innerHTML = value;
    },
    RTKState(value) {
      let rtk_state_value = "未知";
      if (value == -1) rtk_state_value = "无GNSS";
      if (value == 0) rtk_state_value = "2D/3D";
      if (value == 1) rtk_state_value = "SBAS";
      if (value == 2) rtk_state_value = "差分/RTK";
      this.changeRtk("rtk_state", "RTK状态:" + rtk_state_value);
    },
    changeRtk(id, value) {
      $(id).innerHTML = value;
    },
    // 灯光
    getLight() {
      let light = document.getElementsByClassName("light");
      for (let i = 0; i < light.length; i++) {
        light[i].innerHTML = this.lightList[i];
      }
    },
    changeLight(name, value) {
      // console.log(name, value);
      let item = this.lightList.indexOf(name);
      let light = document.getElementsByClassName("light");
      for (let i = 0; i < light.length; i++) {
        if (i == item) {
          if (value === 1) {
            light[i].classList.add("active");
            // console.log(value);
          } else if (value === 0) {
            light[i].classList.remove("active");
            light[i].classList.remove("warning");
          } else if (value === "01") light[i].classList.add("warning");
        }
      }
    },
    // 摄像头
    setCarm() {
      let videoWidth = Math.round(450);
      let videoHeight = Math.round((videoWidth * 240) / 320);
      let videoQuality = 50;
      let videoTopicParam = new ROSLIB.Param({
        ros: ros,
        name: "/robot_gui/videoTopic",
      });
      videoTopicParam.get(function () {
        new MJPEGCANVAS.Viewer({
          divID: "videoCanvas",
          host: "127.0.0.1",
          port: "8080",
          width: videoWidth,
          height: videoHeight,
          quality: videoQuality,
          topic: "/camera/rgb/brake_camera",
        });
        new MJPEGCANVAS.Viewer({
          divID: "videoCanvas1",
          host: "127.0.0.1",
          port: "8080",
          width: videoWidth,
          height: videoHeight,
          quality: videoQuality,
          topic: "/camera/rgb/leopard",
        });
      });
    },
    // 轨迹
    getWptC() {
      // console.log(this.displayData.wpt_x);
      // console.log(this.displayData.wpt_y);
      // let wpt_x = [
      //   -0.7806352367689442, 0.19418055782921329, 1.1670592710084975,
      //   2.2439038606474924, 3.32714745171279, 4.308120791183455, 5.375958902077741,
      //   6.380360206138221, 7.43152220118111, 8.72245294974698, 9.858064790681397,
      //   11.021864614839046, 12.202478623274828, 13.425779066767177,
      //   14.446582641900022, 15.781608670095238, 17.06708097614444, 18.298465124732274,
      //   19.494540490669237, 20.510928255011663,
      // ];
      // let wpt_y = [
      //   4.60704349996081, 4.238721502290673, 3.8840615003098264, 3.469437213783067,
      //   3.163807979398598, 2.8811948673414918, 2.5973021805573353, 2.427803363583962,
      //   2.2526504932636726, 2.164657534774733, 2.145438585735292, 2.1405321314300636,
      //   2.2389878342385146, 2.413039164570364, 2.5872765373508173, 2.8505683817431873,
      //   3.139143511596785, 3.4833172144965374, 3.8734778765317515, 4.208314958897745,
      // ];
      let xL = this.displayData.wpt_x.map((item, index, array) => {
        item = Number((item * 10).toFixed(0));
        return item;
      });
      let yL = this.displayData.wpt_y.map((item, index, array) => {
        item = -Number((item * 10).toFixed(0));
        return item;
      });
      // console.log(xL, yL);
      const canvas = document.getElementById("wptCanvas");
      const ctx = canvas.getContext("2d");
      ctx.translate(200, 200);
      // ctx.fillStyle = "red";
      // ctx.beginPath();
      // ctx.fillStyle = "red";
      // ctx.fillRect(0, 0, 10, 10);
      // ctx.fillStyle = "blue";
      // ctx.fillRect(0, 20, 10, 10);
      // ctx.fillRect(0, -20, 10, 10);
      // ctx.fillStyle = "green";
      // ctx.fillRect(20, 0, 10, 10);
      // ctx.fillRect(-20, 0, 10, 10);
      for (let i = 0; i <= 20; i++) {
        ctx.fillStyle = "#eee";
        ctx.arc(xL[i], yL[i], 3, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      // ctx.clearRect(-200, -200, 400, 400);
    },
  },
  created() {
    this.init_ros();
    this.displayData.left_light = 1;
  },
  mounted() {
    this.getLight();
    this.setCarm();
    // this.getWptC()
    // this.changeLight("左转灯", 1);
  },
  watch: {
    displayData: {
      handler: function (newV, oldV) {
        // console.log(newV);
      },
    },
    // 刹车\油门\举升\驾驶状态\EPB\档位
    "displayData.current_brake_pedal_pos": {
      handler: function (newV, oldV) {
        newV = Math.round(newV);
        this.changePos(newV);
      },
    },
    "displayData.current_throttle_percentage": {
      handler: function (newV, oldV) {
        this.changeThrottle(newV);
      },
    },
    "displayData.current_steer": {
      handler: function (newV, oldV) {
        this.changeSteer(newV);
      },
    },
    "displayData.current_gear": {
      handler: function (newV, oldV) {
        this.changeGear(newV);
      },
    },
    "displayData.current_hang_angle": {
      handler: function (newV, oldV) {
        this.changeHangangle(newV);
      },
    },
    "displayData.auto_mode": {
      handler: function (newV, oldV) {
        this.changeDrive(newV);
      },
    },
    "displayData.current_EPB": {
      handler: function (newV, oldV) {
        this.changeEPB(newV);
      },
    },
    "displayData.instant_fuel": {
      handler: function (newV, oldV) {
        newV = newV.toFixed(2);
        this.changeFuel(newV);
      },
    },
    // 组合定位
    "displayData.rtk_state": {
      handler: function (newV, oldV) {
        this.RTKState(newV);
      },
    },
    "displayData.lat": {
      handler: function (newV, oldV) {
        newV = newV.toFixed(3);
        this.changeRtk("rtk_lat", newV);
      },
    },
    "displayData.lng": {
      handler: function (newV, oldV) {
        newV = newV.toFixed(3);
        this.changeRtk("rtk_lng", newV);
      },
    },
    "displayData.alt": {
      handler: function (newV, oldV) {
        newV = newV.toFixed(3);
        this.changeRtk("rtk_alt", newV);
      },
    },
    "displayData.x_enu": {
      handler: function (newV, oldV) {
        newV = newV.toFixed(3);
        this.changeRtk("rtk_x_enu", newV);
      },
    },
    "displayData.y_enu": {
      handler: function (newV, oldV) {
        newV = newV.toFixed(3);
        this.changeRtk("rtk_y_enu", newV);
      },
    },
    "displayData.xy_std_enu": {
      handler: function (newV, oldV) {
        newV = newV.toFixed(3);
        this.changeRtk("rtk_xy_std_enu", newV);
      },
    },
    "displayData.headingangle": {
      handler: function (newV, oldV) {
        newV = newV.toFixed(3);
        this.changeRtk("rtk_headingangle", newV);
      },
    },
    // 灯光
    "displayData.left_light": {
      handler: function (newV, oldV) {
        this.changeLight("左转灯", newV);
      },
    },
    "displayData.right_light": {
      handler: function (newV, oldV) {
        this.changeLight("右转灯", newV);
      },
    },
    "displayData.near_light": {
      handler: function (newV, oldV) {
        this.changeLight("近光灯", newV);
      },
    },
    "displayData.far_light": {
      handler: function (newV, oldV) {
        this.changeLight("远光灯", newV);
      },
    },
    "displayData.top_warning_light": {
      handler: function (newV, oldV) {
        this.changeLight("旋转报警灯", newV);
      },
    },
    "displayData.front_fog_light": {
      handler: function (newV, oldV) {
        this.changeLight("前雾灯", newV);
      },
    },
    "displayData.front_work_light": {
      handler: function (newV, oldV) {
        this.changeLight("前工作灯", newV);
      },
    },
    "displayData.side_light": {
      handler: function (newV, oldV) {
        this.changeLight("侧照灯", newV);
      },
    },
    "displayData.position_light": {
      handler: function (newV, oldV) {
        this.changeLight("位置灯", newV);
      },
    },
    "displayData.back_left_light": {
      handler: function (newV, oldV) {
        this.changeLight("左后转向灯", newV);
      },
    },
    "displayData.back_right_light": {
      handler: function (newV, oldV) {
        this.changeLight("右后转向灯", newV);
      },
    },
    "displayData.back_position_light": {
      handler: function (newV, oldV) {
        this.changeLight("后位置灯", newV);
      },
    },
    "displayData.brake_light": {
      handler: function (newV, oldV) {
        this.changeLight("制动灯", newV);
      },
    },
    "displayData.reverse_light": {
      handler: function (newV, oldV) {
        this.changeLight("倒车灯", newV);
      },
    },
    "displayData.back_work_light": {
      handler: function (newV, oldV) {
        this.changeLight("后工作灯", newV);
      },
    },
    // 轨迹
    "displayData.wpt_x": {
      handler: function (newV, oldV) {
        let xL = newV.map((item, index, array) => {
          item = Number((item * 10).toFixed(0));
          return item;
        });
        // console.log("xL:" + newV);
        // this.getWptC();
      },
      deep: true,
    },
    "displayData.wpt_y": {
      handler: function (newV, oldV) {
        let yL = newV.map((item, index, array) => {
          item = -Number((item * 10).toFixed(0));
          return item;
        });
        // console.log("yL:" + newV);
        // this.getWptC();
      },
      deep: true,
    },
  },
});
