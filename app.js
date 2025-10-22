
// ============================================================================
// Body Composition Tracker - Browser Version
// Data stored in LocalStorage
// ============================================================================

// Metric definitions
const METRICS = [
    { name: 'weight', label: 'Weight', unit: 'kg', color: '#3b82f6', description: null },
    { name: 'fat_percentage', label: 'Fat %', unit: '%', color: '#ef4444', description: null },
    { name: 'fat_mass', label: 'Fat Mass', unit: 'kg', color: '#f87171', description: null },
    { name: 'ffm', label: 'FFM', unit: 'kg', color: '#10b981', description: 'Fat-Free Mass: Total body weight minus fat mass' },
    { name: 'muscle_mass', label: 'Muscle Mass', unit: 'kg', color: '#059669', description: null },
    { name: 'tbw_kg', label: 'TBW', unit: 'kg', color: '#06b6d4', description: 'Total Body Water in kilograms' },
    { name: 'tbw_percentage', label: 'TBW %', unit: '%', color: '#0891b2', description: 'Total Body Water percentage' },
    { name: 'bone_mass', label: 'Bone Mass', unit: 'kg', color: '#f59e0b', description: null },
    { name: 'bmr_kj', label: 'BMR', unit: 'kJ', color: '#8b5cf6', description: 'Basal Metabolic Rate in kilojoules' },
    { name: 'bmr_kcal', label: 'BMR', unit: 'kcal', color: '#7c3aed', description: 'Basal Metabolic Rate in kilocalories' },
    { name: 'metabolic_age', label: 'Metabolic Age', unit: 'years', color: '#6366f1', description: null },
    { name: 'visceral_fat_rating', label: 'Visceral Fat Rating', unit: '', color: '#ec4899', description: null },
    { name: 'bmi', label: 'BMI', unit: '', color: '#8b5cf6', description: 'Body Mass Index' }
];

// Global state
let measurements = [];
let currentChart = null;
let currentMetric = null;

// ============================================================================
// LocalStorage Functions
// ============================================================================

function saveMeasurements() {
    localStorage.setItem('bodyTrackerMeasurements', JSON.stringify(measurements));
}

function loadMeasurements() {
    const data = localStorage.getItem('bodyTrackerMeasurements');
    measurements = data ? JSON.parse(data) : [];
    return measurements;
}

function addMeasurement(measurement) {
    // Check if measurement for this date already exists
    const existingIndex = measurements.findIndex(m => m.date === measurement.date);
    if (existingIndex >= 0) {
        measurements[existingIndex] = { ...measurements[existingIndex], ...measurement };
    } else {
        measurements.push(measurement);
    }
    measurements.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveMeasurements();
}

function deleteMeasurement(date) {
    measurements = measurements.filter(m => m.date !== date);
    saveMeasurements();
}

function getMeasurement(date) {
    return measurements.find(m => m.date === date);
}

// ============================================================================
// Initialization
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    loadMeasurements();
    populateMetricSelector();
    updateRecentList();
    setupEventListeners();
    
    // Set default date to today
    document.getElementById('measurementDate').valueAsDate = new Date();
});

// ============================================================================
// Event Listeners
// ============================================================================

function setupEventListeners() {
    // Menu
    document.getElementById('menuBtn').addEventListener('click', () => {
        document.getElementById('menuOverlay').classList.add('active');
    });
    
    document.getElementById('menuClose').addEventListener('click', () => {
        document.getElementById('menuOverlay').classList.remove('active');
    });
    
    document.getElementById('menuOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'menuOverlay') {
            document.getElementById('menuOverlay').classList.remove('active');
        }
    });
    
    // Menu items
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    document.getElementById('fileInput').addEventListener('change', importData);
    document.getElementById('clearBtn').addEventListener('click', clearAllData);
    document.getElementById('aboutBtn').addEventListener('click', showAbout);
    
    // Add data button
    document.getElementById('addDataBtn').addEventListener('click', () => openModal());
    
    // Metric selector
    document.getElementById('metricSelect').addEventListener('change', (e) => {
        currentMetric = e.target.value;
        if (currentMetric) {
            updateChart();
        } else {
            showNoData();
        }
    });
    
    // Date filters
    document.getElementById('applyFilterBtn').addEventListener('click', () => {
        if (currentMetric) updateChart();
    });
    
    document.getElementById('clearFilterBtn').addEventListener('click', () => {
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        if (currentMetric) updateChart();
    });
    
    // Modal
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('measurementForm').addEventListener('submit', handleFormSubmit);
}

// ============================================================================
// UI Functions
// ============================================================================

