$(document).ready(function(e){
	zoomEvent();
});
function zoomEvent(){
	var handle=$("#bar"); //������
	var dragbar=$(".scrollbar"); //������
	var al = $("#minus_key"); //minus
	var ar = $("#plus_key"); //plus
	var al_w = al.outerWidth(); //minus's width
	var step = 10; //one step(max = 100)
	var maxlen=parseInt(dragbar.width())-parseInt(handle.outerWidth()) - parseInt(al_w);  //�����������ߵ�������
	console.log("����������::"+dragbar.width());
	console.log("�����鳤��::"+handle.width());
	console.log("�Ŵ󾵳���::"+al_w);
	console.log("����������::"+maxlen);

	handle.bind("vmousedown",function(e){ //slide
		var x=e.pageX;
		var hx=parseInt(handle.css("left"));  
		$(document).bind("vmousemove",function(e){
			e.preventDefault();
			var left = e.pageX-x+hx < al_w ? al_w : (e.pageX-x+hx >= maxlen ? maxlen : e.pageX-x+hx); 
			handle.css({
				left:left
			});
			var ratio = (left - al_w)/(maxlen - al_w);
			zoomImage(shizixiu,jingkuang,ratio);//zoom image
			$("#message").text(((left - al_w)/(maxlen - al_w)*100).toFixed(0)+"%");
		});
		$(document).bind("vmouseup",function(){
			$(this).unbind("vmousemove");
		})
	})

	al.bind("vclick" ,function(){ //plus
		var hx = parseInt(handle.css("left"));
		var left = -step + hx < al_w ? al_w : -step + hx;
		handle.css({
			left:left
		});
		var ratio = (left - al_w)/(maxlen - al_w);
		zoomImage(shizixiu,jingkuang,ratio); //zoom image
		$("#message").text(((left - al_w)/(maxlen - al_w)*100).toFixed(0)+"%");
	});
	ar.bind("vclick" ,function(){ //minus
		var hx = parseInt(handle.css("left"));
		var left = step + hx >= maxlen ? maxlen : step+hx
		handle.css({
			left:left
		});
		var ratio = (left - al_w)/(maxlen - al_w);
		zoomImage(shizixiu,jingkuang,ratio); //zoom image
		$("#message").text(((left - al_w)/(maxlen - al_w)*100).toFixed(0)+"%");
	});
	//document.ondragstart = function(){return false};
}