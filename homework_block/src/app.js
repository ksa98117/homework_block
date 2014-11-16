var HelloWorldLayer = cc.Layer.extend({
	sprite:null,
	ctor:function () {
		//////////////////////////////
		// 1. super init first
		
		
		this._super();
		
		this.back=new cc.Sprite("res/sky.jpg"); //배경
		this.back.scale=100;
		this.back.x=0;
		this.back.y=this.height ;
		this.addChild(this.back);
	
		this.ball = new cc.Sprite("res/ball.png"); //움직이는공
		this.ball.scale = 0.5;
		this.ball.x = this.width/2;
		this.ball.y = this.height/2;
		this.addChild(this.ball); 
		var initialDirection = 4.5; 
		this.ball.speedX = 5*Math.cos(initialDirection); //공의 움직임, 각도 라고할수도 있음
		this.ball.speedY = 5*Math.sin(initialDirection);
		this.ball.angleSpeed = 0;

		this.box = new cc.Sprite("res/block.jpg");  //언더바
		this.box.scaleX = 1.2;
		this.box.scaleY = 0.3;
		this.box.x = this.width/2;
		this.box.y = 50;
		this.addChild(this.box);
		
		//벽돌생성
		this.block = new cc.Sprite("res/block2.jpg")
		this.block.x = 50;// 벽돌의 크기
		this.block.y = 350;
		this.block.scaleX = 0.7; //벽돌의 위치
		this.block.scaleY = 0.2; 
		
		var initialDirection1 = Math.random(2*Math.PI);//초기 속도
		this.block.speedX = Math.cos(initialDirection1);
		this.block.speedY = Math.sin(initialDirection1);
		this.addChild(this.block);
		

		var eventListener = cc.EventListener.create({ //특정이벤트가 일어났을때 이벤트함수를 관리하는 겍체.
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches:true,
			onTouchBegan:function(){
				return true;
			},
			onTouchMoved:function(touch, event){
				event.getCurrentTarget().box.x = touch.getLocationX();
				return true;
			}
		});
		cc.eventManager.addListener(eventListener, this);
	
		//깨지를 벽돌에 대한 실행
		this.update = function(dt){ //레이어에 업데이트 함수 구현 (매프레임마다 실행)
			this.block.x += this.block.speedX;
			this.block.y += this.block.speedY;
			if(this.block.x<this.block.getBoundingBox().width/2){
				this.block.speedX = -this.block.speedX;
			}
			if(this.block.x>this.width-this.block.getBoundingBox().width/2){
				this.block.speedX = -this.block.speedX;
			}
			if(this.block.y<this.block.getBoundingBox().height/2){
				this.block.speedY = -this.block.speedY;
			}
			if(this.block.y>this.height-this.block.getBoundingBox().height/2){
				this.block.speedY = -this.block.speedY;
			}
		}
		this.scheduleUpdate();
//

	//	this.removeChild(this.block);
		
		this.update = function(){ //레이어에 업데이트 함수 구현 (매프레임마다 실행)
			var boxTop = this.box.y+this.box.getBoundingBox().height/2;
			var ballBottom = this.ball.y-this.ball.getBoundingBox().height/2; //위에 꺼랑 이거랑 볼 움직이는 것
			if(ballBottom>boxTop&&ballBottom+this.ball.speedY<boxTop){
				var xOnBox = this.ball.x+(boxTop+this.ball.getBoundingBox().height/2-this.ball.y)*this.ball.speedX/(this.ball.speedY);
				var boxLeft = this.box.x-this.box.getBoundingBox().width/2;
				var boxRight = this.box.x+this.box.getBoundingBox().width/2;
				
				if(xOnBox>boxLeft&&xOnBox<boxRight){
					//cc.audioEngine.playEffect("res/bang.mp3", false);
					this.ball.speedY *= -1;
					if(this.ball.speedX>0){
						//this.ball.angleSpeed = 1.2;
					}else{
						//this.ball.angleSpeed = -1.2; 
					}
					this.ball.y = 2*(boxTop+this.ball.getBoundingBox().height/2)-this.ball.y;

					var alpha = Math.atan2(this.ball.speedY, this.ball.speedX);
					alpha += 0.01*(this.box.x-xOnBox);
					this.ball.speedX = 5*Math.cos(alpha);
					this.ball.speedY = 5*Math.sin(alpha);

				}
			}

			//블록 충돌부분-위아래
			if(this.ball.x>this.block.x-this.block.getBoundingBox().width/2
					&&this.ball.x<this.block.x+this.block.getBoundingBox().width/2){ //블럭x부분- 공의 중심이 닿는 부분 계산
				if(this.ball.y+this.ball.getBoundingBox().height/2>this.block.y-this.block.getBoundingBox().height/2
						&&this.ball.y-this.ball.getBoundingBox().height/2<this.block.y-this.block.getBoundingBox().height/2){//아래 충돌
					if(this.ball.speedY>0){
						this.ball.y=2*(this.block.y-this.block.getBoundingBox().height/2- this.ball.getBoundingBox().height/2)-this.ball.y;
						//this.ball.speedY*=-1; //공의 속도 조절

						//this.block=false;
						this.block.setVisible(false); //다음 화면에서 블럭을 지운다(블럭을 지우는 것임)
			
					}
					}
				if(this.ball.x-this.ball.getBoundingBox().width/2<this.block.x+this.block.getBoundingBox().width/2
						&&this.ball.x+this.ball.getBoundingBox().width/2>this.block.x+this.block.getBoundingBox().width/2){//오른쪽 충돌
					if(this.ball.speedX<0){
						this.ball.x=2*(this.block.x+this.block.getBoundingBox().width/2+this.ball.getBoundingBox().width/2)-this.ball.x;
						this.ball.speedX*=-1; 
						//this.block=false;

						this.block.setVisible(false);
			}
				}
			}
	
		//this.ball.rotation+=this.ball.angleSpeed; //공의 회전
			this.ball.x += this.ball.speedX;
			this.ball.y += this.ball.speedY;
			
			if(this.ball.x<this.ball.getBoundingBox().width/2){ 	//this.ball.x<this.ball.getBoundingBox().width/2 공의 너비를 의미
				this.ball.speedX = -this.ball.speedX; //공의 속도를 줄임
				
				
				// this.ball.speedX *= -1; //교수님 코드
				if(this.ball.speedY>0){
					//this.ball.angleSpeed = -1.2;
				}else{
					//this.ball.angleSpeed = 1.2;
				}
				this.ball.x = this.ball.getBoundingBox().width-this.ball.x;
			}
			
			if(this.ball.x>this.width-this.ball.getBoundingBox().width/2){
				this.ball.speedX = -this.ball.speedX;
				//this.ball.speedX *= -1; //교수님 코드
				if(this.ball.speedY>0){
					//this.ball.angleSpeed = 1.2;
				}else{
					//this.ball.angleSpeed = -1.2;
				}
				this.ball.x = 2*(this.width-this.ball.getBoundingBox().width/2)- this.ball.x;
			}
			if(this.ball.y<this.ball.getBoundingBox().height/2){
				this.ball.speedY = -this.ball.speedY; 
				//this.ball.speedY *= -1; //교수님 코드
				if(this.ball.speedX>0){
				//	this.ball.angleSpeed = 1.2;
				}else{
					//this.ball.angleSpeed = -1.2;
				}
				this.ball.y = 2*(this.ball.getBoundingBox().height/2)-this.ball.y;
			}  
			if(this.ball.y>this.height-this.ball.getBoundingBox().height/2){
				
				this.ball.speedY = -this.ball.speedY;
				//this.ball.speedY *= -1;
				if(this.ball.speedX>0){
				//	this.ball.angleSpeed = -1.2;
				}else{
					//this.ball.angleSpeed = 1.2;
				}
				this.ball.y = 2*(this.height - this.ball.getBoundingBox().height/2) - this.ball.y;
			}
		}
		this.scheduleUpdate();
		
		return true;
	}
			
		
});

var HelloWorldScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new HelloWorldLayer();
		this.addChild(layer);
	}
});
