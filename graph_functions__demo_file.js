//Graph Button Event Listener
    document.getElementById('get-graph').addEventListener('click', function() {
        var query = editor.getValue();
        fetch(getWebAppBackendUrl('/query_to_df') + '?query=' + encodeURIComponent(query))
            .then(response => response.json())
            .then(data => showGraphOptions(data.data))
            .catch(error => console.error('Error:', error));
    });
    
    
//Create Inputs Menus
    function showGraphOptions(data) {
        var graphContainer = document.getElementById('graph-container');
        graphContainer.innerHTML = '';

        if (data.length === 0) {
            graphContainer.innerHTML = '<p>No data available for graphing.</p>';
            return;
        }

        var graphForm = document.createElement('form');
        var fields = Object.keys(data[0]);
        
var xLabel = document.createElement('label');
xLabel.textContent = 'X-Axis:';
xLabel.setAttribute('for', 'x-axis');
var xSelect = createSelect('x-axis', fields, 'Select X-Axis');

var yLabel = document.createElement('label');
yLabel.textContent = 'Y-Axis:';
yLabel.setAttribute('for', 'y-axis');
var ySelect = createSelect('y-axis', fields, 'Select Y-Axis');

        var graphButton = document.createElement('button');
        graphButton.textContent = 'Create';
        graphButton.type = 'button';
        graphButton.classList.add('btn', 'btn--success', 'btn--wide');
        graphButton.style.setProperty('background-color', '#28a9dd', 'important');
        graphButton.style.setProperty('display', 'grid', 'important');
        graphButton.addEventListener('click', function() {
            var xField = xSelect.value;
            var yField = ySelect.value;
            generateGraph(data, xField, yField);
        });

// Append labels and selects to the form
graphForm.appendChild(xLabel);
graphForm.appendChild(xSelect);
graphForm.appendChild(yLabel);
graphForm.appendChild(ySelect);
graphForm.appendChild(graphButton);
graphContainer.appendChild(graphForm);
    }
//Populate Input Options 
    function createSelect(id, options) {
        var select = document.createElement('select');
        select.id = id;

        options.forEach(option => {
            var opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
        });

        return select;
    }
//Put Graph On Page With Chart.js
    function generateGraph(data, xField, yField) {
        var labels = data.map(row => row[xField]);
        var values = data.map(row => row[yField]);

        var ctx = document.createElement('canvas');
        var graphContainer = document.getElementById('graph-container');
        graphContainer.innerHTML = '';
        graphContainer.appendChild(ctx);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${yField} vs ${xField}`,
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'category',
                        labels: labels
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
