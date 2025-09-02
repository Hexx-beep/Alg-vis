// SortingVisualizer class with all algorithms implemented
class SortingVisualizer {
constructor(algorithm, containerId) {
    this.algorithm = algorithm;
    this.containerId = containerId;
    this.array = [];
    this.isSorting = false;
    this.shouldStop = false;
    this.comparisons = 0;
    this.swaps = 0;
    this.startTime = 0;
    this.speed = 500;
    
    this.algorithmNames = {
        bubble: "Bubble Sort",
        selection: "Selection Sort",
        insertion: "Insertion Sort",
        merge: "Merge Sort",
        quick: "Quick Sort",
        heap: "Heap Sort"
    };
    
    this.algorithmColors = {
        bubble: '#6366f1',
        selection: '#ec4899',
        insertion: '#f59e0b',
        merge: '#10b981',
        quick: '#8b5cf6',
        heap: '#d946ef'
    };
}

initialize() {
    this.renderAlgorithmCard();
    this.generateNewArray();
}

renderAlgorithmCard() {
    const container = document.getElementById('comparison-container');
    const card = document.createElement('div');
    card.className = 'algorithm-card bg-gray-100 dark:bg-gray-700 rounded-xl p-4';
    card.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <h4 class="font-semibold" style="color: ${this.algorithmColors[this.algorithm]}">${this.algorithmNames[this.algorithm]}</h4>
            <div class="flex space-x-2">
                <button class="algorithm-start p-1 rounded hover:bg-green-500 hover:text-white transition-colors" title="Start this algorithm">
                    <i class="fas fa-play text-xs"></i>
                </button>
                <button class="algorithm-pause p-1 rounded hover:bg-yellow-500 hover:text-white transition-colors" title="Pause this algorithm">
                    <i class="fas fa-pause text-xs"></i>
                </button>
                <button class="algorithm-reset p-1 rounded hover:bg-red-500 hover:text-white transition-colors" title="Reset this algorithm">
                    <i class="fas fa-redo text-xs"></i>
                </button>
            </div>
        </div>
        <div class="sorting-visualization-container flex items-end overflow-hidden mb-3" id="visualization-${this.algorithm}">
            <!-- Bars will be rendered here -->
        </div>
        <div class="grid grid-cols-3 gap-2 text-xs">
            <div class="bg-white dark:bg-gray-600 p-2 rounded text-center">
                <div class="text-gray-500 dark:text-gray-300">Comparisons</div>
                <div class="font-bold" id="comparisons-${this.algorithm}">0</div>
            </div>
            <div class="bg-white dark:bg-gray-600 p-2 rounded text-center">
                <div class="text-gray-500 dark:text-gray-300">Swaps</div>
                <div class="font-bold" id="swaps-${this.algorithm}">0</div>
            </div>
            <div class="bg-white dark:bg-gray-600 p-2 rounded text-center">
                <div class="text-gray-500 dark:text-gray-300">Time (ms)</div>
                <div class="font-bold" id="time-${this.algorithm}">0</div>
            </div>
        </div>
    `;
    container.appendChild(card);
    
    // Add event listeners
    card.querySelector('.algorithm-start').addEventListener('click', () => this.startSorting());
    card.querySelector('.algorithm-pause').addEventListener('click', () => this.pauseSorting());
    card.querySelector('.algorithm-reset').addEventListener('click', () => this.resetSorting());
}

generateNewArray() {
    const arraySize = parseInt(document.getElementById('array-size').value);
    this.array = Array.from({length: arraySize}, () => Math.floor(Math.random() * 100) + 5);
    this.renderArray();
}

setArray(newArray) {
    this.array = [...newArray];
    this.renderArray();
}

renderArray() {
    const container = document.getElementById(`visualization-${this.algorithm}`);
    container.innerHTML = '';
    
    const maxValue = Math.max(...this.array);
    
    this.array.forEach((value, index) => {
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        barContainer.style.width = `${90 / this.array.length}%`;
        
        const bar = document.createElement('div');
        bar.className = 'sorting-bar rounded-t mx-0.5';
        bar.style.backgroundColor = this.algorithmColors[this.algorithm];
        bar.style.height = `${(value / maxValue) * 80}%`;
        bar.setAttribute('data-value', value);
        bar.setAttribute('data-index', index);
        
        const valueLabel = document.createElement('div');
        valueLabel.className = 'bar-value';
        valueLabel.textContent = value;
        
        barContainer.appendChild(bar);
        barContainer.appendChild(valueLabel);
        container.appendChild(barContainer);
    });
}

updateStats() {
    document.getElementById(`comparisons-${this.algorithm}`).textContent = this.comparisons;
    document.getElementById(`swaps-${this.algorithm}`).textContent = this.swaps;
    document.getElementById(`time-${this.algorithm}`).textContent = (performance.now() - this.startTime).toFixed(2);
}

resetStats() {
    this.comparisons = 0;
    this.swaps = 0;
    this.updateStats();
}

highlightBars(index1, index2, action) {
    const bars = document.querySelectorAll(`#visualization-${this.algorithm} .sorting-bar`);
    
    if (index1 >= 0 && index1 < bars.length) {
        if (action === 'compare') {
            bars[index1].style.backgroundColor = '#ec4899';
            bars[index1].classList.add('compare-animation');
        } else if (action === 'swap') {
            bars[index1].style.backgroundColor = '#ef4444';
            bars[index1].classList.add('swap-animation');
        } else if (action === 'pivot') {
            bars[index1].style.backgroundColor = '#d946ef';
            bars[index1].classList.add('pivot-bar');
        } else if (action === 'merge') {
            bars[index1].style.backgroundColor = '#3b82f6';
            bars[index1].classList.add('compare-animation');
        }
    }
    
    if (index2 >= 0 && index2 < bars.length) {
        if (action === 'compare') {
            bars[index2].style.backgroundColor = '#ec4899';
            bars[index2].classList.add('compare-animation');
        } else if (action === 'swap') {
            bars[index2].style.backgroundColor = '#ef4444';
            bars[index2].classList.add('swap-animation');
        } else if (action === 'merge') {
            bars[index2].style.backgroundColor = '#3b82f6';
            bars[index2].classList.add('compare-animation');
        }
    }
}

markBarAsSorted(index) {
    const bars = document.querySelectorAll(`#visualization-${this.algorithm} .sorting-bar`);
    if (index >= 0 && index < bars.length) {
        bars[index].classList.remove('compare-animation', 'swap-animation', 'pivot-bar');
        bars[index].classList.add('sorted-bar');
    }
}

async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async bubbleSort() {
    let n = this.array.length;
    let swapped;
    
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            if (this.shouldStop) return;
            
            this.highlightBars(i, i + 1, 'compare');
            this.comparisons++;
            this.updateStats();
            
            await this.sleep(this.speed);
            
            if (this.array[i] > this.array[i + 1]) {
                [this.array[i], this.array[i + 1]] = [this.array[i + 1], this.array[i]];
                this.swaps++;
                this.updateStats();
                this.renderArray();
                await this.sleep(this.speed);
                swapped = true;
            }
            
            this.resetBarColors();
        }
        
