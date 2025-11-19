(function () {
    class SoundManager {
        constructor() {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                this.enabled = true;
            } catch (e) {
                console.warn("AudioContext not supported or blocked:", e);
                this.enabled = false;
            }
        }

        playCorrect() {
            if (!this.enabled) return;
            try {
                this.resumeContext();

                const t = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                // Coin/Sword Sheathe effect
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200, t);
                osc.frequency.exponentialRampToValueAtTime(2000, t + 0.1);

                gain.gain.setValueAtTime(0.3, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(t);
                osc.stop(t + 0.5);

                // Secondary harmonic
                const osc2 = this.ctx.createOscillator();
                const gain2 = this.ctx.createGain();
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(2400, t);
                gain2.gain.setValueAtTime(0.1, t);
                gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

                osc2.connect(gain2);
                gain2.connect(this.ctx.destination);
                osc2.start(t);
                osc2.stop(t + 0.3);
            } catch (e) {
                console.warn("Error playing sound:", e);
            }
        }

        playWrong() {
            if (!this.enabled) return;
            try {
                this.resumeContext();

                const t = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                // Wooden Clunk
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, t);
                osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);

                gain.gain.setValueAtTime(0.2, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

                // Lowpass filter
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(300, t);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(t);
                osc.stop(t + 0.2);
            } catch (e) {
                console.warn("Error playing sound:", e);
            }
        }

        resumeContext() {
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume().catch(e => console.warn("Could not resume audio context:", e));
            }
        }
    }

    window.WanoSound = new SoundManager();
})();
