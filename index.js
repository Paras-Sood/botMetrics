document.addEventListener('DOMContentLoaded',()=>{
    addgraph()
})
const order={
    'src':1,
    'destination':2,
    'numCustomers':3,
    'datev':4,
    'timev':5,
    'complete':6
}
const content={
    'src':"Source",
    'destination':"Destination",
    'numCustomers':"Number of customers",
    'datev':"Date",
    'timev':"Time",
    'complete':"Ride Booked!"
}
const url="https://ofiiv9edjc.execute-api.us-east-1.amazonaws.com/trail/metrics"
function addgraph(column){
    fetch(url)
    .then(response=>response.json())
    .then(response=>{
        console.log(response);
        const body=JSON.parse(response.body);
        console.log(body);
        console.log(typeof(body));
        let arr=[];
        let xValues=[]
        let yValues=[]
        for(const key in body){
            if(key=='id')   continue;
            arr.push({'key':key,'value':body[key]['N']});
        }
        arr.sort(function(a,b){
            if (order[a.key]<order[b.key])  return -1;
            return 1;
        });
        arr.map(ele=>{
            xValues.push(content[ele.key]);
            yValues.push(ele.value);
        })
        document.querySelector('#graph_div').innerHTML=""
        let canvas=document.createElement('canvas')
        canvas.id="graph"
        document.querySelector('#graph_div').append(canvas)
        type_graph="bar"
        // if(column==="brand" || column==="transmission" || column==="fuelType")    type_graph="line"
        new Chart("graph", {
            type: type_graph,
            data: {
                labels: xValues,
                datasets: [{
                    fill: false,
                    lineTension: 0.25,
                    backgroundColor: "rgba(0,0,255,1.0)",
                    borderColor: "red",
                    data: yValues
                }]
            },
            options: {
                plugins:{   
                    legend: {
                        display: false
                        },
                    title: {
                        display: true,
                        text: `Number of customers filling a question`
                    },
                }
            },
        })
    })
}