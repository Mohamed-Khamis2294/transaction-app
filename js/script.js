document.addEventListener('DOMContentLoaded', function() {
  const tableTransactions=document.querySelector('.table-transactions');
  const inputFilterName=document.querySelector('.f-name');
  const inputFilterAmount=document.querySelector('.f-amount');
  const ctx = document.getElementById('myChart');
  let newChart;
// ***********fetch-data.json***********
async function getData(){
  const data=await fetch('./data.json');
  const res=await data.json();
  return res;
}
// *********array-customers******
async function getCustomers(){
  const {customers}=await getData();
  return customers;
}
// *********array-transactions******
async function getTransactions(){
  const {transactions}=await getData();
  return transactions;
}
// ********table-Array******
async function getTableArray(){
  const transactions=await getTransactions();
  const customers=await getCustomers();
  const tableArray=[];
  transactions.forEach(t=>{
    const customer=customers.find(c=>c.id===t.customer_id);
    tableArray.push({customerName:customer.name,customerDate:t.date,customerAmount:t.amount})
  })
  // console.log(tableArray);
  return tableArray;
}
// ********display-table******
function displayTable(arr){
tableTransactions.innerHTML=''; 
tableTransactions.innerHTML=`<div class="col-4">
<div class="bg-primary text-white text-center fw-bolder p-2">
  Customer Name</div>
</div>
<div class="col-4">
<div class="bg-primary text-white text-center fw-bolder p-2">Transaction Date</div>
</div>
<div class="col-4">
<div class="bg-primary text-white text-center fw-bolder p-2">Transaction Amount</div>
</div>`; 
arr.forEach(r=>tableTransactions.insertAdjacentHTML('beforeend',`
<div class="col-4">
<div class="c-name bg-primary text-white text-start ps-3">${r.customerName}</div>
</div>
<div class="col-4">
<div class="c-date bg-primary text-white text-start ps-3">${r.customerDate}</div>
</div>
<div class="col-4">
<div class="c-amount bg-primary text-white text-start ps-3">${r.customerAmount}</div>
</div>
`))
}
// ********display-alltable******
async function displayAllTable(){
  const table=await getTableArray();
  displayTable(table);
}
displayAllTable();
// ********search-by-name/amount******
// **u should write the full name??
async function searchName(x){
  const table=await getTableArray();
  // return table.filter(r=>r.customerName.toLowerCase()===x.toLowerCase())
  return table.filter(r=>r.customerName.toLowerCase().includes(x.toLowerCase()));
}
async function searchAmount(x){
  const table=await getTableArray();
  return table.filter(r=>r.customerAmount===Number(x))
}
// ********input-search-name ******
inputFilterName.addEventListener('input',async function(){
  const table= await searchName(inputFilterName.value);
  const dates=table.map(d=>d.customerDate);
  const amounts=table.map(d=>d.customerAmount);
  displayTable(table);
  if(table.length===1||table.length===2){
    ctx.classList.replace('d-none','d-block');
    displayChart(dates,amounts);
  }else{
    ctx.classList.replace('d-block','d-none');
  }
})
// ********input-search-amount ******
inputFilterAmount.addEventListener('input',async function(){
const table= await searchAmount(inputFilterAmount.value);
const dates=table.map(d=>d.customerDate);
const amounts=table.map(d=>d.customerAmount);
displayTable(table);
if(table.length===1){
  ctx.classList.replace('d-none','d-block');
  displayChart(dates,amounts);
}else{
  ctx.classList.replace('d-block','d-none');
}
})
// ********************display-chart****************
function displayChart(dates,amounts){
  if(newChart)newChart.destroy();
   newChart= new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Transaction Chart',
        borderColor: '#0D6EFD',
        data: amounts,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        x: { beginAtZero: true },
        y: { beginAtZero: true }
      }
    }
  })
}
})

