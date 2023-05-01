document.addEventListener('DOMContentLoaded',()=>{
    getContent();
    const select=document.querySelector('#show');
    select.onchange = function(){
        if(this.value=='metrics'){
            document.querySelector('#metricsCont').style.display='block';
            document.querySelector('#dataCont').style.display='none';
        }else{
            document.querySelector('#metricsCont').style.display='none';
            document.querySelector('#dataCont').style.display='block';
        }
    }
})
const order={
    'src':1,
    'destination':2,
    'numCustomers':3,
    'datev':4,
    'timev':5,
    'complete':6
}
const dataOrder={
    'phoneNumber':0,
    'source':1,
    'destination':2,
    'distance':3,
    'numCustomers':4,
    'date':5,
    'time':6,
    'createdAt':7
}
const content={
    'phoneNumber':"Phone Number",
    'src':"Source",
    'destination':"Destination",
    'numCustomers':"Number of customers",
    'datev':"Date",
    'timev':"Time",
    'complete':"Ride Booked!"
}
const url="https://ofiiv9edjc.execute-api.us-east-1.amazonaws.com/trail/metrics"
function getContent(){
    fetch(url)
    .then(response=>response.json())
    .then(response=>{
        const body=JSON.parse(response.body);
        const metrics=JSON.parse(body.metrics.body);
        const data=body.data;
        let arr=[];
        let xValues=[]
        let yValues=[]
        for(const key in metrics){
            if(key=='id')   continue;
            arr.push({'key':key,'value':metrics[key]['N']});
        }
        arr.sort(function(a,b){
            if (order[a.key]<order[b.key])  return -1;
            return 1;
        });
        arr.map(ele=>{
            xValues.push(content[ele.key]);
            yValues.push(ele.value);
        })
        addgraph(xValues,yValues);
        addData(data);
    })
}
function addData(data){
    const cont=document.createElement('table');
    cont.className="dataElementCont";
    const headersdiv=document.createElement('tr');
    headersdiv.className="dataElement";
    const headers=['phoneNumber','source','destination','distance','numCustomers','date','time'];
    headers.map(h=>{
        let temp=document.createElement('th');
        temp.className="innerElement";
        temp.innerHTML=h;
        temp.style.fontWeight='bold';
        headersdiv.append(temp);
    })
    cont.append(headersdiv);
    for(const key in data){
        let dataEle=document.createElement('tr');
        dataEle.className="dataElement";
        let arr=[]
        for(const innerKey in data[key]){
            if(innerKey=='id')  continue;
            for(const iiKey in data[key][innerKey]){
                arr.push({'key':innerKey,'value':data[key][innerKey][iiKey]});
            }
        }
        arr.sort(function(a,b){
            if(dataOrder[a.key]<dataOrder[b.key])   return -1;
            return 1;
        });
        arr.map(ele=>{
            let temp=document.createElement('td');
            temp.className="innerElement"
            temp.innerHTML=ele.value;
            dataEle.append(temp);
        })
        cont.append(dataEle);
    }
    const dataCont=document.querySelector('#dataContainer');
    dataCont.innerHTML='';
    dataCont.append(cont);
}
function addgraph(xValues,yValues){
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
}