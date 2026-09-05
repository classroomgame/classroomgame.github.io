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

function LoadImg(lzl) {
    return function(e) {
        var observer,
            options = {
                rootMargin: "0px",
                threshold: 0.05
            },
            allTheLazyImages = document.querySelectorAll("." + lzl);
        function lazyLoader(e) {
            e.forEach(function(e) {
                e.intersectionRatio > 0 && lazyLoadImg(e.target);
            });
        }
        function lazyLoadImg(e) {
            e.onload = function() {
                e.classList.remove(lzl);
            };
            e.dataset.lazybackground && (e.style.backgroundImage = "url(".concat(e.dataset.lazybackground, ")")),
            e.getAttribute("data-src") && (
                (e.src = hasWebP && -1 != e.dataset.src.indexOf("googleusercontent.com") ? e.dataset.src + "-rw" : e.dataset.src), "IntersectionObserver" in window && observer.unobserve(e)
            );
        }
        if("IntersectionObserver" in window)(observer = new IntersectionObserver(lazyLoader, options)), allTheLazyImages.forEach(function(e) {
            observer.observe(e);
        });
        else for (var i = 0; i < allTheLazyImages.length; i++) lazyLoadImg(allTheLazyImages[i]);
    }
}   

function lazyScript(c, e) {
    var n = document.createElement("script");
    n.async = !0, e && (n.onload = e), document.head.appendChild(n), n.src = c
}


// lazyload Img
document.addEventListener('DOMContentLoaded', LoadImg('img-lazy'));
var lazyLoad = false;
function onLazyLoad(){
    if (lazyLoad === true) return;
    lazyLoad = true;
    document.removeEventListener('scroll', onLazyLoad);
    document.removeEventListener('mousemove', onLazyLoad);
    document.removeEventListener('mousedown', onLazyLoad);
    document.removeEventListener('touchstart', onLazyLoad);
}
document.addEventListener("scroll", onLazyLoad),
document.addEventListener("mousemove", onLazyLoad),
document.addEventListener("mousedown", onLazyLoad),
document.addEventListener("touchstart", onLazyLoad),
document.addEventListener("load", function() {
    document.body.clientHeight != document.documentElement.clientHeight && 0 == document.documentElement.scrollTop && 0 == document.body.scrollTop || onLazyLoad()
});

var hasWebP = !1;
!function() {
    var A = new Image;
    A.onload = function() {                
        hasWebP = !!(A.height > 0 && A.width > 0)
    }, A.onerror = function() {
        hasWebP = !1
    }, A.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA"            
}(); 


