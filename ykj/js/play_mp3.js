/**
 * Created by MDJ on 2016/12/27.
 */

/* 音频播放对象 */
window.iaudio = null;
/***********************************************local Variables**********************************************************/

function my_play(audio_url){
    reset();

    window.iaudio.src = audio_url;
    window.iaudio.play();
}

/**
 * 停止播放音频
 *
 */
function stop() {
    window.iaudio.pause();
}

function start() {
    window.iaudio.play();
}


/**
 * 重置音频缓存队列和播放对象
 * 若音频正在播放，则暂停当前播放对象，创建并使用新的播放对象.
 */
function reset()
{
    if(window.iaudio != null)
    {
        window.iaudio.pause();
    }
    window.iaudio = new Audio();
    window.iaudio.src = '';
}
