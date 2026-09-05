 //FULL SRCEEN
 $('.btnGamePlayMob ').click(function () {
    $('.playMob').toggleClass('hide');
    openFullscreen();
    if (ori == 'landscape-primary')
        screen.orientation
            .lock('landscape-primary')
            .then(function () {})
            .catch(function (error) {});
});

$('.closegame ').click(function () {
    $('.playMob').toggleClass('hide');
    closeFullscreen();
});

//full sreen iframe
$('.FullscreenButton').click(function () {
    openFullscreen();
});
var elem = document.querySelector('.wrap-game');
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
    }
}

if (elem) {
    elem.addEventListener('fullscreenchange', fullscreenchanged);

    function fullscreenchanged(event) {
        // document.fullscreenElement will point to the element that
        // is in fullscreen mode if there is one. If not, the value
        // of the property is null.
        if (document.fullscreenElement) {
            // console.log(`Element: ${document.fullscreenElement.id} entered fullscreen mode.`);
            elem.classList.add('openFull');
        } else {
            // console.log('Leaving fullscreen mode.');
            $('.wrap-game').removeClass('openFull');
        }
    }
}
