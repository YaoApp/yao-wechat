# Yao 对接微信支付,对接微信网页授权等接口

## 在运行之前,默认您已经安装好 Yao 开发环境[安装教程](https://yaoapps.com/doc/%E4%BB%8B%E7%BB%8D/%E5%AE%89%E8%A3%85%E8%B0%83%E8%AF%95),以及开通好了微信商户支付[接入指引](https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F)

<br>

## 1. 微信支付

<br>

### 配置微信支付[商户平台](https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F)

### SDK 参考地址 [文档](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_1.shtml)

<br>

### 开发前准备

获取微信支付的商户 `WECHAT_APPID`,
商户号`WECHAT_MECH_ID`,以及
加密 Key `WECHAT_MECH_KEY`和校验请求通过的
IP `WECHT_IP`,
`WECHAT_NOTIFY_URL`为微信支付回调地址,需要配置,这里写固定值`{{你的域名}}/api/pay/notify`地址,
在`.env`文件中加入以下配置,以下配置为你申请的实际值

```json
#微信支付
WECHAT_APPID="微信appid"
WECHAT_MECH_ID="申请的商户号"
WECHAT_MECH_KEY="商户号Key"
WECHT_IP="校验通过的域名"
WECHAT_NOTIFY_URL="微信回调地址"
```

### 文件`/apis/pay`为微信支付相关接口,调用`{{你的域名}}/api/pay/wechat`用于获取微信支付二维码

<br>

## 2.微信网页授权

<br>

### 配置微信登录[公众平台](https://mp.weixin.qq.com/)

### SDK 参考地址 [文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html)

<br>

### 开发前准备

微信的`APP_ID`和验证通过的回调地址`{{申请的域名}}/api/user/redirect` 在`.env`文件中加入以下配置,以下配置为你申请的实际值

```json
#微信授权
APP_ID="微信appid"
REDIRECT_URL="授权回调地址"
```

### 文件`/apis/user`为微信授权登录相关接口,调用`{{你的域名}}/api/user/code`用于获取微信登录二维码
