function App(){
	let 
	canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"),
	dom = {
		dragover : function(e){ // dragover
			e.stopPropagation();
			e.preventDefault();
		},drop : function(e){ // drop
			e.stopPropagation();
			e.preventDefault();
			let files = e.dataTransfer.files;
			if( files.length == 1 ){
				if( files[0].type.match(/image/) ){
					canvas_setting(window.URL.createObjectURL(files[0]));
				}else{
					alert("이미지 파일이 아닙니다,");
				}
			}else{
				alert("1개의 이미지 파일만 가능합니다.");
			}
		},mouseup : function(e){
			c_drag.drag = false;
		},keyup : function(e){
			switch(e.keyCode){
				case 13:
				let a = document.createElement("a");
				a.download = "01.png";
				a.href = canvas.toDataURL();
				a.click();
				break;
				case 46:
				c_drag.src = canvas.toDataURL();
				c_drag.arr.forEach( v =>{
					v.clear();
					v.remove();
				} );
				c_drag.arr = [];
				break;
			}
		}
	},c_drag = {
		box : document.getElementById("canvas-box"),
		drag : false,
		arr : [],
		download : false,
		src : "",
		mousemove : function(e){
			if( c_drag.drag ){
				c_drag.arr[c_drag.arr.length-1].Setmove(e.offsetX,e.offsetY);
				c_drag.arr[c_drag.arr.length-1].Createmove();
			}
		},mousedown : function(e){
			c_drag.drag = true;
			c_drag.arr.push(new drag_box(e.offsetX,e.offsetY));
		}
	}
	function init(){ // init
		event();
	}
	function event(){ // event
		document.addEventListener("dragover",dom.dragover);		
		document.addEventListener("drop",dom.drop);
		document.addEventListener("mouseup",dom.mouseup);
		document.addEventListener("keyup",dom.keyup);
		canvas.addEventListener("mousemove",c_drag.mousemove);
		canvas.addEventListener("mousedown",c_drag.mousedown);
	}
	function canvas_setting(src){ // canvas_setting
		let img = new Image();
		img.src = src;
		img.onload = function(){
			let width = img.width , height = img.height;
			if( width > window.innerWidth || height > window.innerHeight ){
				if( width > height ){
					let cnt = window.innerWidth/(width/100);
					width = window.innerWidth;
					height = height/100*cnt;
				}else{
					let cnt = window.innerHeight/(height/100);
					width = (width/100)*cnt;
					height = window.innerHeight;
				}
			}
			canvas.width = width;
			canvas.height = height;
			c_drag.download = true;
			c_drag.src = src;
			ctx.drawImage(img,0,0,width,height);
		}
	}
	function drag_box(x,y){
		this.div = document.createElement("div");
		this.downX = x;
		this.downY = y;
		this.moveX = this.downX;
		this.moveY = this.downY;
		this.div.style.position = "absolute";
		this.div.style.pointerEvents = "none";
		this.div.style.background = "rgba(255,255,255,0.1)";
		c_drag.box.append(this.div);
	}
	drag_box.prototype.Setmove = function(x,y){
		this.moveX = x;
		this.moveY = y;
	}
	drag_box.prototype.Createmove = function(){
		let left = this.downX, top = this.downY;
		if( this.moveX < this.downX ){
			left = this.moveX;
		}
		if( this.moveY < this.downY ){			
			top = this.moveY;
		}
		this.div.style.left = left+"px";
		this.div.style.top = top+"px";
		this.div.style.width = Math.abs( this.downX - this.moveX )+"px";
		this.div.style.height = Math.abs( this.downY - this.moveY )+"px";
	}
	drag_box.prototype.clear = function(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		let img = new Image();
		img.src = c_drag.src;
		img.onload = ()=>{
			let left = this.downX , top = this.downY ,
			width = Math.abs(this.moveX-this.downX) , height = Math.abs(this.moveY-this.downY);
			if( this.moveX < this.downX ){
				left = this.moveX;
			}
			if( this.moveY < this.downY ){
				top = this.moveY;
			}
			ctx.drawImage(img,left,top,width,height,left,top,width,height);
		}
	}
	drag_box.prototype.remove = function(){
		c_drag.box.removeChild(this.div);
	}
	init();
}
window.onload = function(){
	App();
}