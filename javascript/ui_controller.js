AFRAME.registerComponent('ui-controller', {
    init: function () {
        let isOn = false;
        let viewMode = 'gallery';
        let currentPage = 0;
        let focusIndex = 0;

        var mediaItems = [];
        var totalImages = 6;
        var totalVideos = 6;
        
        for (var i = 1; i <= totalImages; i++) {
            mediaItems.push({type: 'image', src: 'Images/image' + i + '.jpg', name: 'Imagem ' + i});
        }
        for (var i = 1; i <= totalVideos; i++) {
            mediaItems.push({type: 'video', src: 'Videos/video' + i + '.mp4', name: 'Video ' + i, poster: 'Images/thumb' + i + '.png'});
        }

        var screenEl = document.querySelector('#cinema-screen');
        var btnOk = document.querySelector('#btn-ok');
        var btnBack = document.querySelector('#btn-back');
        var wrapOnOff = document.querySelector('#on-off');
        var arrowUp = document.querySelector('#arrow-up');
        var arrowDown = document.querySelector('#arrow-down');
        var arrowLeft = document.querySelector('#arrow-left');
        var arrowRight = document.querySelector('#arrow-right');

        function playSoundSafe(el) {
            if (el && el.components && el.components.sound) {
                try {
                    el.components.sound.playSound();
                } catch (err) {
                    console.warn('Erro ao tocar som:', err);
                }
            }
        }

        function setupButton(el, hoverScale, normalScale, onClickCallback) {
            if (!el) return;
            el.addEventListener('mouseenter', function () { el.setAttribute('scale', hoverScale); });
            el.addEventListener('mouseleave', function () { el.setAttribute('scale', normalScale); });
            if (onClickCallback) { el.addEventListener('click', onClickCallback); }
        }

        function updateScreen() {
            buildScreenUI(screenEl, isOn, viewMode, mediaItems, currentPage, focusIndex);
        }

        function moveSelectionOnly(newFocus) {
            focusIndex = newFocus;
            let border = document.getElementById('selection-border');
            if (!border) return;

            const startX = -1.5;
            const startY = 0.8;
            const spacingX = 3.0;
            const spacingY = 1.4;

            let focusCol = focusIndex % 2;
            let focusRow = Math.floor(focusIndex / 2);
            let bx = startX + (focusCol * spacingX);
            let by = startY - (focusRow * spacingY);

            border.setAttribute('position', `${bx} ${by} 0.04`);
            border.setAttribute('width', focusIndex >= 4 ? '2.2' : '2.1');
            border.setAttribute('height', focusIndex >= 4 ? '0.5' : '1.0');
        }

        function isValid(newFocus) {
            if (newFocus >= 4) return true;
            let globalIndex = (currentPage * 4) + newFocus;
            return globalIndex < mediaItems.length;
        }

        setupButton(wrapOnOff, '1.1 1.1 1.1', '1.0 1.0 1.0', function () {
            wrapOnOff.components.sound.playSound();
            isOn = !isOn;
            viewMode = 'gallery';
            currentPage = 0;
            focusIndex = 0;
            updateScreen();
        });

        setupButton(btnOk, '1.1 1.1 1.1', '1.0 1.0 1.0', function () {
            btnOk.components.sound.playSound();
            if (!isOn) return;
            if (viewMode === 'gallery') {
                let totalPages = Math.ceil(mediaItems.length / 4);
                
                if (focusIndex < 4) {
                    let globalIndex = (currentPage * 4) + focusIndex;
                    if (globalIndex < mediaItems.length) { 
                        viewMode = 'fullscreen';
                        updateScreen();
                    }
                } else if (focusIndex === 4 && currentPage > 0) {
                    currentPage--;
                    focusIndex = 0;
                    updateScreen();
                } else if (focusIndex === 5 && currentPage < totalPages - 1) {
                    currentPage++;
                    focusIndex = 0;
                    updateScreen();
                }
            }
        });

        setupButton(btnBack, '1.1 1.1 1.1', '1.0 1.0 1.0', function () {
            btnBack.components.sound.playSound();
            if (!isOn) return;
            if (viewMode === 'fullscreen') {
                viewMode = 'gallery';
                updateScreen();
            }
        });

        setupButton(arrowUp, '1.2 1.2 1.2', '1.0 1.0 1.0', function () {
            arrowUp.components.sound.playSound();
            if (!isOn || viewMode !== 'gallery') return;
            let dest = focusIndex >= 2 ? focusIndex - 2 : focusIndex;
            if (isValid(dest)) moveSelectionOnly(dest);
        });

        setupButton(arrowDown, '1.2 1.2 1.2', '1.0 1.0 1.0', function () {
            arrowDown.components.sound.playSound();
            if (!isOn || viewMode !== 'gallery') return;
            let dest = focusIndex <= 3 ? focusIndex + 2 : focusIndex;
            if (isValid(dest)) moveSelectionOnly(dest);
        });

        setupButton(arrowLeft, '1.2 1.2 1.2', '1.0 1.0 1.0', function () {
            arrowLeft.components.sound.playSound();
            if (!isOn || viewMode !== 'gallery') return;
            let dest = focusIndex % 2 !== 0 ? focusIndex - 1 : focusIndex;
            if (isValid(dest)) moveSelectionOnly(dest);
        });

        setupButton(arrowRight, '1.2 1.2 1.2', '1.0 1.0 1.0', function () {
            arrowRight.components.sound.playSound();
            if (!isOn || viewMode !== 'gallery') return;
            let dest = focusIndex % 2 === 0 ? focusIndex + 1 : focusIndex;
            if (isValid(dest)) moveSelectionOnly(dest);
        });
    }
});