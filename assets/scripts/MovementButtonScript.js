

const PlayerMovement = cc.Class({
    extends: cc.Component,

    properties: {
        arrow: 0,
        character: {
            default: null,
            type: cc.Node,
        },
        isAction: false,
    },

    startAction() {

        switch (this.arrow) {
            case 1:
                player.xSpeed = 300;
            case 2:
                player.xSpeed = -300;
            case 3:
                player.jump = true;
                
        }
    },

    endAction() {

        switch (this.arrow) {
            case 1:
                player.xSpeed = 0;
            case 2:
                player.xSpeed = 0;
            case 3:
                player.jump = false;
                
        }
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        
    },


    start () {

    },

    // update (dt) {},
});
