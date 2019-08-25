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
        // face direction
        faceRight: true,
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
        switch(e.keyCode){
            case cc.macro.KEY.right:
                this.faceRight = true;
                this.xSpeed = 300;
                break;
            case cc.macro.KEY.left:
                this.faceRight = false;
                this.xSpeed = -300;
                break;       
            case cc.macro.KEY.up:
                this.jump = true;
                break; 
            case cc.macro.KEY.a:
                this.attack = true;
                break;          
        }
    },

    onKeyUp (event) {
        // unset a flag when key released

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
            case cc.macro.KEY.a:
                this.attack = false;
                break;  
        }
    },

    // Registers touch behaviours on the movement buttons
    onTouch (button) {
        this[button].on(cc.Node.EventType.TOUCH_START, function (event) {
            switch (button) {
                case 'leftButton':
                    this.xSpeed = -300;
                    this.faceRight = false;
                    break;
                case 'rightButton':
                    this.xSpeed = 300;
                    this.faceRight = true;
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
        console.log(otherCollider.node.name, selfCollider.tag, otherCollider.tag, this.attack);
        if (otherCollider.node.name === "Land") {
            this.allowJump = true;
        }
        if (otherCollider.node.name === "Enemy") {
            // on begin contact, stores the enemy node in state machine 
            if (selfCollider.tag === 1 && otherCollider.tag === 1) {
                this.otherTarget = otherCollider.node;
            }
        }
    },

    onEndContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "Enemy") {
            // Remove enemy node in state machine when enemy and character are no longer in contact
            if (selfCollider.tag === 1 && otherCollider.tag === 1) {
                this.otherTarget = null;
            }
        }
    },

    onLoad () {
        // State management for jumping action
        this.jump = false;
        this.allowJump = true;

        // state machine that stores all enemies that is in attack range of the character
        this.otherTarget = null;

        this.attack = false;
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
            let rigidbody = this.node.getComponent(cc.RigidBody);
            rigidbody.applyLinearImpulse(new cc.Vec2(0,this.jumpForce), rigidbody.getWorldCenter(),true);
            this.allowJump = false;

        }

        // Lets the character face the direction he is moving

        if (this.faceRight) {
            this.node.scaleX = Math.abs(this.node.scaleX);
        } else {
            this.node.scaleX = -1 * Math.abs(this.node.scaleX);
        }

        // If attack occurs when any enemy targets are in range, destroy target
        if (this.attack && !!this.otherTarget) {
            this.otherTarget.destroy();
        }
        // update the position of the main character according to the current speed
        this.node.x += this.xSpeed * dt;
    },
    
});
