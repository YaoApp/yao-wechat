/**
 * 微信网页授权
 */
function Code() {
  // 生成6位数的随机码
  var state = parseInt(Math.random() * (999999 - 100000) + 100000);
  var config = Process("flows.wechat.config");
  var url =
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
    config.APP_ID +
    "&redirect_uri=" +
    config.REDIRECT_URL +
    "&response_type=code&scope=snsapi_userinfo&state=" +
    state +
    "#wechat_redirect";

  // todo 生成二维码让用户扫码
  return {
    url: url,
    code: state,
  };
  //如果用户同意授权，页面将跳转至 redirect_uri/?code=CODE&state=STATE。
}
function RedirectURI(data) {
  var cache = new Store("cache");
  //如果用户同意授权，页面将跳转至 redirect_uri/?code=CODE&state=STATE。
  var code = data.code[0];
  var state = data.state[0];
  var access_token = AccessToken(code);

  var pars = JSON.parse(access_token.body);

  if (!pars.access_token || pars.access_token == "") {
    return { access_token: access_token, msg: "只获取到access_token" };
  }

  var user_info = UserInfo(pars.access_token, pars.openid);

  data = JSON.parse(user_info.body);
  console.log("获取到的用户信息");
  console.log(data);
}

/**
 * 第二步:获取access_token
 */
function AccessToken(code) {
  var config = Process("flows.wechat.config");
  var url =
    "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" +
    config.APP_ID +
    "&secret=" +
    config.APP_SECRET +
    "&code=" +
    code +
    "&grant_type=authorization_code";

  var access_token = Process("xiang.network.Get", url);

  return access_token;
}
/**
 * 第三步获取用户信息
 * @param {*} access_token
 * @param {*} open_id
 */
function UserInfo(access_token, open_id) {
  var url =
    "https://api.weixin.qq.com/sns/userinfo?access_token=" +
    access_token +
    "&openid=" +
    open_id +
    "&lang=zh_CN";

  var user_info = Process("xiang.network.Get", url);
  return user_info;
}
