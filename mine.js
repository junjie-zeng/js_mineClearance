/*
1.点击开始游戏 动态生成100个div
2.小格点击 leftClick 没有雷显示数字（代表以当前小格周围8个格的雷数）
   扩散（当前周围8个格没有雷），有雷 游戏结束

   rightClick 没有标记并且没有数字进行标记 有标记取消标记 标记是否正确，10个
   都正确标记提示成功
*/
    //开始按钮
	var startBtn = document.getElementById('btn');
	//格子的父级
	var box = document.getElementById('box');
	//当前剩余
	var flagBox = document.getElementById('flagBox');
	//遮罩
    var alertBox = document.getElementById('alertBox');
    //消息框
    var alertMsg = document.getElementById("alertMsg");
    //关闭
    var close = document.getElementById('close');
    //剩余数量
    var score = document.getElementById("score");
    //雷的数量
    var minesNum; 
    //当前已经标记出来的雷的数量
    var minerOVer 
    //格子
    var block; 
    //用于判断是否有重复   
    var mineMap = []; 
    //锁
    var isStatus = true;

    //初始化
	bindEvent();
	//所有事件绑定
	function bindEvent(){
		//开始游戏
	    startBtn.onclick = function(){
	    	//锁为true可进
	    	if(isStatus){
	    		//格子的父级
	    		box.style.display = 'block';
	    		//当前剩余
	            flagBox.style.display = 'block';
	            //格子生成方法
	            init();
	            //锁 防止重复点击
	            isStatus = false;
	    	}
	        
	    }

	    //取消鼠标默认事件
	    box.oncontextmenu = function(){
	    	return false;
	    }
        //鼠标按下操作
	    box.onmousedown = function(e){
	    	var event = e.target;
	    	//【判断按键
	    	//左键
            if(e.which == 1){
               leftClick(event);
            }
            //右键
            else if (e.which == 3){
            	rightClick(event);
            }
	    }
        //关闭
	    close.onclick = function(){
	    	//消息框
	    	alertBox.style.display = 'none';
	    	//当前剩余
	    	flagBox.style.display = 'none';
	    	//格子的父级
	    	box.style.display = 'none';
	    	//格子的父级
	    	box.innerHTML = '';
	    	//锁
	    	isStatus = true;
	    }
	}
    //生成小格子
	function init(){
		//雷的数量
        minesNum = 10;
        //当前已经标记出来的雷的数量
        minerOVer = 10;
        //剩余数量文本改变
        score.innerHTML = minerOVer;
        for(var i = 0; i<10;i++){
        	for(var j = 0;j<10 ; j++){
        		//创建div
                var con = document.createElement('div');
                //添加class类
                con.classList.add('block');
                //添加id
                con.setAttribute('id',i + "-" + j);
                //插入boxx
                box.appendChild(con);
                //为后面判断是否重复添加
                mineMap.push({mine:0});
        	}
        }
        //获取所有的格子
        block = document.getElementsByClassName('block');
        //当minesNum有数量的时候才进行循环
        while(minesNum){
            var mineIndex = Math.floor(Math.random()*100);
            //判断雷重复 等于0说明从未改变
            if(mineMap[mineIndex].mine === 0){
            	//将状态改变
            	mineMap[mineIndex].mine = 1;
            	//为生成的雷添加标识符
            	block[mineIndex].classList.add('isMine');
            	//每生成一次雷的数量减一下
            	minesNum --;
            }
        }
	}
	//左键点击
	function leftClick(dom){
		//判断是否插旗，如果插旗则不能左键点击
		if(dom.classList.contains('flag')){
			return;
		}
		//获取所有的雷
		var isMine = document.getElementsByClassName("isMine")
        //如果该dom中包含isMine则点到雷了，并让所有的雷显示出来
        if(dom && dom.classList.contains('isMine')){
            for(var i = 0;i<isMine.length;i++){
            	//显示所有的雷
               isMine[i].classList.add('show');
            }
            //延迟一段时间 将遮罩显示并给消息框赋值
            setTimeout(function(){
               alertBox.style.display = 'block';
               alertMsg.innerHTML = "game over";
            },800)
        }else{
        	//未点到雷的操作
        	var n = 0;
        	var posArr =  dom  && dom.getAttribute('id').split("-");
            var posX = posArr && +posArr[0];
            var posY = posArr && +posArr[1];
            //dom存在并且添加num类样式
            dom && dom.classList.add('num');
            for(var i = posX - 1; i <= posX + 1;i ++){
                for(var j = posY - 1 ;j <= posY + 1;j ++){
                    var aroundBox = document.getElementById(i + "-" + j);
                    if(aroundBox && aroundBox.classList.contains('isMine')){
                        n ++;
                    }
                }
            }

            dom && (dom.innerHTML = n);
            //扩散情况
            if(n == 0){
               for(var i = posX - 1; i <= posX + 1;i ++){
                 for(var j = posY - 1;j <= posY + 1;j ++){
                 	var nearBox = document.getElementById(i + "-" + j);
                 	if(nearBox && nearBox.length != 0){
                 		if(!nearBox.classList.contains('check')){
                 			nearBox.classList.add('check');
                 			//递归
                 		    leftClick(nearBox);
                 		}
                 	}
                 }
               }
            }
        }
	}

	//右键点击
	function rightClick(dom){
		//插旗操作
		//如果包含nun则不作任何操作
		if(dom.classList.contains('num')){
            return;
		}
        //toggle切换 插完旗或者取消
		dom.classList.toggle('flag');
		//如果dom中有isMine 并且当且有flag 则将雷的数量--
		if(dom.classList.contains('isMine') && dom.classList.contains('flag')){
           minerOVer -- ;
		}
        //如果dom中有isMine 并且不包含flag  则雷的数量++
		if(dom.classList.contains('isMine') && !dom.classList.contains('flag')){
           minerOVer ++ ;
		}

		score.innerHTML = minerOVer;

		if(minerOVer == 0){
            alertBox.style.display = 'block';
            alertMsg.innerHTML = "success";
		}
	}