function populateMetricSelector() {
    const select = document.getElementById('metricSelect');
    select.innerHTML = '<option value="">-- Select a metric --</option>';
    
    METRICS.forEach(metric => {
        const option = document.createElement('option');
        option.value = metric.name;
        option.textContent = `${metric.label} ${metric.unit ? `(${metric.unit})` : ''}`;
        select.appendChild(option);
    });
}

function updateRecentList() {
    const container = document.getElementById('recentList');
    
    if (measurements.length === 0) {
        container.innerHTML = '<p class="no-data">No measurements yet. Add your first one!</p>';
        return;
    }
    
    const recent = [...measurements].reverse().slice(0, 10);
    
    container.innerHTML = recent.map(m => `
        <div class="recent-item">
            <div class="recent-item-info">
                <div class="recent-item-date">${formatDate(m.date)}</div>
                <div class="recent-item-metrics">
                    ${m.weight ? `Weight: ${m.weight}kg` : ''}
                    ${m.fat_percentage ? ` • Fat: ${m.fat_percentage}%` : ''}
                    ${m.muscle_mass ? ` • Muscle: ${m.muscle_mass}kg` : ''}
                </div>
            </div>
            <div class="recent-item-actions">
                <button class="btn btn-small btn-secondary" onclick="editMeasurement('${m.date}')">Edit</button>
                <button class="btn btn-small btn-danger" onclick="confirmDelete('${m.date}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// ============================================================================
// Modal Functions
// ============================================================================

function openModal(date = null) {
    const modal = document.getElementById('measurementModal');
    const form = document.getElementById('measurementForm');
    
    form.reset();
    
    if (date) {
        document.getElementById('modalTitle').textContent = 'Edit Measurement';
        const measurement = getMeasurement(date);
        if (measurement) {
            document.getElementById('measurementDate').value = measurement.date;
            document.getElementById('weight').value = measurement.weight || '';
            document.getElementById('fatPercentage').value = measurement.fat_percentage || '';
            document.getElementById('fatMass').value = measurement.fat_mass || '';
            document.getElementById('ffm').value = measurement.ffm || '';
            document.getElementById('muscleMass').value = measurement.muscle_mass || '';
            document.getElementById('tbwKg').value = measurement.tbw_kg || '';
            document.getElementById('tbwPercentage').value = measurement.tbw_percentage || '';
            document.getElementById('boneMass').value = measurement.bone_mass || '';
            document.getElementById('bmrKj').value = measurement.bmr_kj || '';
            document.getElementById('bmrKcal').value = measurement.bmr_kcal || '';
            document.getElementById('metabolicAge').value = measurement.metabolic_age || '';
            document.getElementById('visceralFatRating').value = measurement.visceral_fat_rating || '';
            document.getElementById('bmi').value = measurement.bmi || '';
            document.getElementById('notes').value = measurement.notes || '';
        }
    } else {
        document.getElementById('modalTitle').textContent = 'Add Measurement';
        document.getElementById('measurementDate').valueAsDate = new Date();
    }
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('measurementModal').classList.remove('active');
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const measurement = {
        date: document.getElementById('measurementDate').value,
        weight: parseFloat(document.getElementById('weight').value) || null,
        fat_percentage: parseFloat(document.getElementById('fatPercentage').value) || null,
        fat_mass: parseFloat(document.getElementById('fatMass').value) || null,
        ffm: parseFloat(document.getElementById('ffm').value) || null,
        muscle_mass: parseFloat(document.getElementById('muscleMass').value) || null,
        tbw_kg: parseFloat(document.getElementById('tbwKg').value) || null,
        tbw_percentage: parseFloat(document.getElementById('tbwPercentage').value) || null,
        bone_mass: parseFloat(document.getElementById('boneMass').value) || null,
        bmr_kj: parseFloat(document.getElementById('bmrKj').value) || null,
        bmr_kcal: parseFloat(document.getElementById('bmrKcal').value) || null,
        metabolic_age: parseInt(document.getElementById('metabolicAge').value) || null,
        visceral_fat_rating: parseFloat(document.getElementById('visceralFatRating').value) || null,
        bmi: parseFloat(document.getElementById('bmi').value) || null,
        notes: document.getElementById('notes').value || null
    };
    
    addMeasurement(measurement);
    closeModal();
    updateRecentList();
    
    if (currentMetric) {
        updateChart();
    }
    
    showToast('Measurement saved successfully!', 'success');
}

// ============================================================================
// Chart Functions
// ============================================================================

function updateChart() {
    if (!currentMetric) return;
    
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    let filteredData = measurements.filter(m => m[currentMetric] !== null && m[currentMetric] !== undefined);
    
    if (startDate) {
        filteredData = filteredData.filter(m => m.date >= startDate);
    }
    if (endDate) {
        filteredData = filteredData.filter(m => m.date <= endDate);
    }
    
    if (filteredData.length === 0) {
        showNoData('No data available for this metric and date range');
        return;
    }
    
    const metric = METRICS.find(m => m.name === currentMetric);
    const chartData = {
        labels: filteredData.map(m => formatDate(m.date)),
        datasets: [{
            label: `${metric.label} ${metric.unit ? `(${metric.unit})` : ''}`,
            data: filteredData.map(m => m[currentMetric]),
            borderColor: metric.color,
            backgroundColor: hexToRgba(metric.color, 0.1),
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: metric.color,
            pointBorderColor: '#fff',
            pointBorderWidth: 2
        }]
    };
    
    const config = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    grace: '5%',
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    };
    
    const canvas = document.getElementById('metricChart');
    
    if (currentChart) {
        currentChart.destroy();
    }
    
    currentChart = new Chart(canvas, config);
    canvas.classList.add('active');
    document.getElementById('noDataMessage').style.display = 'none';
    
    updateStats(filteredData, metric);
}

function showNoData(message = '📈 Select a metric to view your progress') {
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
    document.getElementById('metricChart').classList.remove('active');
    const noDataMsg = document.getElementById('noDataMessage');
    noDataMsg.style.display = 'flex';
    noDataMsg.querySelector('p').textContent = message;
    document.getElementById('statsSection').style.display = 'none';
}

function updateStats(data, metric) {
    if (data.length === 0) {
        document.getElementById('statsSection').style.display = 'none';
        return;
    }
    
    const values = data.map(m => m[currentMetric]);
    const latest = values[values.length - 1];
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const change = values.length > 1 ? latest - values[0] : 0;
    const changePercent = values.length > 1 ? ((change / values[0]) * 100) : 0;
    
    const unitStr = metric.unit ? ` ${metric.unit}` : '';
    
    document.getElementById('latestValue').textContent = `${latest.toFixed(1)}${unitStr}`;
    document.getElementById('averageValue').textContent = `${average.toFixed(1)}${unitStr}`;
    
    const changeElement = document.getElementById('changeValue');
    const changeSign = change >= 0 ? '+' : '';
    changeElement.textContent = `${changeSign}${change.toFixed(1)}${unitStr}`;
    changeElement.style.color = change >= 0 ? '#10b981' : '#ef4444';
    
    document.getElementById('dataPoints').textContent = values.length;
    document.getElementById('statsSection').style.display = 'grid';
}

// ============================================================================
// CRUD Functions
// ============================================================================

function editMeasurement(date) {
    openModal(date);
}

function confirmDelete(date) {
    if (confirm('Are you sure you want to delete this measurement?')) {
        deleteMeasurement(date);
        updateRecentList();
        if (currentMetric) {
            updateChart();
        }
        showToast('Measurement deleted', 'success');
    }
}

// ============================================================================
// Import/Export Functions
// ============================================================================

function exportData() {
    const dataStr = JSON.stringify(measurements, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `body-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!', 'success');
    document.getElementById('menuOverlay').classList.remove('active');
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedData = JSON.parse(event.target.result);
            if (Array.isArray(importedData)) {
                if (confirm(`Import ${importedData.length} measurements? This will merge with existing data.`)) {
                    importedData.forEach(m => addMeasurement(m));
                    updateRecentList();
                    if (currentMetric) updateChart();
                    showToast('Data imported successfully!', 'success');
                }
            } else {
                showToast('Invalid file format', 'error');
            }
        } catch (error) {
            showToast('Error importing data', 'error');
        }
        document.getElementById('menuOverlay').classList.remove('active');
    };
    reader.readAsText(file);
    e.target.value = '';
}

function clearAllData() {
    if (confirm('Are you sure you want to delete ALL measurements? This cannot be undone!')) {
        if (confirm('Really delete everything? Consider exporting first!')) {
            measurements = [];
            saveMeasurements();
            updateRecentList();
            showNoData();
            showToast('All data cleared', 'success');
            document.getElementById('menuOverlay').classList.remove('active');
        }
    }
}

function showAbout() {
    alert(`Body Composition Tracker
    
Version: 1.0
    
A simple, privacy-focused app to track your body composition metrics over time.

Features:
• Track 13 different metrics
• Beautiful charts
• Export/Import data
• Works offline
• Data stays on your device

Your data is stored locally in your browser and never leaves your device.`);
    document.getElementById('menuOverlay').classList.remove('active');
}

// ============================================================================
// Utility Functions
// ============================================================================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} active`;
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}