//スクロールすると上部に固定させるための設定を関数でまとめる
function FixedAnime() {
	var headerH = $('#defaultCanvas0').offset().top + $('#defaultCanvas0').outerHeight() / 4;
	var scroll = $(window).scrollTop();
	if (scroll >= headerH){ //canvasが1/4隠れた場合
			$('#subCanvas').addClass('appear');//subCanvasにappearというクラス名を付与
		}else{
			$('#subCanvas').removeClass('appear');
		}
}

$(window).scroll(function () {
    FixedAnime();/* スクロール途中からヘッダーを出現させる関数を呼ぶ*/
  });