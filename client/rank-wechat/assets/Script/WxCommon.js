
var wxCommon =  {
    stringStartWith: function(str, sub) {
        if (str.substr(0, sub.length) == sub) {
            return true;
        }
        return false;
    },
    createImage(avatarUrl, sprHeadimg) {
        if(this.stringStartWith(avatarUrl, 'http')) {
            // if (CC_WECHATGAME) {
                try {
                    let image = wx.createImage();
                    image.onload = () => {
                        try {
                            let texture = new cc.Texture2D();
                            texture.initWithElement(image);
                            texture.handleLoadedTexture();
                            sprHeadimg.spriteFrame = new cc.SpriteFrame(texture);
                        } catch (e) {
                            cc.log(e);
                            sprHeadimg.node.active = false;
                        }
                    };
                    image.src = avatarUrl;
                }catch (e) {
                    cc.log(avatarUrl+"="+e);
                    sprHeadimg.node.active = false;
                }
            // }
            // else {
            //     console.log("start..stringStartWith http .." + avatarUrl);
            //     cc.loader.load({url: avatarUrl, type: 'jpg'}, (err, texture)=>{
            //         sprHeadimg.spriteFrame = new cc.SpriteFrame(texture);
            //     }); 
            // }
        }
        else {
            cc.loader.loadRes(avatarUrl, cc.SpriteFrame, function(err, spriteFrame) {
                sprHeadimg.spriteFrame = spriteFrame;
            });
        }
    },
};
module.exports = wxCommon;