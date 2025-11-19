(function () {
    window.WanoLevels = window.WanoLevels || {};

    window.WanoLevels.level4 = {
        id: 4,
        title: "The 'To Be' Shrine",
        description: "Choose the correct form to light the lanterns.",
        questions: [
            // Affirmative
            { q: "I ___ a student.", options: ["am", "is", "are"], correct: "am" },
            { q: "She ___ happy.", options: ["am", "is", "are"], correct: "is" },
            { q: "They ___ friends.", options: ["am", "is", "are"], correct: "are" },
            // Negative
            { q: "He ___ sad.", options: ["is not", "are not", "am not"], correct: "is not" },
            { q: "We ___ tired.", options: ["isn't", "aren't", "am not"], correct: "aren't" },
            { q: "It ___ a dog.", options: ["isn't", "aren't", "am not"], correct: "isn't" },
            // Questions
            { q: "___ you hungry?", options: ["Am", "Is", "Are"], correct: "Are" },
            { q: "___ he your brother?", options: ["Am", "Is", "Are"], correct: "Is" },
            { q: "___ I late?", options: ["Am", "Is", "Are"], correct: "Am" }
        ],

        render(container, onComplete, onScoreUpdate) {
            let currentStep = 0;
            let score = 0;

            const renderStep = () => {
                if (currentStep >= this.questions.length) {
                    container.innerHTML = `
                        <div class="text-center animate-fade-in">
                            <h2 class="text-3xl text-wano-gold font-shojumaru mb-4">Shrine Illuminated!</h2>
                            <p class="text-white mb-6">The spirits are pleased.</p>
                            <button id="finish-level-btn" class="bg-wano-red text-white px-6 py-2 rounded border-2 border-wano-gold font-ruslan hover:bg-red-700 transition-colors">
                                Return to Map
                            </button>
                        </div>
                    `;
                    document.getElementById('finish-level-btn').addEventListener('click', () => {
                        onComplete(score);
                    });
                    return;
                }

                const q = this.questions[currentStep];

                container.innerHTML = `
                    <div class="w-full max-w-md flex flex-col gap-6 animate-fade-in">
                        <div class="text-center text-wano-gold font-ruslan text-xl mb-4">
                            Lantern ${currentStep + 1} / ${this.questions.length}
                        </div>
                        
                        <!-- Question Card -->
                        <div class="bg-wano-red text-white p-8 rounded-lg shadow-2xl border-4 border-wano-gold text-center relative overflow-hidden">
                            <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 pointer-events-none"></div>
                            <p class="font-serif text-2xl font-bold relative z-10 text-shadow-black">${q.q.replace('___', '_____')}</p>
                        </div>

                        <!-- Options -->
                        <div class="grid grid-cols-1 gap-4 mt-4">
                            ${q.options.map((opt, idx) => `
                                <button class="option-btn bg-wano-black border-2 border-wano-gold/50 text-wano-gold hover:bg-wano-gold hover:text-wano-red text-xl font-bold py-4 rounded transition-all duration-300 transform hover:scale-105 shadow-lg" data-opt="${opt}">
                                    ${opt}
                                </button>
                            `).join('')}
                        </div>
                        
                        <div id="feedback-area" class="h-8 text-center font-bold"></div>
                    </div>
                `;

                // Event Listeners
                container.querySelectorAll('.option-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const selected = e.target.dataset.opt;
                        const feedback = document.getElementById('feedback-area');

                        if (selected === q.correct) {
                            feedback.textContent = "Correct! +100 Bounty";
                            feedback.className = "h-8 text-center font-bold text-green-400";
                            score += 100;
                            onScoreUpdate(100);
                            if (window.WanoSound) window.WanoSound.playCorrect();

                            setTimeout(() => {
                                currentStep++;
                                renderStep();
                            }, 800);
                        } else {
                            feedback.textContent = "Incorrect!";
                            feedback.className = "h-8 text-center font-bold text-red-400";
                            if (window.WanoSound) window.WanoSound.playWrong();
                            e.target.classList.add('border-red-500', 'text-red-500');
                        }
                    });
                });
            };

            renderStep();
        }
    };
})();