        this.markBarAsSorted(n - 1);
        n--;
    } while (swapped);
    
    for (let i = 0; i < this.array.length; i++) {
        this.markBarAsSorted(i);
    }
    
    this.sortingComplete();
}

async selectionSort() {
    let n = this.array.length;
    
    for (let i = 0; i < n - 1; i++) {
        if (this.shouldStop) return;
        
        let minIndex = i;
        this.highlightBars(i, -1, 'pivot');
        await this.sleep(this.speed);
        
        for (let j = i + 1; j < n; j++) {
            if (this.shouldStop) return;
            
            this.highlightBars(j, minIndex, 'compare');
            this.comparisons++;
            this.updateStats();
            
            await this.sleep(this.speed);
            
            if (this.array[j] < this.array[minIndex]) {
                minIndex = j;
                this.highlightBars(minIndex, -1, 'pivot');
                await this.sleep(this.speed);
            }
            
            this.resetBarColors();
        }
        
        if (minIndex !== i) {
            [this.array[i], this.array[minIndex]] = [this.array[minIndex], this.array[i]];
            this.swaps++;
            this.updateStats();
            this.renderArray();
            await this.sleep(this.speed);
        }
        
        this.markBarAsSorted(i);
    }
    
    this.markBarAsSorted(n - 1);
    this.sortingComplete();
}

