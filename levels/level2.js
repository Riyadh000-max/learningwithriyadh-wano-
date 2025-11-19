(function () {
    window.WanoLevels = window.WanoLevels || {};

    window.WanoLevels.level2 = {
        id: 2,
        title: "The Structure Scroll",
        description: "Restore the ancient scrolls by ordering the words correctly.",
        questions: [
            {
                scrambled: ["eats", "John", "the apple"],
                correct: ["John", "eats", "the apple"],
                hint: "Who is eating?"
            },
            {
                scrambled: ["plays", "She", "tennis"],
                correct: ["She", "plays", "tennis"],
                hint: "Start with the person."
            },
            {
                scrambled: ["milk", "drink", "Cats"],
                correct: ["Cats", "drink", "milk"],
                hint: "Animals first."
            },
            {
                scrambled: ["a book", "reads", "The student"],
                correct: ["The student", "reads", "a book"],
                hint: "Subject + Verb + Object"
            },
            {
                scrambled: ["love", "I", "sushi"],
                correct: ["I", "love", "sushi"],
                hint: "Talk about yourself."
            }
        ],

        render(container, onComplete, onScoreUpdate) {
            let currentStep = 0;
            let score = 0;

            const renderStep = () => {
                if (currentStep >= this.questions.length) {
                    container.innerHTML = `
                        <div class="text-center animate-fade-in">
                            <h2 class="text-3xl text-wano-gold font-shojumaru mb-4">Scroll Restored!</h2>
                            <p class="text-white mb-6">Your grammar is strong.</p>
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
                // Deep copy to manage state of current attempt
                let availableWords = [...q.scrambled];
                let placedWords = [null, null, null]; // S, V, O slots

                const updateUI = () => {
                    container.innerHTML = `
                        <div class="w-full max-w-md flex flex-col gap-6 animate-fade-in">
                            <div class="text-center text-wano-gold font-ruslan text-xl mb-2">
                                Scroll ${currentStep + 1} / ${this.questions.length}
                            </div>
                            
                            <!-- S-V-O Slots -->
                            <div class="flex justify-between gap-2 mb-4">
                                ${['Subject', 'Verb', 'Object'].map((label, idx) => `
                                    <div class="flex-1 flex flex-col items-center gap-2">
                                        <span class="text-xs text-gray-400 uppercase tracking-widest">${label}</span>
                                        <div class="slot-box w-full h-16 border-2 border-dashed border-wano-gold/50 bg-black/30 rounded flex items-center justify-center cursor-pointer hover:bg-wano-gold/10 transition-colors" data-slot="${idx}">
                                            ${placedWords[idx] ? `
                                                <span class="text-white font-bold animate-pop-in">${placedWords[idx]}</span>
                                            ` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>

                            <!-- Word Bank -->
                            <div class="flex flex-wrap justify-center gap-3 p-4 bg-wano-paper/10 rounded-lg border border-wano-gold/30 min-h-[100px]">
                                ${availableWords.map((word, idx) => `
                                    <button class="word-btn bg-wano-paper text-wano-black px-4 py-2 rounded shadow-md font-serif font-bold transform hover:-translate-y-1 transition-transform border-b-4 border-gray-400 active:border-b-0 active:translate-y-1" data-word="${word}" data-idx="${idx}">
                                        ${word}
                                    </button>
                                `).join('')}
                            </div>

                            <div class="text-center text-sm text-gray-500 italic min-h-[20px]">
                                ${q.hint}
                            </div>

                            <button id="check-btn" class="mt-4 bg-wano-red text-white px-6 py-3 rounded border-2 border-wano-gold font-ruslan disabled:opacity-50 disabled:cursor-not-allowed" ${placedWords.includes(null) ? 'disabled' : ''}>
                                Seal the Scroll
                            </button>
                            
                            <div id="feedback-area" class="h-8 text-center font-bold"></div>
                        </div>
                    `;

                    // Event Listeners

                    // Click word in bank -> move to first empty slot
                    container.querySelectorAll('.word-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const word = e.target.dataset.word;
                            const wordIdx = parseInt(e.target.dataset.idx);

                            // Find first empty slot
                            const emptySlotIdx = placedWords.indexOf(null);
                            if (emptySlotIdx !== -1) {
                                placedWords[emptySlotIdx] = word;
                                availableWords.splice(wordIdx, 1);
                                updateUI();
                            }
                        });
                    });

                    // Click slot -> remove word back to bank
                    container.querySelectorAll('.slot-box').forEach(box => {
                        box.addEventListener('click', (e) => {
                            const slotIdx = parseInt(e.target.closest('.slot-box').dataset.slot);
                            const word = placedWords[slotIdx];
                            if (word) {
                                placedWords[slotIdx] = null;
                                availableWords.push(word);
                                updateUI();
                            }
                        });
                    });

                    // Check Answer
                    const checkBtn = document.getElementById('check-btn');
                    if (checkBtn) {
                        checkBtn.addEventListener('click', () => {
                            const isCorrect = JSON.stringify(placedWords) === JSON.stringify(q.correct);
                            const feedback = document.getElementById('feedback-area');

                            if (isCorrect) {
                                feedback.textContent = "Correct! +100 Bounty";
                                feedback.className = "h-8 text-center font-bold text-green-400";
                                score += 100;
                                onScoreUpdate(100);
                                if (window.WanoSound) window.WanoSound.playCorrect();

                                setTimeout(() => {
                                    currentStep++;
                                    renderStep();
                                }, 1000);
                            } else {
                                feedback.textContent = "Incorrect Order!";
                                feedback.className = "h-8 text-center font-bold text-red-400";
                                if (window.WanoSound) window.WanoSound.playWrong();

                                // Reset
                                setTimeout(() => {
                                    placedWords = [null, null, null];
                                    availableWords = [...q.scrambled];
                                    updateUI();
                                }, 1000);
                            }
                        });
                    }
                };

                updateUI();
            };

            renderStep();
        }
    };
})();
