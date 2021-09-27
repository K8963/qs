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
ros.on("connection", function () {
  console.log("---连接成功---");
  var listener = new ROSLIB.Topic({
    ros: ros,
    name: "/zone3/data_display",
  });

  listener.subscribe(function (message) {
    oligayDisplay.pos = pos = Math.round(message.current_brake_pedal_pos);
    oligayDisplay.percentage = message.current_throttle_percentage;
    oligayDisplay.steer = message.current_steer;
    oligayDisplay.gear = message.current_gear;
    oligayDisplay.hangangle = message.current_hang_angle;
    oligayDisplay.auto_mode = message.auto_mode;
    oligayDisplay.current_EPB = message.current_EPB;
    oligayDisplay.instant_fuel = message.instant_fuel.toFixed(2);
    // 灯光
    lightData.left_light = message.left_light;
    lightData.right_light = message.right_light;
    lightData.near_light = message.near_light;
    lightData.far_light = message.far_light;
    lightData.air_beep = message.air_beep;
    lightData.top_warning_light = message.top_warning_light;
    lightData.front_fog_light = message.front_fog_light;
    lightData.front_work_light = message.front_work_light;
    lightData.side_light = message.side_light;
    lightData.position_light = message.position_light;
    lightData.back_left_light = message.back_left_light;
    lightData.back_right_light = message.back_right_light;
    lightData.back_position_light = message.right_light;
    lightData.brake_light = message.brake_light;
    lightData.reverse_light = message.reverse_light;
    lightData.back_work_light = message.back_work_light;
    // 组合定位

    rtkData.rtk_state = message.rtk_state;
    rtkData.lat = message.lat.toFixed(3);
    rtkData.lng = message.lng.toFixed(3);
    rtkData.alt = message.alt.toFixed(3);
    rtkData.x_enu = message.x_enu.toFixed(3);
    rtkData.y_enu = message.y_enu.toFixed(3);
    rtkData.xy_std_enu = message.xy_std_enu.toFixed(3);
    rtkData.headingangle = message.headingangle;
    // rtkData.NumSate = message.NumSate;
    // console.log(message);
  });
});

let oligayDisplay = {};
let lightData = {};
let rtkData = {};
let temData = {};
// 检测变化
Object.defineProperties(oligayDisplay, {
  pos: {
    get: function () {
      return pos;
    },
    set: function (value) {
      pos = value;
      if (temData.pos != pos) {
        temData.pos = pos;
        // console.log("刹车发生变化:" + pos);
        changePos(pos);
      }
    },
  },
  percentage: {
    get: function () {
      return percentage;
    },
    set: function (value) {
      percentage = value;
      if (temData.percentage != percentage) {
        temData.percentage = percentage;
        // console.log("油门发生变化:" + percentage);
        changeThrottle(percentage);
      }
    },
  },
  steer: {
    get: function () {
      return steer;
    },
    set: function (value) {
      steer = value;
      if (temData.steer != steer) {
        temData.steer = steer;
        // console.log("方向盘发生变化:" + steer);
        changeSteer(steer);
      }
    },
  },
  gear: {
    get: function () {
      return gear;
    },
    set: function (value) {
      gear = value;
      if (temData.gear != gear) {
        temData.gear = gear;
        // console.log("档位发生变化:" + gear);
        changeGear(gear);
      }
    },
  },
  hangangle: {
    get: function () {
      return hangangle;
    },
    set: function (value) {
      hangangle = value;
      if (temData.hangangle != hangangle) {
        temData.hangangle = hangangle;
        // console.log("货箱举升发生变化:" + hangangle);
        changeHangangle(hangangle);
      }
    },
  },
  auto_mode: {
    get: function () {
      return auto_mode;
    },
    set: function (value) {
      auto_mode = value;
      if (temData.auto_mode != auto_mode) {
        temData.auto_mode = auto_mode;
        // console.log("驾驶状态发生变化:" + auto_mode);
        changeDrive(auto_mode);
      }
    },
  },
  current_EPB: {
    get: function () {
      return current_EPB;
    },
    set: function (value) {
      current_EPB = value;
      if (temData.current_EPB != current_EPB) {
        temData.current_EPB = current_EPB;
        // console.log("电子手刹:" + current_EPB);
        changeEPB(current_EPB);
      }
    },
  },
  instant_fuel: {
    get: function () {
      return instant_fuel;
    },
    set: function (value) {
      instant_fuel = value;
      if (temData.instant_fuel != instant_fuel) {
        temData.instant_fuel = instant_fuel;
        // console.log("instant_fuel:" + instant_fuel);
        changeFuel(instant_fuel);
      }
    },
  },
});
function $(id_name) {
  return document.getElementById(id_name);
}
function changePos(value) {
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
}
function changeThrottle(value) {
  $("percentage_skillsText").innerHTML = value + "%";
  $("percentage_skills").style.width = value + "%";
  if (value > 0) {
    $("percentage_img").src = "./img/onpercentage.png";
  } else {
    $("percentage_img").src = "./img/percentage.png";
  }
}
function changeGear(value) {
  let gearItems = document.getElementsByClassName("gearStutus");
  // console.log(gearItems);
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
}
function changeSteer(value) {
  $("steer_img").style.transform = "rotate(" + value + "deg)";
  if (value < 0) {
    $("gasText").innerHTML = value + "°";
    $("brakeText").innerHTML = "0°";
  } else {
    $("gasText").innerHTML = "0°";
    $("brakeText").innerHTML = value + "°";
  }
}
function changeDrive(value) {
  let text = $("driveText");
  let img = $("driveImg");
  if (value) {
    text.innerHTML = "自动驾驶";
    img.src = "./img/无人驾驶.png";
  } else {
    text.innerHTML = "人工驾驶";
    img.src = "./img/人工驾驶.png";
  }
}
function changeHangangle(value) {
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
}
function changeEPB(value) {
  // console.log(value);
  // "0x00无效，0x01驻车，
  // 0x02释放，0x03错误"
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
}
function changeFuel(value) {
  // console.log(value);
  document.getElementById("fuel").innerHTML = value;
}