async insertionSort() {
    let n = this.array.length;
    
    for (let i = 1; i < n; i++) {
        if (this.shouldStop) return;
        
        let key = this.array[i];
        let j = i - 1;
        
        this.highlightBars(i, -1, 'pivot');
        await this.sleep(this.speed);
        
        while (j >= 0 && this.array[j] > key) {
            if (this.shouldStop) return;
            
            this.highlightBars(j, j + 1, 'compare');
            this.comparisons++;
            this.updateStats();
            
            await this.sleep(this.speed);
            
            this.array[j + 1] = this.array[j];
            this.swaps++;
            this.updateStats();
            this.renderArray();
            
            j = j - 1;
            await this.sleep(this.speed);
        }
        
        this.array[j + 1] = key;
        this.renderArray();
        this.resetBarColors();
        this.markBarAsSorted(i);
    }
    
    for (let i = 0; i < this.array.length; i++) {
        this.markBarAsSorted(i);
    }
    
    this.sortingComplete();
}

async mergeSort() {
    await this.mergeSortHelper(0, this.array.length - 1);
    
    for (let i = 0; i < this.array.length; i++) {
        this.markBarAsSorted(i);
    }
    
    this.sortingComplete();
}

async mergeSortHelper(l, r) {
    if (l < r) {
        if (this.shouldStop) return;
        
        const m = Math.floor((l + r) / 2);
        
        await this.mergeSortHelper(l, m);
        if (this.shouldStop) return;
        
        await this.mergeSortHelper(m + 1, r);
        if (this.shouldStop) return;
        
        await this.merge(l, m, r);
    }
}

async merge(l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;
    
    let L = new Array(n1);
    let R = new Array(n2);
    
    for (let i = 0; i < n1; i++) {
        L[i] = this.array[l + i];
    }
    for (let j = 0; j < n2; j++) {
        R[j] = this.array[m + 1 + j];
    }
    
    let i = 0, j = 0, k = l;
    
    while (i < n1 && j < n2) {
        if (this.shouldStop) return;
        
        this.highlightBars(l + i, m + 1 + j, 'merge');
        this.comparisons++;
        this.updateStats();
        
        await this.sleep(this.speed);
        
        if (L[i] <= R[j]) {
            this.array[k] = L[i];
            i++;
        } else {
            this.array[k] = R[j];
            j++;
        }
        
        this.swaps++;
        this.updateStats();
        this.renderArray();
        
        k++;
        await this.sleep(this.speed);
    }
    
    while (i < n1) {
        if (this.shouldStop) return;
        
        this.array[k] = L[i];
        this.swaps++;
        this.updateStats();
        this.renderArray();
        
        i++;
        k++;
        await this.sleep(this.speed);
    }
    
    while (j < n2) {
        if (this.shouldStop) return;
        
        this.array[k] = R[j];
        this.swaps++;
        this.updateStats();
        this.renderArray();
        
        j++;
        k++;
        await this.sleep(this.speed);
    }
    
    this.resetBarColors();
}

async quickSort() {
    await this.quickSortHelper(0, this.array.length - 1);
    
    for (let i = 0; i < this.array.length; i++) {
        this.markBarAsSorted(i);
    }
    
    this.sortingComplete();
}

async quickSortHelper(low, high) {
    if (low < high) {
        if (this.shouldStop) return;
        
        let pi = await this.partition(low, high);
        
        await this.quickSortHelper(low, pi - 1);
        if (this.shouldStop) return;
        
        await this.quickSortHelper(pi + 1, high);
    }
}

async partition(low, high) {
    let pivot = this.array[high];
    let i = low - 1;
    
    this.highlightBars(high, -1, 'pivot');
    await this.sleep(this.speed);
    
    for (let j = low; j < high; j++) {
        if (this.shouldStop) return;
        
        this.highlightBars(j, high, 'compare');
        this.comparisons++;
        this.updateStats();
        
        await this.sleep(this.speed);
        
        if (this.array[j] < pivot) {
            i++;
            [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
            this.swaps++;
            this.updateStats();
            this.renderArray();
            await this.sleep(this.speed);
        }
        
        this.resetBarColors();
        this.highlightBars(high, -1, 'pivot');
    }
    
    [this.array[i + 1], this.array[high]] = [this.array[high], this.array[i + 1]];
    this.swaps++;
    this.updateStats();
    this.renderArray();
    await this.sleep(this.speed);
    
    this.resetBarColors();
    return i + 1;
}

async heapSort() {
    let n = this.array.length;
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (this.shouldStop) return;
        await this.heapify(n, i);
    }
    
    for (let i = n - 1; i > 0; i--) {
        if (this.shouldStop) return;
        
        [this.array[0], this.array[i]] = [this.array[i], this.array[0]];
        this.swaps++;
        this.updateStats();
        this.renderArray();
        
        this.markBarAsSorted(i);
        await this.sleep(this.speed);
        
        await this.heapify(i, 0);
    }
    
    this.markBarAsSorted(0);
    this.sortingComplete();
}

