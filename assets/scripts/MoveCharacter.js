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
        jumpHeight: 0,
        // main character's jump duration
        jumpDuration: 0,
        // maximal movement speed
        maxMoveSpeed: 0,
        // acceleration
        accel: 0,
    },

    // functions
    setJumpAction: function() {
        // jump up
        
    },
    // LIFE-CYCLE CALLBACKS:

    onKeyDown(e){
        console.log(this.allowJump);
        switch(e.keyCode){
            case cc.macro.KEY.right:
                this.accRight = true;
                break;
            case cc.macro.KEY.left:
                this.accLeft = true;
                break;       
            case cc.macro.KEY.up:
                this.jump = true;
                break;           
        }
    },

    onKeyUp (event) {
        // unset a flag when key released
        switch(event.keyCode) {
            case cc.macro.KEY.right:
                this.accRight = false;
                break;
            case cc.macro.KEY.left:
                this.accLeft = false;
                break;
            case cc.macro.KEY.up:
                this.jump = false;
                break;
        }
    },

    onLoad () {
        this.accLeft = false;
        this.accRight = false;
        this.jump = false;
        this.allowJump = true;

        // The main character's current horizontal velocity
        this.xSpeed = 0;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);   
        cc.director.getPhysicsManager().enabled = true;

    },

    onDestroy () {
        // Cancel keyboard input monitoring
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        console.log(otherCollider.node.name);
        if (otherCollider.node.name === "Land") {
            this.allowJump = true;
        }
    },

    update (dt) {
        // update speed of each frame according to the current acceleration direction
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        if (this.jump && this.allowJump) {
            let rigidbody = this.node.getComponent(cc.RigidBody);
            rigidbody.applyForceToCenter(2);
            this.jump = false;
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
