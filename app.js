// Variável global para controlar a categoria atual
        let currentCategory = '';
        let currentExerciseIndex = 0;
        let workoutStartTime = null;
        let workoutData = {
            category: '',
            duration: 0,
            exercises: []
        };
        
        // Dados dos exercícios por categoria
        const exercisesByCategory = {
            'Peito': [
                { 
                    name: 'Supino Reto', 
                    goal: '4x8', 
                    weight: '40kg',
                    series: 4,
                    goalReps: 8
                },
                { 
                    name: 'Supino Inclinado', 
                    goal: '4x10', 
                    weight: '30kg',
                    series: 4,
                    goalReps: 10
                },
                { 
                    name: 'Crucifixo', 
                    goal: '3x12', 
                    weight: '12kg',
                    series: 3,
                    goalReps: 12
                },
                { 
                    name: 'Flexão de Braço', 
                    goal: '4x15', 
                    weight: 'Peso corporal',
                    series: 4,
                    goalReps: 15
                }
            ],
            'Perna': [
                { 
                    name: 'Agachamento', 
                    goal: '4x10', 
                    weight: '50kg',
                    series: 4,
                    goalReps: 10
                },
                { 
                    name: 'Leg Press', 
                    goal: '4x12', 
                    weight: '80kg',
                    series: 4,
                    goalReps: 12
                },
                { 
                    name: 'Cadeira Extensora', 
                    goal: '3x15', 
                    weight: '30kg',
                    series: 3,
                    goalReps: 15
                },
                { 
                    name: 'Panturrilha', 
                    goal: '4x20', 
                    weight: '50kg',
                    series: 4,
                    goalReps: 20
                }
            ],
            'Costas': [
                { 
                    name: 'Barra Fixa', 
                    goal: '4x Máx', 
                    weight: 'Peso corporal',
                    series: 4,
                    goalReps: 0
                },
                { 
                    name: 'Puxada Alta', 
                    goal: '4x10', 
                    weight: '40kg',
                    series: 4,
                    goalReps: 10
                },
                { 
                    name: 'Remada Curvada', 
                    goal: '4x8', 
                    weight: '35kg',
                    series: 4,
                    goalReps: 8
                },
                { 
                    name: 'Pull-down', 
                    goal: '3x12', 
                    weight: '30kg',
                    series: 3,
                    goalReps: 12
                }
            ]
        };

        // Inicializar dados de peso
        let weightData = JSON.parse(localStorage.getItem('weightData')) || [];
        let weightChart = null;

        // Inicializar a aplicação
        document.addEventListener('DOMContentLoaded', function() {
            // Configurar data atual como padrão no modal
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            document.getElementById('weightDate').value = formattedDate;
            
            // Inicializar gráfico de peso
            initWeightChart();
        });

        // Funções para o controle de peso
        function openWeightModal() {
            document.getElementById('weightModal').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        }

        function closeWeightModal() {
            document.getElementById('weightModal').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
        }

        function saveWeight() {
            const weightValue = parseFloat(document.getElementById('weightValue').value);
            const weightDate = document.getElementById('weightDate').value;
            
            if (!weightValue || weightValue <= 0) {
                alert('Por favor, insira um peso válido.');
                return;
            }
            
            if (!weightDate) {
                alert('Por favor, selecione uma data.');
                return;
            }
            
            // Adicionar novo registro
            weightData.push({
                date: weightDate,
                weight: weightValue
            });
            
            // Ordenar por data
            weightData.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Salvar no localStorage
            localStorage.setItem('weightData', JSON.stringify(weightData));
            
            // Atualizar gráfico
            updateWeightChart();
            
            // Fechar modal e limpar campos
            closeWeightModal();
            document.getElementById('weightValue').value = '';
            
            alert('Peso registrado com sucesso!');
        }

        function initWeightChart() {
            const ctx = document.getElementById('weightChart').getContext('2d');

            const labels = weightData.map(item => {
                const date = new Date(item.date);
                return date.toLocaleDateString('pt-BR');
            });

            const data = weightData.map(item => item.weight);

            weightChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Peso (kg)',
                        data: data,
                        borderColor: '#9b59b6',
                        backgroundColor: 'rgba(155, 89, 182, 0.2)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        pointBackgroundColor: '#9b59b6'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            suggestedMin: Math.min(...data) - 2,
                            suggestedMax: Math.max(...data) + 2,
                            title: {
                                display: true,
                                text: 'Peso (kg)'
                            }
                        },
                        x: {
                            offset: true,
                            title: {
                                display: true,
                                text: 'Data'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Peso: ${context.parsed.y} kg`;
                                }
                            }
                        }
                    }
                }
            });
        }
        
        function updateWeightChart() {
            if (!weightChart) return;
            
            const labels = weightData.map(item => {
                const date = new Date(item.date);
                return date.toLocaleDateString('pt-BR');
            });
            
            const data = weightData.map(item => item.weight);
            
            weightChart.data.labels = labels;
            weightChart.data.datasets[0].data = data;
            weightChart.update();
        }

        // Funções de navegação
        function showHome() {
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.getElementById('home-page').classList.add('active');
        }
        
        function showCategories() {
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.getElementById('categories-page').classList.add('active');
        }
        
        function showExerciseList(category) {
            currentCategory = category;
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.getElementById('exercise-list-page').classList.add('active');
            
            // Atualizar título da página
            document.getElementById('category-title').textContent = `Treino de ${category}`;
            
            // Carregar exercícios da categoria
            const exerciseListContainer = document.getElementById('exercise-list-container');
            exerciseListContainer.innerHTML = '';
            
            exercisesByCategory[category].forEach((exercise, index) => {
                const exerciseItem = document.createElement('div');
                exerciseItem.className = 'exercise-item';
                
                exerciseItem.innerHTML = `
                    <div class="exercise-image">
                        <i class="fas fa-dumbbell"></i>
                    </div>
                    <div class="exercise-details">
                        <h3>${exercise.name}</h3>
                        <div class="exercise-stats">
                            <span>${exercise.goal}</span>
                            <span>${exercise.weight}</span>
                        </div>
                    </div>
                `;
                
                exerciseListContainer.appendChild(exerciseItem);
            });
        }
        
        function showExercise(exerciseIndex) {
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.getElementById('exercise-page').classList.add('active');
            
            currentExerciseIndex = exerciseIndex;
            const exerciseData = exercisesByCategory[currentCategory][exerciseIndex];
            
            // Preencher dados do exercício
            document.getElementById('exercise-title').textContent = exerciseData.name;
            document.getElementById('exercise-name').textContent = exerciseData.name;
            document.getElementById('exercise-goal').textContent = `${exerciseData.goal} repetições`;
            document.getElementById('exercise-weight').textContent = exerciseData.weight;
            
            // Gerar tabela de séries
            const tableBody = document.getElementById('exercise-table-body');
            tableBody.innerHTML = '';
            
            for (let i = 0; i < exerciseData.series; i++) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${i+1}ª Série</td>
                    <td><input type="number" class="input-field reps-input" placeholder="${exerciseData.goalReps || '0'} (objetivo)" data-series="${i}"></td>
                    <td><input type="number" class="input-field weight-input" placeholder="${exerciseData.weight}" data-series="${i}"></td>
                `;
                tableBody.appendChild(row);
            }
            
            // Validar campos e atualizar botão
            validateInputs();
        }
        
        function validateInputs() {
            const repsInputs = document.querySelectorAll('.reps-input');
            const weightInputs = document.querySelectorAll('.weight-input');
            const nextButton = document.getElementById('next-exercise-btn');
            
            let allFilled = true;
            
            repsInputs.forEach(input => {
                if (!input.value) {
                    allFilled = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            weightInputs.forEach(input => {
                if (!input.value) {
                    allFilled = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            nextButton.disabled = !allFilled;
        }
        
        function startWorkout() {
            // Iniciar contagem do tempo de treino
            workoutStartTime = new Date();
            workoutData = {
                category: currentCategory,
                startTime: workoutStartTime,
                exercises: []
            };
            
            // Ir para o primeiro exercício
            showExercise(0);
        }
        
        function saveExerciseData() {
            const repsInputs = document.querySelectorAll('.reps-input');
            const weightInputs = document.querySelectorAll('.weight-input');
            const exerciseData = exercisesByCategory[currentCategory][currentExerciseIndex];
            
            const seriesData = [];
            let totalReps = 0;
            let totalWeight = 0;
            let validWeightCount = 0;
            
            for (let i = 0; i < exerciseData.series; i++) {
                const reps = parseInt(repsInputs[i].value) || 0;
                const weight = parseFloat(weightInputs[i].value) || 0;
                
                seriesData.push({
                    series: i + 1,
                    reps: reps,
                    weight: weight
                });
                
                totalReps += reps;
                
                if (weight > 0) {
                    totalWeight += weight;
                    validWeightCount++;
                }
            }
            
            const avgWeight = validWeightCount > 0 ? (totalWeight / validWeightCount).toFixed(1) : 0;
            
            // Salvar dados do exercício
            workoutData.exercises.push({
                name: exerciseData.name,
                series: seriesData,
                totalReps: totalReps,
                avgWeight: avgWeight
            });
        }
        
        function proximoExercicio() {
            // Salvar dados do exercício atual
            saveExerciseData();
            
            // Verificar se é o último exercício
            if (currentExerciseIndex < exercisesByCategory[currentCategory].length - 1) {
                showExercise(currentExerciseIndex + 1);
            } else {
                // Finalizar treino e mostrar resumo
                finishWorkout();
            }
        }
        
        function finishWorkout() {
            // Calcular tempo total de treino
            const endTime = new Date();
            const duration = Math.floor((endTime - workoutStartTime) / 1000);
            workoutData.duration = duration;
            
            // Formatar tempo
            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);
            const seconds = duration % 60;
            
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Calcular totais
            let totalExercises = workoutData.exercises.length;
            let totalSeries = 0;
            let totalReps = 0;
            let totalWeight = 0;
            let validWeightCount = 0;
            
            workoutData.exercises.forEach(exercise => {
                totalSeries += exercise.series.length;
                totalReps += exercise.totalReps;
                
                if (exercise.avgWeight > 0) {
                    totalWeight += parseFloat(exercise.avgWeight);
                    validWeightCount++;
                }
            });
            
            const avgWeight = validWeightCount > 0 ? (totalWeight / validWeightCount).toFixed(1) : 0;
            
            // Atualizar página de resumo
            document.getElementById('summary-category').textContent = `Treino de ${workoutData.category}`;
            document.getElementById('workout-duration').textContent = formattedTime;
            document.getElementById('total-exercises').textContent = totalExercises;
            document.getElementById('total-series').textContent = totalSeries;
            document.getElementById('total-reps').textContent = totalReps;
            document.getElementById('avg-weight').textContent = `${avgWeight}kg`;
            
            // Preencher tabela de resumo
            const summaryBody = document.getElementById('summary-table-body');
            summaryBody.innerHTML = '';
            
            workoutData.exercises.forEach(exercise => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${exercise.name}</td>
                    <td>${exercise.series.length}</td>
                    <td>${exercise.totalReps}</td>
                    <td>${exercise.avgWeight}kg</td>
                `;
                summaryBody.appendChild(row);
            });
            
            // Mostrar página de resumo
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.getElementById('summary-page').classList.add('active');
        }
        
        // Funções do temporizador
        function iniciarTemporizador() {
            document.getElementById('timerContainer').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        }
        
        function fecharTemporizador() {
            document.getElementById('timerContainer').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
            clearInterval(window.timerInterval);
            document.getElementById('timerDisplay').textContent = '02:00';
        }
        
        function iniciarContagem() {
            let timeLeft = 2 * 60; // 2 minutos em segundos
            const timerDisplay = document.getElementById('timerDisplay');
            const startBtn = document.querySelector('.btn-start');
            
            startBtn.disabled = true;
            startBtn.textContent = 'Executando...';
            
            window.timerInterval = setInterval(() => {
                const minutes = Math.floor(timeLeft / 60);
                let seconds = timeLeft % 60;
                
                seconds = seconds < 10 ? '0' + seconds : seconds;
                timerDisplay.textContent = `${minutes}:${seconds}`;
                
                if (timeLeft === 0) {
                    clearInterval(window.timerInterval);
                    startBtn.disabled = false;
                    startBtn.textContent = 'Iniciar';
                    alert("Tempo de descanso finalizado! Volte ao treino.");
                    fecharTemporizador();
                } else {
                    timeLeft--;
                }
            }, 1000);
        }
        
        // Adicionar event listeners para validação em tempo real
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('reps-input') || e.target.classList.contains('weight-input')) {
                validateInputs();
            }
        });
        
        // Adicionar validação aos campos de entrada
        document.querySelectorAll('.input-field').forEach(input => {
            input.addEventListener('change', function() {
                if (this.value < 0) this.value = 0;
                validateInputs();
            });
        });
    