async heapify(n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    
    if (left < n) {
        this.highlightBars(left, largest, 'compare');
        this.comparisons++;
        this.updateStats();
        
        await this.sleep(this.speed);
        
        if (this.array[left] > this.array[largest]) {
            largest = left;
        }
    }
    
    if (right < n) {
        this.highlightBars(right, largest, 'compare');
        this.comparisons++;
        this.updateStats();
        
        await this.sleep(this.speed);
        
        if (this.array[right] > this.array[largest]) {
            largest = right;
        }
    }
    
    if (largest !== i) {
        [this.array[i], this.array[largest]] = [this.array[largest], this.array[i]];
        this.swaps++;
        this.updateStats();
        this.renderArray();
        
        await this.sleep(this.speed);
        
        await this.heapify(n, largest);
    }
    
    this.resetBarColors();
}

resetBarColors() {
    const bars = document.querySelectorAll(`#visualization-${this.algorithm} .sorting-bar`);
    bars.forEach(bar => {
        bar.style.backgroundColor = this.algorithmColors[this.algorithm];
        bar.classList.remove('compare-animation', 'swap-animation', 'sorted-bar', 'pivot-bar');
    });
}

startSorting() {
    if (this.isSorting) return;
    
    this.isSorting = true;
    this.shouldStop = false;
    this.comparisons = 0;
    this.swaps = 0;
    this.startTime = performance.now();
    this.updateStats();
    
    switch(this.algorithm) {
        case 'bubble':
            this.bubbleSort();
            break;
        case 'selection':
            this.selectionSort();
            break;
        case 'insertion':
            this.insertionSort();
            break;
        case 'merge':
            this.mergeSort();
            break;
        case 'quick':
            this.quickSort();
            break;
        case 'heap':
            this.heapSort();
            break;
    }
}

pauseSorting() {
    this.shouldStop = true;
    this.isSorting = false;
}

resetSorting() {
    this.shouldStop = true;
    this.isSorting = false;
    this.generateNewArray();
    this.resetStats();
    this.resetBarColors();
}

sortingComplete() {
    this.isSorting = false;
    this.shouldStop = false;
}
}

// Main application
class ComparisonApp {
constructor() {
    this.visualizers = [];
    this.currentArray = [];
    this.init();
}

init() {
    this.initEventListeners();
    this.initCharts();
    this.createVisualizers(['bubble', 'selection']);
}

initEventListeners() {
    // Array size slider
    document.getElementById('array-size').addEventListener('input', () => {
        document.getElementById('current-array-size').textContent = document.getElementById('array-size').value;
        this.generateNewArrays();
    });
    
    // New array button
    document.getElementById('new-array').addEventListener('click', () => {
        this.generateNewArrays();
    });
    
    // Same array button
    document.getElementById('similar-arrays').addEventListener('click', () => {
        this.generateSimilarArrays();
    });
    
    // Start all button
    document.getElementById('start-sorting').addEventListener('click', () => {
        this.startAll();
    });
    
    // Pause all button
    document.getElementById('pause-sorting').addEventListener('click', () => {
        this.pauseAll();
    });
    
    // Reset all button
    document.getElementById('reset-sorting').addEventListener('click', () => {
        this.resetAll();
    });
    
    // Algorithm checkboxes
    document.querySelectorAll('input[name="algorithm"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            this.updateSelectedAlgorithms();
        });
    });
    
    // Animation speed slider
    document.getElementById('animation-speed').addEventListener('input', () => {
        const speed = parseInt(document.getElementById('animation-speed').value);
        this.setSpeedForAll(1100 - (speed * 100));
    });
    
    // Back button
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'sort.html';
    });
    
    // Custom array loading
    document.getElementById('load-custom-array').addEventListener('click', () => {
        this.loadCustomArray();
    });
    
    // Allow pressing Enter in the custom array input
    document.getElementById('custom-array').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            this.loadCustomArray();
        }
    });
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        this.toggleTheme();
    });
}

