(function () {
    window.WanoLevels = window.WanoLevels || {};

    window.WanoLevels.level5 = {
        id: 5,
        title: "The 'To Play' Arena",
        description: "Strike the error to correct the technique.",
        questions: [
            // Affirmative
            { sentence: "He play football.", error: "play", correction: "plays" },
            { sentence: "She plays tennis.", error: null, correction: null },
            { sentence: "John plays guitar.", error: null, correction: null },
            { sentence: "She play piano.", error: "play", correction: "plays" },
            { sentence: "It play with the ball.", error: "play", correction: "plays" },

            // Negative
            { sentence: "I doesn't play games.", error: "doesn't", correction: "don't" },
            { sentence: "He don't play cards.", error: "don't", correction: "doesn't" },
            { sentence: "We doesn't play tag.", error: "doesn't", correction: "don't" },

            // Questions
            { sentence: "Does you play chess?", error: "Does", correction: "Do" },
            { sentence: "Do she play sports?", error: "Do", correction: "Does" },
            { sentence: "Does they play music?", error: "Does", correction: "Do" }
        ],

        render(container, onComplete, onScoreUpdate) {
            let currentStep = 0;
            let score = 0;

            const renderStep = () => {
                if (currentStep >= this.questions.length) {
                    container.innerHTML = `
                        <div class="text-center animate-fade-in">
                            <h2 class="text-3xl text-wano-gold font-shojumaru mb-4">Arena Champion!</h2>
                            <p class="text-white mb-6">You have conquered Wano English.</p>
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
                const words = q.sentence.split(' ');

                container.innerHTML = `
                    <div class="w-full max-w-md flex flex-col gap-6 animate-fade-in">
                        <div class="text-center text-wano-gold font-ruslan text-xl mb-8">
                            Duel ${currentStep + 1} / ${this.questions.length}
                        </div>
                        
                        <div class="text-center mb-4">
                            <p class="text-gray-400 text-sm">Tap the incorrect word to strike it!</p>
                        </div>

                        <!-- Sentence Display -->
                        <div class="bg-wano-paper text-wano-black p-8 rounded shadow-lg border-2 border-wano-black text-center flex flex-wrap justify-center gap-2">
                            ${words.map((word, idx) => `
                                <span class="word-span text-2xl font-bold cursor-pointer hover:text-wano-red hover:scale-110 transition-transform inline-block p-1 rounded hover:bg-black/10" data-word="${word.replace(/[?.!]/g, '')}" data-idx="${idx}">
                                    ${word}
                                </span>
                            `).join('')}
                        </div>
                        
                        <!-- Correction Modal (Hidden by default) -->
                        <div id="correction-area" class="hidden flex-col items-center gap-4 mt-4 animate-fade-in">
                            <p class="text-wano-gold">Choose the correct form:</p>
                            <div class="flex gap-4">
                                <button class="correction-btn bg-wano-black border border-wano-gold text-white px-4 py-2 rounded hover:bg-wano-gold hover:text-black transition-colors" data-val="${q.correction}">
                                    ${q.correction}
                                </button>
                                 <button class="correction-btn bg-wano-black border border-wano-gold text-white px-4 py-2 rounded hover:bg-wano-gold hover:text-black transition-colors" data-val="WRONG">
                                    ${q.correction === "plays" ? "play" : "plays"} 
                                </button>
                            </div>
                        </div>

                        <div id="feedback-area" class="h-8 text-center font-bold mt-4"></div>
                    </div>
                `;

                // Smarter dummy option generation
                const getDummyOption = (correct) => {
                    if (correct === "plays") return "play";
                    if (correct === "play") return "plays";
                    if (correct === "don't") return "doesn't";
                    if (correct === "doesn't") return "don't";
                    if (correct === "Do") return "Does";
                    if (correct === "Does") return "Do";
                    return "Error";
                };

                const correctionArea = document.getElementById('correction-area');
                const dummyOpt = getDummyOption(q.correction);

                // Update dummy button
                const buttons = correctionArea.querySelectorAll('.correction-btn');
                buttons[1].textContent = dummyOpt;
                buttons[1].dataset.val = dummyOpt;

                // Event Listeners
                container.querySelectorAll('.word-span').forEach(span => {
                    span.addEventListener('click', (e) => {
                        const clickedWord = e.target.dataset.word;
                        const feedback = document.getElementById('feedback-area');

                        if (clickedWord === q.error) {
                            // Correct word identified, show correction options
                            e.target.classList.add('line-through', 'text-red-600');
                            correctionArea.classList.remove('hidden');
                            correctionArea.classList.add('flex');
                            feedback.textContent = "Good strike! Now fix it.";
                            feedback.className = "h-8 text-center font-bold text-wano-gold";
                            if (window.WanoSound) window.WanoSound.playCorrect();
                        } else {
                            // Wrong word identified
                            feedback.textContent = "That word is correct. Focus!";
                            feedback.className = "h-8 text-center font-bold text-red-400";
                            if (window.WanoSound) window.WanoSound.playWrong();
                            e.target.classList.add('animate-shake');
                            setTimeout(() => e.target.classList.remove('animate-shake'), 500);
                        }
                    });
                });

                container.querySelectorAll('.correction-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const selected = e.target.dataset.val;
                        const feedback = document.getElementById('feedback-area');

                        if (selected === q.correction) {
                            feedback.textContent = "Perfect! +100 Bounty";
                            feedback.className = "h-8 text-center font-bold text-green-400";
                            score += 100;
                            onScoreUpdate(100);
                            if (window.WanoSound) window.WanoSound.playCorrect();

                            setTimeout(() => {
                                currentStep++;
                                renderStep();
                            }, 1000);
                        } else {
                            feedback.textContent = "Wrong fix!";
                            feedback.className = "h-8 text-center font-bold text-red-400";
                            if (window.WanoSound) window.WanoSound.playWrong();
                        }
                    });
                });
            };

            renderStep();
        }
    };
})();
