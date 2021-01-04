export const lineOption = {
    title: {
        text: 'Solar Employment Growth by Sector, 2010-2016'
    },
    subtitle: {
        text: 'Source: thesolarfoundation.com'
    },
    yAxis: {
        title: {
            text: 'Number of Employees'
        }
    },
    xAxis: {
        accessibility: {
            rangeDescription: 'Range: 2010 to 2017'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },
    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 2010
        }
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }
}

export const parallelOptions = {
    chart: {
        type: 'spline',
        parallelCoordinates: true,
        parallelAxes: {
            lineWidth: 2
        }
    },
    title: {
        text: 'Solar Employment Growth by Sector, 2010-2016'
    },
    plotOptions: {
        series: {
            animation: false,
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            },
            states: {
                hover: {
                    halo: {
                        size: 0
                    }
                }
            },
            events: {
                mouseOver: function () {
                    this.group.toFront();
                }
            }
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
            '{series.name}: <b>{point.formattedValue}</b><br/>'
    },
    xAxis: {
        offset: 10
    },
    yAxis: [{
        type: 'datetime',
        tooltipValueFormat: '{value:%Y-%m-%d}'
    }],
    colors: ['rgba(11, 200, 200, 0.1)']
}

export const sankeyOption = {
    title: {
        text: 'Highcharts Sankey Diagram'
    },
    accessibility: {
        point: {
            valueDescriptionFormat: '{index}. {point.from} to {point.to}, {point.weight}.'
        }
    },
    series: [{
        keys: ['from', 'to', 'weight'],
        type: 'sankey',
        name: 'Sankey demo series'
    }]
}