loadCustomArray() {
    const customArrayInput = document.getElementById('custom-array');
    const errorElement = document.getElementById('custom-array-error');
    const input = customArrayInput.value.trim();
    
    if (!input) {
        errorElement.textContent = 'Please enter some numbers';
        errorElement.classList.remove('hidden');
        return;
    }
    
    try {
        // Parse the custom array input
        const newArray = input.split(',')
            .map(num => parseInt(num.trim()))
            .filter(num => !isNaN(num) && num > 0);
        
        if (newArray.length < 3) {
            errorElement.textContent = 'Please enter at least 3 valid numbers';
            errorElement.classList.remove('hidden');
            return;
        }
        
        if (newArray.length > 30) {
            errorElement.textContent = 'Maximum 30 numbers allowed';
            errorElement.classList.remove('hidden');
            return;
        }
        
        // Update array size slider
        document.getElementById('array-size').value = newArray.length;
        document.getElementById('current-array-size').textContent = newArray.length;
        
        // Set the array for all visualizers
        this.currentArray = [...newArray];
        this.visualizers.forEach(visualizer => {
            visualizer.setArray(newArray);
        });
        
        // Clear error and input
        errorElement.classList.add('hidden');
        customArrayInput.value = '';
        
    } catch (error) {
        errorElement.textContent = 'Invalid format. Use comma-separated numbers (e.g., 5,3,8,1)';
        errorElement.classList.remove('hidden');
    }
}

initCharts() {
    // Time complexity chart
    const complexityCtx = document.getElementById('complexity-chart').getContext('2d');
    this.complexityChart = new Chart(complexityCtx, {
        type: 'line',
        data: {
            labels: ['5', '10', '50', '100', '500', '1000'],
            datasets: [
                {
                    label: 'Bubble Sort (O(n²))',
                    data: [25, 100, 2500, 10000, 250000, 1000000],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.3,
                    borderWidth: 2
                },
                {
                    label: 'Selection Sort (O(n²))',
                    data: [25, 100, 2500, 10000, 250000, 1000000],
                    borderColor: '#ec4899',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    tension: 0.3,
                    borderWidth: 2
                },
                {
                    label: 'Insertion Sort (O(n²))',
                    data: [25, 100, 2500, 10000, 250000, 1000000],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.3,
                    borderWidth: 2
                },
                {
                    label: 'Merge Sort (O(n log n))',
                    data: [8, 23, 195, 460, 4483, 9966],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.3,
                    borderWidth: 2
                },
                {
                    label: 'Quick Sort (O(n log n))',
                    data: [7, 20, 141, 320, 3229, 7219],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.3,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw.toLocaleString() + ' operations';
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Operations (log scale)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Array Size'
                    }
                }
            }
        }
    });
}

createVisualizers(algorithms) {
    // Clear existing visualizers
    this.visualizers = [];
    document.getElementById('comparison-container').innerHTML = '';
    
    // Create new visualizers
    algorithms.forEach(algorithm => {
        const visualizer = new SortingVisualizer(algorithm, `visualization-${algorithm}`);
        visualizer.initialize();
        
        // If we already have a current array, use it
        if (this.currentArray.length > 0) {
            visualizer.setArray(this.currentArray);
        }
        
        this.visualizers.push(visualizer);
    });
}

generateNewArrays() {
    // Generate a new array for each visualizer independently
    this.visualizers.forEach(visualizer => {
        visualizer.generateNewArray();
    });
    this.currentArray = [];
}

generateSimilarArrays() {
    // Generate a single array and use it for all visualizers
    const arraySize = parseInt(document.getElementById('array-size').value);
    const newArray = Array.from({length: arraySize}, () => Math.floor(Math.random() * 100) + 5);
    this.currentArray = [...newArray];
    
    this.visualizers.forEach(visualizer => {
        visualizer.setArray(newArray);
    });
}

startAll() {
    this.visualizers.forEach(visualizer => {
        visualizer.startSorting();
    });
}

pauseAll() {
    this.visualizers.forEach(visualizer => {
        visualizer.pauseSorting();
    });
}

resetAll() {
    this.visualizers.forEach(visualizer => {
        visualizer.resetSorting();
    });
}

setSpeedForAll(speed) {
    this.visualizers.forEach(visualizer => {
        visualizer.speed = speed;
    });
}

updateSelectedAlgorithms() {
    const selectedAlgorithms = [];
    document.querySelectorAll('input[name="algorithm"]:checked').forEach(checkbox => {
        selectedAlgorithms.push(checkbox.value);
    });
    
    this.createVisualizers(selectedAlgorithms);
}

toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    const icon = document.getElementById('theme-toggle').querySelector('i');
    
    if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        icon.classList.remove('text-yellow-300');
        icon.classList.add('text-yellow-500');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        icon.classList.remove('text-yellow-500');
        icon.classList.add('text-yellow-300');
    }
}
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
const app = new ComparisonApp();
});