$("driveImg").addEventListener("click", function () {
  oligayDisplay.auto_mode = !oligayDisplay.auto_mode;
});

$("driveText").addEventListener("click", function () {
  oligayDisplay.auto_mode = !oligayDisplay.auto_mode;
});

// 实时时间
function getDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  var dates = date.getDate();
  dates = dates < 10 ? "0" + dates : dates;
  var hour = date.getHours();
  var half = hour >= 12 ? "下午" : "上午";
  hour = hour <= 12 ? hour : hour - 12;
  hour = hour < 10 ? "0" + hour : hour;
  var min = date.getMinutes();
  min = min < 10 ? "0" + min : min;
  var sed = date.getSeconds();
  sed = sed < 10 ? "0" + sed : sed;
  $("now_time").innerHTML = hour + ":" + min + ":" + sed;
  $("now_date").innerHTML = year + "-" + month + "-" + dates;
}
// 灯光
let lightList = [
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
];
Object.defineProperties(lightData, {
  left_light: {
    get: function () {
      return left_light;
    },
    set: function (value) {
      left_light = value;
      if (temData.left_light != left_light) {
        temData.left_light = left_light;
        // console.log("左转灯:" + left_light);
        changeLight("左转灯", left_light);
      }
    },
  },
  right_light: {
    get: function () {
      return right_light;
    },
    set: function (value) {
      right_light = value;
      if (temData.right_light != right_light) {
        temData.right_light = right_light;
        // console.log("右转灯:" + right_light);
        changeLight("右转灯", right_light);
      }
    },
  },
  near_light: {
    get: function () {
      return near_light;
    },
    set: function (value) {
      near_light = value;
      if (temData.near_light != near_light) {
        temData.near_light = near_light;
        // console.log("近光灯" + near_light);
        changeLight("近光灯", near_light);
      }
    },
  },
  far_light: {
    get: function () {
      return far_light;
    },
    set: function (value) {
      far_light = value;
      if (temData.far_light != far_light) {
        temData.far_light = far_light;
        // console.log("远光灯" + far_light);
        changeLight("远光灯", far_light);
      }
    },
  },
  air_beep: {
    get: function () {
      return air_beep;
    },
    set: function (value) {
      air_beep = value;
      if (temData.air_beep != air_beep) {
        temData.air_beep = air_beep;
        // console.log("气喇叭", air_beep);
        // changeLight("气喇叭", air_beep)
      }
    },
  },
  top_warning_light: {
    get: function () {
      return top_warning_light;
    },
    set: function (value) {
      top_warning_light = value;
      if (temData.top_warning_light != top_warning_light) {
        temData.top_warning_light = top_warning_light;
        // console.log("远光灯" + far_light);
        changeLight("旋转报警灯", top_warning_light);
      }
    },
  },
  front_fog_light: {
    get: function () {
      return front_fog_light;
    },
    set: function (value) {
      front_fog_light = value;
      if (temData.front_fog_light != front_fog_light) {
        temData.front_fog_light = front_fog_light;
        // console.log("远光灯" + far_light);
        changeLight("前雾灯", front_fog_light);
      }
    },
  },
  front_work_light: {
    get: function () {
      return front_work_light;
    },
    set: function (value) {
      front_work_light = value;
      if (temData.front_work_light != front_work_light) {
        temData.front_work_light = front_work_light;
        // console.log("远光灯" + far_light);
        changeLight("前工作灯", front_work_light);
      }
    },
  },
  side_light: {
    get: function () {
      return side_light;
    },
    set: function (value) {
      side_light = value;
      if (temData.side_light != side_light) {
        temData.side_light = side_light;
        // console.log("远光灯" + far_light);
        changeLight("侧照灯", side_light);
      }
    },
  },
  position_light: {
    get: function () {
      return position_light;
    },
    set: function (value) {
      position_light = value;
      if (temData.position_light != position_light) {
        temData.position_light = position_light;
        // console.log("远光灯" + far_light);
        changeLight("位置灯", position_light);
      }
    },
  },
  back_left_light: {
    get: function () {
      return back_left_light;
    },
    set: function (value) {
      back_left_light = value;
      if (temData.back_left_light != back_left_light) {
        temData.back_left_light = back_left_light;
        // console.log("远光灯" + far_light);
        changeLight("左后转向灯", back_left_light);
      }
    },
  },
  back_right_light: {
    get: function () {
      return back_right_light;
    },
    set: function (value) {
      back_right_light = value;
      if (temData.back_right_light != back_right_light) {
        temData.back_right_light = back_right_light;
        // console.log("远光灯" + far_light);
        changeLight("右后转向灯", back_right_light);
      }
    },
  },
  back_position_light: {
    get: function () {
      return back_position_light;
    },
    set: function (value) {
      back_position_light = value;
      if (temData.back_position_light != back_position_light) {
        temData.back_position_light = back_position_light;
        // console.log("远光灯" + far_light);
        changeLight("后位置灯", back_position_light);
      }
    },
  },
  brake_light: {
    get: function () {
      return brake_light;
    },
    set: function (value) {
      brake_light = value;
      if (temData.brake_light != brake_light) {
        temData.brake_light = brake_light;
        // console.log("远光灯" + far_light);
        changeLight("制动灯", brake_light);
      }
    },
  },
  reverse_light: {
    get: function () {
      return reverse_light;
    },
    set: function (value) {
      reverse_light = value;
      if (temData.reverse_light != reverse_light) {
        temData.reverse_light = reverse_light;
        // console.log("远光灯" + far_light);
        changeLight("倒车灯", reverse_light);
      }
    },
  },
  back_work_light: {
    get: function () {
      return back_work_light;
    },
    set: function (value) {
      back_work_light = value;
      if (temData.back_work_light != back_work_light) {
        temData.back_work_light = back_work_light;
        // console.log("远光灯" + far_light);
        changeLight("后工作灯", back_work_light);
      }
    },
  },
});
function getLight() {
  let light = document.getElementsByClassName("light");
  for (let i = 0; i < light.length; i++) {
    light[i].innerHTML = lightList[i];
  }
}
function changeLight(name, value) {
  // console.log(name, value);
  let item = lightList.indexOf(name);
  let light = document.getElementsByClassName("light");
  for (let i = 0; i < light.length; i++) {
    if (i == item) {
      if (value === 1) {
        light[i].classList.add("active");
        console.log(value);
      } else if (value === 0) {
        light[i].classList.remove("active");
        light[i].classList.remove("warning");
      } else if (value === "01") light[i].classList.add("warning");
    }
  }
}

