(function () {
    window.WanoLevels = window.WanoLevels || {};

    window.WanoLevels.level3 = {
        id: 3,
        title: "Pronoun Palace",
        description: "Catch the correct petal to complete the sentence.",
        questions: [
            {
                sentence: "___ am a samurai.",
                options: ["I", "My", "Me"],
                correct: "I"
            },
            {
                sentence: "This is ___ sword.",
                options: ["you", "your", "you're"],
                correct: "your"
            },
            {
                sentence: "___ name is Luffy.",
                options: ["He", "His", "Him"],
                correct: "His"
            },
            {
                sentence: "___ are happy.",
                options: ["We", "Our", "Us"],
                correct: "We"
            },
            {
                sentence: "Is that ___ ship?",
                options: ["they", "their", "them"],
                correct: "their"
            }
        ],

        render(container, onComplete, onScoreUpdate) {
            let currentStep = 0;
            let score = 0;

            const renderStep = () => {
                if (currentStep >= this.questions.length) {
                    container.innerHTML = `
                        <div class="text-center animate-fade-in">
                            <h2 class="text-3xl text-wano-gold font-shojumaru mb-4">Palace Cleared!</h2>
                            <p class="text-white mb-6">You know who you are.</p>
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
                    <div class="w-full max-w-md flex flex-col gap-6 animate-fade-in relative min-h-[400px]">
                        <div class="text-center text-wano-gold font-ruslan text-xl mb-8">
                            Room ${currentStep + 1} / ${this.questions.length}
                        </div>
                        
                        <!-- Sentence Display -->
                        <div class="bg-wano-paper text-wano-black p-6 rounded shadow-lg border-2 border-wano-black text-center relative z-10">
                            <p class="font-serif text-2xl font-bold">${q.sentence.replace('___', '<span class="text-wano-red border-b-2 border-wano-black min-w-[50px] inline-block">?</span>')}</p>
                        </div>

                        <!-- Floating Petals Container -->
                        <div class="relative flex-grow h-64 overflow-hidden border border-wano-gold/20 rounded bg-black/20 mt-4">
                            ${q.options.map((opt, idx) => `
                                <button class="petal-btn absolute bg-pink-300 text-wano-red font-bold p-4 rounded-full shadow-lg hover:scale-110 transition-transform border border-pink-400 flex items-center justify-center w-20 h-20 animate-float" 
                                    style="
                                        left: ${10 + (idx * 30)}%; 
                                        top: ${20 + (idx * 10)}%; 
                                        animation-delay: ${idx * 0.5}s;
                                    "
                                    data-opt="${opt}">
                                    ${opt}
                                </button>
                            `).join('')}
                        </div>
                        
                        <div id="feedback-area" class="h-8 text-center font-bold z-20"></div>
                    </div>
                `;

                // Event Listeners
                container.querySelectorAll('.petal-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const selected = e.target.closest('.petal-btn').dataset.opt;
                        const feedback = document.getElementById('feedback-area');

                        if (selected === q.correct) {
                            feedback.textContent = "Correct! +100 Bounty";
                            feedback.className = "h-8 text-center font-bold text-green-400";
                            score += 100;
                            onScoreUpdate(100);
                            if (window.WanoSound) window.WanoSound.playCorrect();

                            // Visual feedback on sentence
                            container.querySelector('p').innerHTML = q.sentence.replace('___', `<span class="text-green-600 underline">${selected}</span>`);

                            setTimeout(() => {
                                currentStep++;
                                renderStep();
                            }, 1500);
                        } else {
                            feedback.textContent = "Incorrect!";
                            feedback.className = "h-8 text-center font-bold text-red-400";
                            if (window.WanoSound) window.WanoSound.playWrong();
                            e.target.closest('.petal-btn').classList.add('opacity-50', 'pointer-events-none', 'bg-gray-500');
                        }
                    });
                });
            };

            renderStep();
        }
    };
})();
