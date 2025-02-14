import { setStyle, addClass, removeClass, hasClass } from '../utils';

export default function autoOrientation(art) {
    const {
        constructor,
        template: { $player, $video },
    } = art;

    art.on('fullscreenWeb', (state) => {
        if (state) {
            const { videoWidth, videoHeight } = $video;
            const { clientWidth: viewWidth, clientHeight: viewHeight } = document.documentElement;
            if (
                (videoWidth > videoHeight && viewWidth < viewHeight) ||
                (videoWidth < videoHeight && viewWidth > viewHeight)
            ) {
                // There is a conflict with the fullscreen event, and it is changed to asynchronous execution
                setTimeout(() => {
                    setStyle($player, 'width', `${viewHeight}px`);
                    setStyle($player, 'height', `${viewWidth}px`);
                    setStyle($player, 'transform-origin', '0 0');
                    setStyle($player, 'transform', `rotate(90deg) translate(0, -${viewWidth}px)`);
                    addClass($player, 'art-auto-orientation');
                    art.isRotate = true;
                    art.emit('resize');
                }, constructor.AUTO_ORIENTATION_TIME);
            }
        } else {
            if (hasClass($player, 'art-auto-orientation')) {
                removeClass($player, 'art-auto-orientation');
                art.isRotate = false;
                art.emit('resize');
            }
        }
    });

    return {
        name: 'autoOrientation',
        get state() {
            return hasClass($player, 'art-auto-orientation');
        },
    };
}
