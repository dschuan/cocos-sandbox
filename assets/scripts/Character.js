// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // main character's jump height
        jumpForce: 0,
        // maximal movement speed
        maxMoveSpeed: 0,
        // acceleration
        leftButton: {
            default: null,
            type: cc.Node,
        },
        rightButton: {
            default: null,
            type: cc.Node,
        },
        upButton: {
            default: null,
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:


    // Registers movements on arrow key press
    onKeyDown(e){
        console.log('Key down', this.allowJump, this.jump);
        switch(e.keyCode){
            case cc.macro.KEY.right:
                this.xSpeed = 300;
                break;
            case cc.macro.KEY.left:
                this.xSpeed = -300;
                break;       
            case cc.macro.KEY.up:
                this.jump = true;
                break;           
        }
    },

    onKeyUp (event) {
        // unset a flag when key released
        console.log('Key up', this.allowJump, this.jump);

        switch(event.keyCode) {
            case cc.macro.KEY.right:
                this.xSpeed = 0;
                break;
            case cc.macro.KEY.left:
                this.xSpeed = 0;
                break;
            case cc.macro.KEY.up:
                this.jump = false;
                break;
        }
    },

    // Registers touch behaviours on the movement buttons
    onTouch (button) {
        this[button].on(cc.Node.EventType.TOUCH_START, function (event) {
            switch (button) {
                case 'leftButton':
                    this.xSpeed = -300;
                    break;
                case 'rightButton':
                    this.xSpeed = 300;
                    break;
                case 'upButton':
                    this.jump = true;
                    break;
            }
        }, this);
        
        this[button].on(cc.Node.EventType.TOUCH_END, function (event) {
            switch (button) {
                case 'leftButton':
                    this.xSpeed = 0;
                    break;
                case 'rightButton':
                    this.xSpeed = 0;
                    break;
                case 'upButton':
                    this.jump = false;
                    break;
            }
        }, this);

        this[button].on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            switch (button) {
                case 'leftButton':
                    this.xSpeed = 0;
                    break;
                case 'rightButton':
                    this.xSpeed = 0;
                    break;
                case 'upButton':
                    this.jump = false;
                    break;
            }
        }, this);
    },

    // Jumping behaviour, prevents jumps from occurring until character collides with Land
    onBeginContact(contact, selfCollider, otherCollider) {
        console.log(otherCollider.node.name);
        if (otherCollider.node.name === "Land") {
            this.allowJump = true;
        }
    },

    onLoad () {
        // State management for jumping action
        this.jump = false;
        this.allowJump = true;

        // The main character's current horizontal velocity
        this.xSpeed = 0;

        // Key press register for movements
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);   
        cc.director.getPhysicsManager().enabled = true;

        // Mount movement buttons
        this.onTouch('leftButton');
        this.onTouch('rightButton');
        this.onTouch('upButton');

    },

    onDestroy () {
        // Cancel keyboard input monitoring
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    update (dt) {

        // update speed of each frame according to the current acceleration direction
        if (this.jump && this.allowJump) {
            console.log('Jumping')
            let rigidbody = this.node.getComponent(cc.RigidBody);
            rigidbody.applyLinearImpulse(new cc.Vec2(0,this.jumpForce), rigidbody.getWorldCenter(),true);
            this.allowJump = false;

        }

        // restrict the movement speed of the main character to the maximum movement speed
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // update the position of the main character according to the current speed
        this.node.x += this.xSpeed * dt;
    },
    
});
