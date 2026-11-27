AFRAME.registerComponent('finger-touch', {
    init: function () {
      this.lastPressed = false;
      this.tip = null;
    },
    tick: function () {
      if (!this.tip) {
        this.tip = this.el.querySelector('.a-hand-tracking-joint[data-joint="index-finger-tip"]');
        return;
      }

      var tipPos = new THREE.Vector3();
      this.tip.object3D.getWorldPosition(tipPos);

      var clickables = document.querySelectorAll('.clickable');
      var anyTouching = false;

      for (var i = 0; i < clickables.length; i++) {
        var btn = clickables[i];
        var btnPos = new THREE.Vector3();
        btn.object3D.getWorldPosition(btnPos);

        var dist = tipPos.distanceTo(btnPos);
        if (dist < 0.10) {
          anyTouching = true;
          if (!this.lastPressed) {
            this.lastPressed = true;
            btn.emit('click');
            btn.emit('mousedown');
            setTimeout(function() { btn.emit('mouseup'); }, 150);
          }
          break;
        }
      }

      if (!anyTouching) {
        this.lastPressed = false;
      }
    }
});
