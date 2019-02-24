	//发送私信
	$('#comm-submit').on('click', function(){
		
		var $this = $(this);
		var contentVal = $('textarea[name=lettersval]').val();

		if(!userid){
			globalTip({'msg':'登录后才能发私信！','setTime':3,'URL':'https://ui.cn/login.html','jump':true});
			return false;
		}
		
		if ( contentVal == '' ) {
			globalTip({'msg':'内容不能为空！','setTime':3});
			$('textarea[name=lettersval]').focus();
			return false;
		}

		if(contentVal.length >= 200){
			globalTip({'msg':'内容不能超过200字!','setTime':3});
			$('textarea[name=lettersval]').focus();
			return false;
		}

		//内容不为空的时候，点击加菊花
		$this.addClass('loading');
		$this.text('');

		var lettersData = {
			fromid		:	userid,
			toid		:	uid,
			content		:	contentVal
		};
		$.ajax({
			type: "post",
	        url:"https://i.ui.cn/jsonpSendlt",
	        dataType:'jsonp',  
	        data:lettersData,  
	        success:function(result) {  
	            if(result.code == 1){
					globalTip(result);

					$this.removeClass('loading');
					$this.text('确定');

					//关闭弹窗，恢复样式
					$('#modal-letter').removeClass("in");
					$('.modal-backdrop').remove();
					$('body').removeClass("modal-open");
					$('body').css('padding-right','0');

					//输入框清空
					$('textarea[name=lettersval]').val('');	
				}else{
					$this.removeClass('loading');
					$this.text('确定');

					$('textarea[name=lettersval]').focus();
					if(result.status == 10) {
                        var status = confirm("邮箱未激活不能发送私信，是否激活邮箱？");
                        if (status) {
                            window.location = 'https://account.ui.cn/accountinfo.html';
						}
						return false;
                    }
					globalTip(result);

					// $this.removeClass('loading');
					// $this.text('确定');

					// $('textarea[name=lettersval]').focus();
					return false;
				}
	        },
	        timeout:3000
	    });
		return false;
	});


	//私信快捷键提交
	$(document).on('keydown','#textarea-letter',function(event){

		if(event.ctrlKey && event.keyCode == 13) {
	        
	        $('#comm-submit').trigger('click');
	        return false;
		}
		
	})


	//作品收藏
	$(document).on('click', '#p-collect', function() {
		var $this = $(this);
		var data = $this.attr('data');
		var num = parseInt($('#favnum').text());		

		// 添加收藏
		if(data == 'add'){

			$.ajax({
				type:'post',
	            url:'/collect',
	            data:{'pid':pid,'ownerid':uid,'act':'add'},
	            dataType:'json',
	            success:function(msg){

	            	if(msg.code == 1){
						$(".machine").show();
						$(".machine .ma").removeClass("hidden").addClass("show");
						$(".machine .ope").removeClass("hidden").addClass("show");
						window.setTimeout(function(){
							$(".machine .light").show();
						},1000);
						window.setTimeout(function(){
							$(".machine .ma").removeClass("show").addClass("hidden");
							$(".machine .ope").removeClass("show").addClass("hidden");
							$(".machine .light").hide();
						},3000);
	            		globalTip(msg);
	            		$this.addClass('on');
	            		$this.find('strong').text('已收藏');
	                	$this.attr('data','del');

	                	num = num+1;
	                	$('#favnum').text(num);

	            	}else{

	            		globalTip(msg);
	            	}
	                
					return false;
	            }
			})
		}

		// 取消收藏
		if(data == 'del'){

			$.ajax({
				type:'post',
	            url:'/collect',
	            data:{'pid':pid,'ownerid':uid,'act':'del'},
	            dataType:'json',
	            success:function(msg){

	            	if(msg.code == 1){

	            		globalTip(msg);
	            		$this.removeClass('on');
	            		$this.find('strong').text('收藏');
	                	$this.attr('data','add');

	                	num = num-1;
	                	if(num < 0){
							num = 0;
						}
	                	$('#favnum').text(num);
	            	}else{

	            		globalTip(msg);
	            	}
	                
					return false;
	            }
			})
		}
	
	});


	//下载附件
	$('#p-down').click(function(){

		//未登录或者账号被禁用
		if(!userid){

			globalTip({'msg':'登录后才能下载！','setTime':3,'URL':'https://ui.cn/login.html','jump':true});
			return false;
		}

		if(state == 1){

			globalTip({'msg':'你的账户已被注销,请你使用反馈渠道联系管理员！','setTime':5});
			return false;
		}

	});

	// 作品点赞
	$(document).on('click', '.p-like', function() {

		var data = $(this).attr('data'), 
			$this = $(this);

			$.ajax({
				type:'post',
	            url:'/praise',
	            data:{'pid':pid,'ownerid':uid,'type':data},
	            dataType:'json',
	            success:function(msg){

	            	//登录
	            	if(msg.code == 1){
						$(".machine").show();
						$(".machine .ma").removeClass("hidden").addClass("show");
						$(".machine .ope").removeClass("hidden").addClass("show");
						window.setTimeout(function(){
							$(".machine .light").show();
						},1000);
						window.setTimeout(function(){
							$(".machine .ma").removeClass("show").addClass("hidden");
							$(".machine .ope").removeClass("show").addClass("hidden");
							$(".machine .light").hide();
						},3000);
	            		globalTip(msg);
	            		$('.p-like').attr('data', 'unlike');
						$('.p-like').find('.flower').removeClass().addClass(msg.stat);
						$('.p-like').find('.txt').text('已赞');
						$('.p-like').find('.like-num').text( msg.statInfo );

						$('.hexagon-btn').attr('data','unlike');
						$('.l-num').text(msg.num);
						$('.p-like').find('b').text('已赞');

	            	}else{

	            		globalTip(msg);
	            	}

	            	//未登陆
	            	if(msg.code == 2){
						globalTip(msg);
						
						$('.p-like').find('.flower').removeClass().addClass(msg.stat);
						$('.p-like').find('.txt').text('已赞');
						$('.p-like').find('.like-num').text( msg.statInfo );

						$('.l-num').text(msg.num);
						$('.p-like').find('b').text('已赞');

	            	}else{
	            		globalTip(msg);
	            	}

	            	//取消
	            	if(msg.code == 3){

	            		globalTip(msg);

	            		$('.p-like').attr('data', 'like');
						$('.p-like').find('.flower').removeClass().addClass(msg.stat);
						$('.p-like').find('.txt').text('赞');
						$('.p-like').find('.like-num').text( msg.statInfo );

						$('.hexagon-btn').attr('data','like');
						$('.l-num').text(msg.num);
						$('.p-like').find('b').text('赞');

	            	}else{
	            		globalTip(msg);
	            	}
	                
					return false;
	            }
			})

		return false;
	});
	

	//删除作品
	$(document).on('click','.mobtn .yes',function(){

		// if ( confirm ('确定删除该作品么？') ) {
			$.ajax({
				type:'post',
	            url:'/delProject',
	            data:{'pid':pid,'uid':uid,'actid':actid},
	            dataType:'json',
	            success:function(msg){
	            	if(msg.code == 1){

	            		globalTip(msg);
	            	}else{
	            		globalTip(msg);
	            		return false;
	            	}
	            	
	            }
			})

		// }else{

		// 	return false;
		// }

	})
// 判断是不是0
$(document).ready(function(){
	var lP=$('.modal_de .contents p');
	for(var i=0;i<lP.length;i++){
		var Is=lP.eq(i).find('em').text();
		if(Is==0){
			lP.eq(i).remove();
		}
	}
})

	//延迟加载
	$(document).ready(function(){
	      $('.imgloadinglater').lazyload({
            threshold : -100, //距离100像素触发
            effect : "fadeIn" //显示特效
        });
    });

    $(document).ready(function(){
		$(".works-cont p").each(function(){
			if ($(this).has('img').length==0) {
						
	    		$(this).css({
	    			"width": '600px',
	    			"margin": '0 auto'
	    		});
			}else{
				$(this).children('img').css({
					"display": 'inline-block'
				});
				$(this).css({
					"text-align": 'center',
					"margin":"40px auto"
				});
			}	  			   
		});
		$(".works-cont h2").each(function(){
			$(this).css({
    			"width": '600px',
    			"margin": '20px auto'
    		});
		})
		$(".works-cont h3").each(function(){
			$(this).css({
    			"width": '600px',
    			"margin": '20px auto'
    		});
		})


    })

