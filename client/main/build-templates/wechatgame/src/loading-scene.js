var scene = new cc.Scene();

var root = new cc.Node();
var canvas = root.addComponent(cc.Canvas);
var cameraNode = new cc.Node();
var camera = cameraNode.addComponent(cc.Camera);
camera.backgroundColor = cc.color("#ffffff");
camera.parent = root;
root.parent = scene;

var bgNode = new cc.Node();
bgNode.width = 720;
bgNode.height = 1280;
bgNode.color = cc.color("#ffffff");
var bg = bgNode.addComponent(cc.Sprite);
cc.loader.load("src/bg.png", (err, texture) => {
  bg.spriteFrame = new cc.SpriteFrame(texture);
});
bgNode.parent = root;

//遮罩
let mask = new cc.Node();
mask.width = 720;
mask.height = 1280;
let graphics = mask.addComponent(cc.Graphics);
graphics.fillColor = new cc.Color(0, 0, 0, 200);
let maxWidth = Math.max(cc.winSize.width, mask.width);
let maxHeight = Math.max(cc.winSize.height, mask.height);
graphics.fillRect(-maxWidth/2, -maxHeight/2, maxWidth, maxHeight);
mask.parent = root;

/*var iconNode = new cc.Node();
iconNode.width= iconNode.height = 167;
var icon = iconNode.addComponent(cc.Sprite);
cc.loader.load("src/portrait.png", (err, texture) => {
  icon.spriteFrame = new cc.SpriteFrame(texture);
});
iconNode.parent = root;*/

var iconRunNode = new cc.Node();
// iconRunNode.width= iconRunNode.height = 100;
var iconRun = iconRunNode.addComponent(cc.Sprite);
iconRun.trim = false;
cc.loader.load("src/portrait_run.png", (err, texture) => {
  iconRun.spriteFrame = new cc.SpriteFrame(texture);
});
// iconRunNode.runAction(cc.repeatForever(cc.rotateBy(1.5, 360)).easing(cc.easeCircleActionInOut()));
iconRunNode.parent = root;

//loading
// var iconNode = new cc.Node();
// iconNode.width= iconNode.height = 167;
// iconNode.y = -142;
// var icon = iconNode.addComponent(cc.Sprite);
// cc.loader.load("src/loading.png", (err, texture) => {
//   icon.spriteFrame = new cc.SpriteFrame(texture);
// });
// iconNode.parent = root;

//文字
var nodeDesc = new cc.Node();
nodeDesc.y = -150;
var desc = nodeDesc.addComponent(cc.Label);
desc.node.color = new cc.Color(88,142, 224, 0);
desc.fontSize = 20;
desc.string = "正在拼命加载资源，请稍后...";
nodeDesc.parent = root;


/*
let descr = new cc.Node();
descr.y = -142;
descr.width=467;
descr.height=100;
descr.color = cc.color("#000000");
var labDescr = descr.addComponent(cc.Label);
labDescr.string = "亲，请稍等努力加载中......";//"乐趣值得分享";
labDescr.fontSize = 18;
labDescr.lineHeight = 20;
descr.parent = root;
*/

exports = module.exports = scene;
exports.setLoading = str => (loading.string = str);