// 组合定位
Object.defineProperties(rtkData, {
  rtk_state: {
    get: function () {
      return rtk_state;
    },
    set: function (value) {
      rtk_state = value;
      if (temData.rtk_state != rtk_state) {
        temData.rtk_state = rtk_state;
        // console.log("rtk_state:" + rtk_state);
        let rtk_state_value = "未知";
        if (rtk_state == -1) rtk_state_value = "无GNSS";
        if (rtk_state == 0) rtk_state_value = "2D/3D";
        if (rtk_state == 1) rtk_state_value = "SBAS";
        if (rtk_state == 2) rtk_state_value = "差分/RTK";
        changeRtk("rtk_state", "RTK状态:" + rtk_state_value);
      }
    },
  },
  lat: {
    get: function () {
      return lat;
    },
    set: function (value) {
      lat = value;
      if (temData.lat != lat) {
        temData.lat = lat;
        // console.log("lat:" + lat);
        changeRtk("rtk_lat", lat);
      }
    },
  },
  lng: {
    get: function () {
      return lng;
    },
    set: function (value) {
      lng = value;
      if (temData.lng != lng) {
        temData.lng = lng;
        // console.log("lng:" + lng);
        changeRtk("rtk_lng", lng);
      }
    },
  },
  alt: {
    get: function () {
      return alt;
    },
    set: function (value) {
      alt = value;
      if (temData.alt != alt) {
        temData.alt = alt;
        // console.log("alt:" + alt);
        changeRtk("rtk_alt", alt);
      }
    },
  },
  x_enu: {
    get: function () {
      return x_enu;
    },
    set: function (value) {
      x_enu = value;
      if (temData.x_enu != x_enu) {
        temData.x_enu = x_enu;
        // console.log("x_enu:" + x_enu);
        changeRtk("rtk_x_enu", x_enu);
      }
    },
  },
  y_enu: {
    get: function () {
      return y_enu;
    },
    set: function (value) {
      y_enu = value;
      if (temData.y_enu != y_enu) {
        temData.y_enu = y_enu;
        // console.log("y_enu:" + y_enu);
        changeRtk("rtk_y_enu", y_enu);
      }
    },
  },
  xy_std_enu: {
    get: function () {
      return xy_std_enu;
    },
    set: function (value) {
      xy_std_enu = value;
      if (temData.xy_std_enu != xy_std_enu) {
        temData.xy_std_enu = xy_std_enu;
        // console.log("xy_std_enu:" + xy_std_enu);
        changeRtk("rtk_xy_std_enu", xy_std_enu);
      }
    },
  },
  headingangle: {
    get: function () {
      return headingangle;
    },
    set: function (value) {
      headingangle = value;
      if (temData.headingangle != headingangle) {
        temData.headingangle = headingangle;
        // console.log("headingangle:" + headingangle);
        changeRtk("rtk_headingangle", headingangle);
      }
    },
  },
});
function changeRtk(id, value) {
  $(id).innerHTML = value;
}

