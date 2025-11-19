(function () {
    window.WanoLevels = window.WanoLevels || {};

    window.WanoLevels.level1 = {
        id: 1,
        title: "The Conversation Dojo",
        description: "Master the art of introduction.",
        interactions: [
            {
                question: "Hello! I am Sensei Kenji. What is your name?",
                options: [
                    { text: "I am [Name].", correct: true },
                    { text: "Name is [Name].", correct: false },
                    { text: "I [Name].", correct: false }
                ]
            },
            {
                question: "Nice to meet you. How are you today?",
                options: [
                    { text: "I am fine, thank you.", correct: true },
                    { text: "I fine.", correct: false },
                    { text: "Me is good.", correct: false }
                ]
            },
            {
                question: "Where are you from?",
                options: [
                    { text: "I am from Wano.", correct: true },
                    { text: "I from Wano.", correct: false },
                    { text: "I come Wano.", correct: false }
                ]
            },
            {
                question: "How old are you?",
                options: [
                    { text: "I have 20 years.", correct: false },
                    { text: "I am 20 years old.", correct: true },
                    { text: "I am 20 years.", correct: false }
                ]
            },
            {
                question: "It was good to speak with you. Sayonara!",
                options: [
                    { text: "Goodbye, Sensei!", correct: true },
                    { text: "Good night!", correct: false },
                    { text: "Hello!", correct: false }
                ]
            }
        ],

        render(container, onComplete, onScoreUpdate) {
            let currentStep = 0;
            let score = 0;

            const renderStep = () => {
                if (currentStep >= this.interactions.length) {
                    container.innerHTML = `
                        <div class="text-center animate-fade-in">
                            <h2 class="text-3xl text-wano-gold font-shojumaru mb-4">Training Complete!</h2>
                            <p class="text-white mb-6">You have mastered the basics.</p>
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

                const interaction = this.interactions[currentStep];

                container.innerHTML = `
                    <div class="w-full max-w-md flex flex-col gap-6 animate-fade-in">
                        <!-- Sensei Bubble -->
                        <div class="flex gap-4 items-start">
                            <div class="w-12 h-12 rounded-full bg-gray-700 border-2 border-wano-gold flex items-center justify-center text-2xl">🥋</div>
                            <div class="bg-wano-paper text-wano-black p-4 rounded-r-xl rounded-bl-xl shadow-lg border border-gray-400 relative">
                                <p class="font-serif text-lg">${interaction.question}</p>
                            </div>
                        </div>

                        <!-- Student Options -->
                        <div class="flex flex-col gap-3 mt-4">
                            ${interaction.options.map((opt, idx) => `
                                <button class="option-btn w-full text-left p-4 bg-black/50 border border-wano-gold/30 text-white hover:bg-wano-red/20 hover:border-wano-gold transition-all rounded" data-idx="${idx}">
                                    ${opt.text}
                                </button>
                            `).join('')}
                        </div>
                        
                        <div id="feedback-area" class="h-8 text-center font-bold"></div>
                    </div>
                `;

                // Add Event Listeners
                container.querySelectorAll('.option-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const idx = parseInt(e.target.closest('button').dataset.idx);
                        const isCorrect = interaction.options[idx].correct;

                        const feedback = document.getElementById('feedback-area');

                        if (isCorrect) {
                            feedback.textContent = "Correct! +100 Bounty";
                            feedback.className = "h-8 text-center font-bold text-green-400";
                            score += 100;
                            onScoreUpdate(100);
                            // Play sound
                            if (window.WanoSound) window.WanoSound.playCorrect();

                            setTimeout(() => {
                                currentStep++;
                                renderStep();
                            }, 1000);
                        } else {
                            feedback.textContent = "Try Again!";
                            feedback.className = "h-8 text-center font-bold text-red-400";
                            // Play sound
                            if (window.WanoSound) window.WanoSound.playWrong();
                            e.target.closest('button').classList.add('border-red-500', 'text-red-500');
                        }
                    });
                });
            };

            renderStep();
        }
    };
})();
