/**
 * 微信支付域名认证,原样返回请求信息echostr
 * @param {*} data
 * @returns
 */
function GetAuth(data) {
  var str = data.echostr[0];
  return str;
}

/**
 * 创建支付二维码,文档地址:https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_1.shtml
 * @param {*} payload
 * @returns
 */
function CreateCode(payload) {
  var amount = payload.amount;
  if (!amount || amount <= 0) {
    throw new Exception("金额至少大于0", 400);
  }
  // 金额为分
  amount = amount * 100;
  var config = Process("flows.wechat.config");
  var url = "https://api.mch.weixin.qq.com/pay/unifiedorder";

  var key = config.WECHAT_MECH_KEY;
  var appid = config.WECHAT_APPID;

  var mchid = config.WECHAT_MECH_ID;
  var times = parseInt(Date.now() / 1000);
  var conStar = MD5(times);
  var notify_url = config.WECHAT_NOTIFY_URL;
  var body = "支付VIP订单";

  var no = CreateNo();
  var ip = config.WECHT_IP;
  var json = {
    appid: appid,
    attach: no,
    body: body,
    mch_id: mchid,
    nonce_str: conStar,
    notify_url: notify_url,

    out_trade_no: no,
    spbill_create_ip: ip,
    total_fee: amount,
    trade_type: "NATIVE",
  };
  var signStr = "";
  var json = KeySort(json);
  for (var i in json) {
    signStr = signStr + i + "=" + json[i] + "&";
  }

  signStr = signStr + "key=" + key;
  //log.Error("%v", signStr);
  res = MD5(signStr);

  var xml = `<xml><appid>${appid}</appid><attach>${no}</attach><body>${body}</body><mch_id>${mchid}</mch_id><nonce_str>${conStar}</nonce_str><notify_url>${notify_url}</notify_url><out_trade_no>${no}</out_trade_no><spbill_create_ip>${ip}</spbill_create_ip><total_fee>${amount}</total_fee><trade_type>NATIVE</trade_type><sign>${res}</sign></xml>`;
  //log.Error("%v", xml);
  // return xml;

  var response = Process("xiang.network.Send", "POST", url, {}, xml, {
    "content-type": "text/xml",
  });

  if (response.status == 200) {
    return {
      code: 200,
      code_url: GetUrl(response.body),
      order_sn: no,
    };
  }
  return {
    code: 400,
    message: "生成二维码失败",
  };
}

/**
 * 微信支付后回调地址
 * @param {*} body
 */
function Notify(body) {
  console.log(body);
  // todo 验证回调数据是否合法
  // 提取订单号,查询数据库等操作
}
/**
 * 使用MD5加密方式
 * @param {*} string
 * @returns
 */
function MD5(string) {
  var res = Process("yao.crypto.hash", "MD5", string);
  return res.toUpperCase();
}

/**
 * 创建订单号
 * @returns
 */
function CreateNo() {
  var timeInMs = Date.now();
  timeInMs =
    "SN" + timeInMs + parseInt(Math.random() * (999999 - 100000) + 100000);
  return timeInMs;
}

/**
 * 按照键值对排序
 * @param {*} arys
 * @returns
 */
function KeySort(arys) {
  //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newkey = Object.keys(arys).sort();
  var ObjSort = {}; //创建一个新的对象，用于存放排好序的键值对
  for (var i in newkey) {
    //遍历newkey数组
    ObjSort[newkey[i]] = arys[newkey[i]];
    //向新创建的对象中按照排好的顺序依次增加键值对
  }
  return ObjSort;
}
/**
 * 从微信返回的复杂数据中提取二维码的url
 * @param {*} content
 * @returns
 */
function GetUrl(content) {
  res = content.split("<code_url><![CDATA[");
  if (res && res.length > 1) {
    var step = res[1];
    res = step.split("]]></code_url>")[0];
  } else {
    res = "";
  }
  return res;
}