let tableInfo = [
  ["发动机", "变速箱", "EPS", "EBS", "电气系统"],
  ["0无故障", "1一般故障", "2严重故障", "3致命故障"],
];
function fillTable() {}

function changeTable(table) {
  var row = table.insertRow(table.rows.length);
  for (j = 0; j < table.rows[0].cells.length; j++) {
    var cell = row.insertCell(j);
    cell.height = "24px";
    cell.innerHTML = table.rows[0].cells[j].innerHTML;
  }
  table.deleteRow(0);
}
function tableInterval() {
  var table = document.getElementById("test");
  changeTable(table);
}
setInterval("tableInterval()", 2000);
// 摄像头
var videoWidth = Math.round(450);
var videoHeight = Math.round((videoWidth * 240) / 320);
var videoQuality = 50;
var videoTopicParam = new ROSLIB.Param({
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
// 轨迹点
let wpt_x = [
  -0.7806352367689442, 0.19418055782921329, 1.1670592710084975,
  2.2439038606474924, 3.32714745171279, 4.308120791183455, 5.375958902077741,
  6.380360206138221, 7.43152220118111, 8.72245294974698, 9.858064790681397,
  11.021864614839046, 12.202478623274828, 13.425779066767177,
  14.446582641900022, 15.781608670095238, 17.06708097614444, 18.298465124732274,
  19.494540490669237, 20.510928255011663,
];
let wpt_y = [
  4.60704349996081, 4.238721502290673, 3.8840615003098264, 3.469437213783067,
  3.163807979398598, 2.8811948673414918, 2.5973021805573353, 2.427803363583962,
  2.2526504932636726, 2.164657534774733, 2.145438585735292, 2.1405321314300636,
  2.2389878342385146, 2.413039164570364, 2.5872765373508173, 2.8505683817431873,
  3.139143511596785, 3.4833172144965374, 3.8734778765317515, 4.208314958897745,
];
let pointI = {};
function optWt(x, y) {
  // .toFixed(2)
  let xL = x.map((item, index, array) => {
    item = Number((item * 10).toFixed(0));
    return item;
  });
  let yL = y.map((item, index, array) => {
    item = Number((item * 10).toFixed(0));
    return item;
  });
  pointI.x = xL;
  pointI.y = yL;
}
optWt(wpt_x, wpt_y);
function getWptC() {
  const canvas = document.getElementById("wptCanvas");
  const ctx = canvas.getContext("2d");
  ctx.translate(200, 200);
  ctx.fillStyle = "red";
  // console.log(pointI);
  ctx.beginPath();
  ctx.fillRect(0, 0, 10, 10);
  ctx.fillRect(20, 0, 10, 10);
  ctx.fillRect(0, 20, 10, 10);
  for (let i = 0; i <= 20; i++) {
    ctx.fillStyle = "#eee";
    ctx.arc(pointI.x[i], pointI.y[i], 3, 0, Math.PI * 2);
    // ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}
getWptC();
