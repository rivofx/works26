/* Northstar finance workspace — lightweight local-first application. */
(() => {
  'use strict';

  const STORAGE_KEY = 'northstar-finance-v1';
  const CATEGORY_COLORS = ['#d08b80','#90b772','#8a9fd0','#c3a16c','#bc85a4','#6daea3','#d4bd70','#81949b','#a38bd0','#de9670','#7fb9d0','#b8a18a'];
  const DEFAULT_CATEGORIES = ['Rent','Food','Groceries','Transportation','Car','Gas','Utilities','Internet','Phone','Subscriptions','Entertainment','Shopping','Health','Insurance','Debt Payment','Other'];
  const NAV = [
    ['dashboard','Overview','grid'],['expenses','Expenses','arrowDown'],['income','Income','arrowUp'],['debts','Debts','wallet'],['bills','Bills & subscriptions','calendar'],['transactions','Transactions','repeat'],['budget','Monthly budget','chart'],['settings','Settings','settings']
  ];
  const view = document.getElementById('view');
  const modalRoot = document.getElementById('modalRoot');
  const toastStack = document.getElementById('toastStack');
  const monthInput = document.getElementById('globalMonth');
  let currentPage = 'dashboard';
  let confirmResolver = null;
  let searchQuery = '';
  let listFilters = { type:'all', category:'all', amount:'all', sort:'date-desc' };
  let currentTransactionRows = [];

  function defaultStore() {
    return {
      version:1, incomes:[], expenses:[], bills:[], debts:[], payments:[],
      categories:DEFAULT_CATEGORIES.map((name,i)=>({id:uid(),name,color:CATEGORY_COLORS[i%CATEGORY_COLORS.length]})),
      settings:{currency:'EUR',theme:'dark',monthStart:1}
    };
  }
  function uid(){ return (crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`); }
  function loadStore(){
    try {
      const raw=localStorage.getItem(STORAGE_KEY);
      if(!raw) return defaultStore();
      const parsed=JSON.parse(raw);
      const base=defaultStore();
      const merged={...base,...parsed,settings:{...base.settings,...(parsed.settings||{})}};
      for(const key of ['incomes','expenses','bills','debts','payments','categories']) if(!Array.isArray(merged[key])) merged[key]=base[key];
      if(merged.categories.length===0) merged.categories=base.categories;
      return merged;
    } catch { return defaultStore(); }
  }
  let data=loadStore();
  function persist(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(data)); }
  function escapeHtml(value){ return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function icon(name){
    const paths={
      grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
      arrowDown:'<path d="M12 4v13m0 0 5-5m-5 5-5-5"/><path d="M5 20h14"/>',
      arrowUp:'<path d="M12 20V7m0 0 5 5m-5-5-5 5"/><path d="M5 4h14"/>',
      wallet:'<rect x="3" y="5" width="18" height="15" rx="2.5"/><path d="M3 9h18M16 14h2"/><path d="M6 5V3h12v2"/>',
      calendar:'<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M7 3v4m10-4v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>',
      repeat:'<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
      chart:'<path d="M4 19V5m0 14h17"/><rect x="7" y="11" width="3" height="5" rx=".6"/><rect x="13" y="7" width="3" height="9" rx=".6"/><rect x="19" y="9" width="2" height="7" rx=".6"/>',
      settings:'<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1a1.8 1.8 0 1 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3 .9v.2a1.8 1.8 0 1 1-3.6 0v-.2a1.8 1.8 0 0 0-3-.9l-.1.1a1.8 1.8 0 1 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-.9-3h-.2a1.8 1.8 0 1 1 0-3.6h.2a1.8 1.8 0 0 0 .9-3l-.1-.1a1.8 1.8 0 1 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3-.9v-.2a1.8 1.8 0 1 1 3.6 0v.2a1.8 1.8 0 0 0 3 .9l.1-.1a1.8 1.8 0 1 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 .9 3h.2a1.8 1.8 0 1 1 0 3.6h-.2a1.8 1.8 0 0 0-.9 3Z"/>',
      search:'<circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 4.5 4.5"/>',
      plus:'<path d="M12 5v14M5 12h14"/>',
      edit:'<path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15l-.8 5Z"/>',
      trash:'<path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
      dots:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
      export:'<path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M5 17v3h14v-3"/>',
      check:'<path d="m5 12 4 4L19 6"/>',
      close:'<path d="m6 6 12 12M18 6 6 18"/>',
      arrowRight:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
      trend:'<path d="m4 16 5-5 4 3 7-8"/><path d="M14 6h6v6"/>',
      receipt:'<path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z"/><path d="M8 8h8M8 12h8M8 16h3"/>',
      coin:'<circle cx="12" cy="12" r="9"/><path d="M15 8.5c-.5-.7-1.5-1-3-1-1.7 0-2.8.8-2.8 2 0 3.1 5.6 1.2 5.6 4.2 0 1.3-1.1 2.1-2.9 2.1-1.5 0-2.7-.4-3.4-1.3M12 5.8v12.4"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]||paths.grid}</svg>`;
  }
  function todayISO(){const d=new Date();return dateISO(d);}
  function dateISO(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  function parseISO(s){const [y,m,d]=String(s||todayISO()).slice(0,10).split('-').map(Number);return new Date(y,(m||1)-1,d||1,12);}
  function monthKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;}
  function shiftMonth(date,offset){return new Date(date.getFullYear(),date.getMonth()+offset,1,12);}
  function currentPeriodKey(){const now=new Date(); if(now.getDate()<Number(data.settings.monthStart||1)) return monthKey(shiftMonth(now,-1)); return monthKey(now);}
  let selectedMonth=currentPeriodKey();
  monthInput.value=selectedMonth;
  function windowFor(key=selectedMonth){
    const [y,m]=key.split('-').map(Number),day=Math.max(1,Math.min(28,Number(data.settings.monthStart)||1));
    const start=new Date(y,m-1,day,0,0,0,0),end=new Date(y,m,day,0,0,0,0);
    return {start,end};
  }
  function inWindow(iso,win=windowFor()){const d=parseISO(iso);return d>=win.start&&d<win.end;}
  function dateRangeLabel(win=windowFor()){
    const last=new Date(win.end.getTime()-86400000);
    const a=win.start.toLocaleDateString('en-GB',{day:'numeric',month:'short'}),b=last.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
    if(win.start.getMonth()===last.getMonth()&&win.start.getFullYear()===last.getFullYear()) return `${win.start.toLocaleDateString('en-GB',{month:'long'})} ${win.start.getFullYear()}`;
    return `${a} – ${b}`;
  }
  function shortDate(iso){return parseISO(iso).toLocaleDateString('en-GB',{day:'2-digit',month:'short'});}
  function fullDate(iso){return parseISO(iso).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});}
  function money(amount,compact=false){
    const n=Number(amount)||0;
    try{return new Intl.NumberFormat('en-IE',{style:'currency',currency:data.settings.currency||'EUR',maximumFractionDigits:compact&&Math.abs(n)>=10000?0:2,minimumFractionDigits:0}).format(n);}
    catch{return `${(data.settings.currency==='USD'?'$':data.settings.currency==='GBP'?'£':'€')}${n.toFixed(2)}`;}
  }
  function categoryMeta(name){return data.categories.find(c=>c.name===name)||{name:name||'Other',color:'#81949b'};}
  function amount(v){return Math.round((Number(v)||0)*100)/100;}
  function daysInMonth(y,m){return new Date(y,m+1,0).getDate();}
  function occurrenceDates(entry,start,end){
    const base=parseISO(entry.date||entry.dueDate||todayISO());const freq=entry.frequency||'once';const out=[];
    if(freq==='once'){if(base>=start&&base<end)out.push(dateISO(base));return out;}
    if(freq==='weekly'){
      const diff=Math.max(0,Math.floor((start-base)/86400000));let skip=Math.floor(diff/7);let d=new Date(base);d.setDate(d.getDate()+skip*7);
      while(d<start)d.setDate(d.getDate()+7);
      let count=0;while(d<end&&count<100){out.push(dateISO(d));d.setDate(d.getDate()+7);count++;}
      return out;
    }
    if(freq==='monthly'){
      const months=Math.max(0,(start.getFullYear()-base.getFullYear())*12+start.getMonth()-base.getMonth());
      for(let i=months;i<months+15;i++) {const y=base.getFullYear()+Math.floor((base.getMonth()+i)/12),m=(base.getMonth()+i)%12,d=new Date(y,m,Math.min(base.getDate(),daysInMonth(y,m)),12);if(d>=start&&d<end)out.push(dateISO(d));if(d>=end)break;}
      return out;
    }
    if(freq==='yearly'){
      const year=Math.max(base.getFullYear(),start.getFullYear());
      for(let y=year;y<=end.getFullYear();y++){const d=new Date(y,base.getMonth(),Math.min(base.getDate(),daysInMonth(y,base.getMonth())),12);if(d>=start&&d<end)out.push(dateISO(d));}
      return out;
    }
    return out;
  }
  function expandEntries(entries,kind,win=windowFor()){
    return entries.flatMap(entry=>occurrenceDates(entry,win.start,win.end).map(date=>({...entry,kind,sourceId:entry.id,occurrenceDate:date,date})));
  }
  function paymentTotal(debtId){return data.payments.filter(p=>p.debtId===debtId).reduce((s,p)=>s+Number(p.amount||0),0);}
  function debtRemaining(debt){return Math.max(0,amount(Number(debt.originalAmount||0)-paymentTotal(debt.id)));}
  function expectedBillOccurrences(bill,win=windowFor()){return occurrenceDates({date:bill.dueDate,frequency:bill.frequency},win.start,win.end).length;}
  function paidBillTotal(billId,win=windowFor()){
    return data.expenses.filter(e=>e.billId===billId&&inWindow(e.date,win)).reduce((s,e)=>s+Number(e.amount||0),0);
  }
  function billReserve(bill,win=windowFor()){
    if(!bill.enabled)return 0;
    const expected=expectedBillOccurrences(bill,win);
    if(!expected)return 0;
    const paidAmount=paidBillTotal(bill.id,win);
    return Math.max(0,amount(expected*Number(bill.amount||0)-paidAmount));
  }
  function debtReserve(debt,win=windowFor()){
    if(debtRemaining(debt)<=0||!Number(debt.minimumPayment)||!debt.dueDate)return 0;
    const due=occurrenceDates({date:debt.dueDate,frequency:'monthly'},win.start,win.end).length;
    if(!due)return 0;
    const paid=data.payments.filter(p=>p.debtId===debt.id&&inWindow(p.date,win)).reduce((n,p)=>n+Number(p.amount||0),0);
    return Math.max(0,amount(due*Number(debt.minimumPayment)-paid));
  }
  function summarize(win=windowFor()){
    const incomes=expandEntries(data.incomes,'income',win);
    const expenses=expandEntries(data.expenses,'expense',win);
    const payments=data.payments.filter(p=>inWindow(p.date,win)).map(p=>({...p,kind:'payment',sourceId:p.id,occurrenceDate:p.date,date:p.date}));
    const incomeTotal=amount(incomes.reduce((s,x)=>s+Number(x.amount||0),0));
    const expenseTotal=amount(expenses.reduce((s,x)=>s+Number(x.amount||0),0));
    const debtPaid=amount(payments.reduce((s,x)=>s+Number(x.amount||0),0));
    const bills=data.bills.filter(b=>b.enabled).reduce((s,b)=>s+billReserve(b,win),0);
    const debtDue=amount(data.debts.reduce((s,d)=>s+debtReserve(d,win),0));
    const available=amount(incomeTotal-expenseTotal-debtPaid-debtDue-bills);
    const fixedCategories=['Rent','Utilities','Internet','Phone','Subscriptions','Insurance'];
    let fixed=0,variable=0;
    for(const e of expenses){if(e.frequency&&e.frequency!=='once'||fixedCategories.includes(e.category)||e.billId)fixed+=Number(e.amount||0);else variable+=Number(e.amount||0);}
    for(const b of data.bills.filter(x=>x.enabled)) fixed+=billReserve(b,win);
    const outflow=amount(expenseTotal+debtPaid+debtDue+bills);
    return {incomes,expenses,payments,incomeTotal,expenseTotal,debtPaid,debtDue,bills:amount(bills),available,fixed:amount(fixed),variable:amount(variable),outflow,totalDebt:amount(data.debts.reduce((s,d)=>s+debtRemaining(d),0))};
  }
  function allTransactions(win=windowFor()){
    const summary=summarize(win);
    return [
      ...summary.incomes.map(x=>({...x,transactionType:'income',description:x.name,category:x.category||'Income'})),
      ...summary.expenses.map(x=>({...x,transactionType:'expense',description:x.name,category:x.category||'Other'})),
      ...summary.payments.map(x=>({...x,transactionType:'debt',description:data.debts.find(d=>d.id===x.debtId)?.name||'Debt payment',category:'Debt Payment'}))
    ].sort((a,b)=>b.date.localeCompare(a.date));
  }
  function navMarkup(mobile=false){return NAV.map(([id,label,ic])=>`<button type="button" class="nav-item ${currentPage===id?'active':''}" data-nav="${id}" aria-current="${currentPage===id?'page':'false'}">${icon(ic)}<span>${mobile&&label==='Bills & subscriptions'?'Bills':mobile&&label==='Monthly budget'?'Budget':mobile&&label==='Transactions'?'History':label}</span></button>`).join('');}
  function updateNav(){document.getElementById('sideNav').innerHTML=navMarkup();document.getElementById('bottomNav').innerHTML=NAV.filter(x=>['dashboard','expenses','income','debts','bills'].includes(x[0])).map(([id,label,ic])=>`<button type="button" class="nav-item ${currentPage===id?'active':''}" data-nav="${id}">${icon(ic)}<span>${id==='bills'?'Bills':label}</span></button>`).join('')+`<button type="button" class="nav-item ${['transactions','budget','settings'].includes(currentPage)?'active':''}" data-action="mobile-more">${icon('dots')}<span>More</span></button>`;}
  function pageHeading(title,subtitle,actions=''){return `<div class="page-heading"><div><div class="eyebrow">${escapeHtml(title==='Dashboard'?'YOUR FINANCES':title==='Settings'?'PREFERENCES':'YOUR FINANCES')}</div><h1>${escapeHtml(title)}</h1><p>${subtitle}</p></div><div class="heading-actions">${actions}</div></div>`;}
  function emptyState(title,copy,action='expense'){return `<div class="empty-state ${data.incomes.length+data.expenses.length+data.bills.length+data.debts.length===0?'empty-large':''}"><span class="empty-icon">${icon('receipt')}</span><strong>${escapeHtml(title)}</strong><p>${escapeHtml(copy)}</p><button class="primary-button" type="button" data-add="${action}"><span>+</span> Add ${escapeHtml(action==='expense'?'an expense':action==='income'?'income':action==='debt'?'a debt':action==='bill'?'a bill':'transaction')}</button></div>`;}
  function render(){
    document.body.classList.toggle('light-theme',data.settings.theme==='light');
    monthInput.value=selectedMonth;
    document.getElementById('pageCrumb').textContent=NAV.find(x=>x[0]===currentPage)?.[1]||'Dashboard';
    updateNav();
    const renderer={dashboard:renderDashboard,expenses:renderExpenses,income:renderIncome,debts:renderDebts,bills:renderBills,transactions:renderTransactions,budget:renderBudget,settings:renderSettings}[currentPage]||renderDashboard;
    view.innerHTML=renderer();
  }
  function occurrenceDateForBill(bill,from=new Date()){
    const start=new Date(from.getFullYear(),from.getMonth(),from.getDate(),12),end=new Date(start);end.setDate(end.getDate()+45);
    return occurrenceDates({date:bill.dueDate,frequency:bill.frequency},start,end)[0]||null;
  }
  function upcomingItems(){
    const now=parseISO(todayISO()),end=new Date(now);end.setDate(end.getDate()+35);const rows=[];
    for(const b of data.bills.filter(x=>x.enabled)){
      let d=occurrenceDateForBill(b,now);if(!d)continue;
      // If this scheduled occurrence has been recorded as paid, show the next one instead.
      if(data.expenses.some(e=>e.billId===b.id&&e.date===d)){const nextStart=parseISO(d);nextStart.setDate(nextStart.getDate()+1);d=occurrenceDateForBill(b,nextStart);}
      if(d&&parseISO(d)>=now&&parseISO(d)<end)rows.push({date:d,name:b.name,amount:Number(b.amount||0),detail:`Bill · ${b.frequency}`,type:'bill'});
    }
    for(const debt of data.debts){if(debtRemaining(debt)<=0||!debt.dueDate||!Number(debt.minimumPayment))continue;
      const day=parseISO(debt.dueDate).getDate();let due=new Date(now.getFullYear(),now.getMonth(),Math.min(day,daysInMonth(now.getFullYear(),now.getMonth())),12);if(due<now)due=new Date(now.getFullYear(),now.getMonth()+1,Math.min(day,daysInMonth(now.getFullYear(),now.getMonth()+1)),12);
      const monthStart=new Date(due.getFullYear(),due.getMonth(),1,12),paidBeforeDue=data.payments.filter(p=>p.debtId===debt.id&&parseISO(p.date)>=monthStart&&parseISO(p.date)<=due).reduce((n,p)=>n+Number(p.amount||0),0),stillDue=Math.max(0,Number(debt.minimumPayment)-paidBeforeDue);
      if(stillDue>0&&due<end)rows.push({date:dateISO(due),name:debt.name,amount:stillDue,detail:'Debt minimum payment',type:'debt'});
    }
    for(const e of data.expenses.filter(x=>x.frequency&&x.frequency!=='once')){const d=occurrenceDateForBill(e,now);if(d&&parseISO(d)>=now&&parseISO(d)<end)rows.push({date:d,name:e.name,amount:Number(e.amount||0),detail:`Expense · ${e.frequency}`,type:'expense'});}
    return rows.sort((a,b)=>a.date.localeCompare(b.date)).slice(0,6);
  }
  function expenseBreakdown(summary){
    const map=new Map();
    const add=(name,value,color)=>{if(value<=0)return;const prev=map.get(name);map.set(name,{name,value:(prev?.value||0)+value,color:color||prev?.color||categoryMeta(name).color});};
    summary.expenses.forEach(e=>add(e.category||'Other',Number(e.amount||0),categoryMeta(e.category).color));
    data.bills.filter(b=>b.enabled).forEach(b=>add(b.category||'Other',billReserve(b),categoryMeta(b.category).color));
    if(summary.debtPaid+summary.debtDue)add('Debt Payment',summary.debtPaid+summary.debtDue,'#c7a45f');
    return [...map.values()].sort((a,b)=>b.value-a.value);
  }
  function renderDashboard(){
    const s=summarize(),now=new Date(),hour=now.getHours(),greeting=hour<12?'GOOD MORNING':hour<18?'GOOD AFTERNOON':'GOOD EVENING';
    const breakdown=expenseBreakdown(s),spent=breakdown.reduce((n,x)=>n+x.value,0),circ=2*Math.PI*45;let offset=0;
    const segmentMarkup=breakdown.map(x=>{const len=spent?circ*x.value/spent:0;const node=`<circle class="donut-segment" cx="60" cy="60" r="45" stroke="${escapeHtml(x.color)}" stroke-dasharray="${len} ${circ-len}" stroke-dashoffset="${-offset}"/>`;offset+=len;return node;}).join('');
    const topLegend=breakdown.slice(0,4).map(x=>`<div class="legend-row"><i class="legend-swatch" style="background:${escapeHtml(x.color)}"></i><span class="legend-label">${escapeHtml(x.name)}</span><strong class="legend-value">${money(x.value,true)}</strong></div>`).join('');
    const hist=[];for(let i=5;i>=0;i--){const d=new Date(Number(selectedMonth.slice(0,4)),Number(selectedMonth.slice(5))-1-i,1,12),key=monthKey(d),sum=summarize(windowFor(key));hist.push({key,label:d.toLocaleDateString('en-GB',{month:'short'}),value:sum.outflow,current:i===0});}
    const maxOut=Math.max(1,...hist.map(x=>x.value));
    const bars=hist.map(x=>`<div class="bar-group ${x.current?'current':''}" title="${escapeHtml(x.label)}: ${escapeHtml(money(x.value))}"><div class="bar-value"><span class="bar-fill" style="height:${Math.max(x.value?3:1,Math.round(100*x.value/maxOut))}%"></span></div><span class="bar-label">${escapeHtml(x.label)}</span></div>`).join('');
    const debts=data.debts.filter(d=>debtRemaining(d)>0).slice(0,3);
    const debtMarkup=debts.length?debts.map(d=>{const paid=Number(d.originalAmount)-debtRemaining(d),pct=Number(d.originalAmount)>0?Math.min(100,Math.max(0,paid/Number(d.originalAmount)*100)):0;return `<div class="debt-mini-row"><span class="debt-mini-name">${escapeHtml(d.name)}</span><strong class="debt-mini-balance">${money(debtRemaining(d),true)}</strong><div class="progress-track"><span style="width:${pct}%"></span></div><div class="progress-hint"><span>${money(paid,true)} paid</span><span>${Math.round(pct)}%</span></div></div>`;}).join(''):`<div class="empty-inline">No outstanding debts. You’re all caught up.</div>`;
    const recent=allTransactions().slice(0,5);
    const recentMarkup=recent.length?recent.map(transactionRow).join(''):`<div class="empty-inline">Your transactions will show up here.</div>`;
    const upcoming=upcomingItems();const upcomingMarkup=upcoming.length?upcoming.map(x=>{const d=parseISO(x.date);return `<div class="upcoming-row"><div class="date-block"><strong>${d.getDate()}</strong><span>${d.toLocaleDateString('en-GB',{month:'short'})}</span></div><div class="upcoming-info"><strong>${escapeHtml(x.name)}</strong><span>${escapeHtml(x.detail)}</span></div><strong class="upcoming-amount">${money(x.amount)}</strong></div>`;}).join(''):emptyState('Nothing due soon','Upcoming bills and debt payments will appear here.','bill');
    const budgetPercent=s.incomeTotal>0?Math.min(100,Math.max(0,s.available/s.incomeTotal*100)):0;
    return `<div class="page-heading dashboard-heading"><div class="page-heading-copy"><div class="eyebrow">${greeting}</div><h1>Your money, in focus.</h1><span class="date-context"><i class="status-dot"></i>${escapeHtml(dateRangeLabel())} <span>·</span> All figures in ${escapeHtml(data.settings.currency||'EUR')}</span></div><div class="heading-actions"><button class="primary-button" type="button" data-add="quick"><span>+</span> Add transaction</button></div></div>
      <div class="overview-grid">
        <article class="metric-card available-card"><span class="metric-accent">${icon('trend')}</span><div class="metric-label">Available to spend</div><div class="metric-amount ${s.available<0?'money-negative':''}">${money(s.available,true)}</div><div class="metric-foot">${s.available<0?'You’re over budget this month':'After expenses, bills & debt payments'}</div><div class="balance-progress"><span style="width:${budgetPercent}%"></span></div><div class="overview-footnote">${s.available>=0?`${Math.round(budgetPercent)}% of income remains`: `${money(Math.abs(s.available))} over this month`}</div></article>
        <article class="metric-card"><span class="metric-accent">${icon('arrowUp')}</span><div class="metric-label">Income</div><div class="metric-amount income-amount">${money(s.incomeTotal,true)}</div><div class="metric-foot">${s.incomes.length} ${s.incomes.length===1?'entry':'entries'} this month</div></article>
        <article class="metric-card"><span class="metric-accent">${icon('arrowDown')}</span><div class="metric-label">Outflow</div><div class="metric-amount expense-amount">${money(s.outflow,true)}</div><div class="metric-foot">Expenses, bills & debt paid</div></article>
        <article class="metric-card"><span class="metric-accent">${icon('wallet')}</span><div class="metric-label">Debt remaining</div><div class="metric-amount debt-amount">${money(s.totalDebt,true)}</div><div class="metric-foot">${data.debts.filter(d=>debtRemaining(d)>0).length} active ${data.debts.filter(d=>debtRemaining(d)>0).length===1?'debt':'debts'}</div></article>
      </div>
      <div class="dashboard-grid">
        <section class="panel"><div class="panel-header"><div><div class="panel-title">Monthly outflow</div><div class="panel-subtitle">Where your money is going this period</div></div><button class="text-link" type="button" data-nav="budget">View budget ${icon('arrowRight')}</button></div><div class="spending-layout"><div class="donut-wrap"><svg viewBox="0 0 120 120" role="img" aria-label="Monthly spending breakdown"><circle class="donut-track" cx="60" cy="60" r="45"/>${segmentMarkup}<circle class="donut-hole" cx="60" cy="60" r="37"/></svg><div class="donut-center"><strong>${money(spent,true)}</strong><span>total outflow</span></div></div><div class="spending-legend">${topLegend||`<div class="legend-empty">Add activity to see your breakdown.</div>`}${breakdown.length>4?`<div class="legend-row"><i class="legend-swatch" style="background:#636e66"></i><span class="legend-label">${breakdown.length-4} more categories</span><strong class="legend-value">${money(breakdown.slice(4).reduce((n,x)=>n+x.value,0),true)}</strong></div>`:''}</div></div></section>
        <section class="panel"><div class="panel-header"><div><div class="panel-title">Spending over time</div><div class="panel-subtitle">Total outflow · last six periods</div></div><div class="chart-legend"><span><i></i> Outflow</span></div></div><div class="bar-chart" role="img" aria-label="Bar chart of spending over six months">${bars}</div></section>
      </div>
      <div class="dashboard-grid secondary">
        <section class="panel"><div class="panel-header"><div><div class="panel-title">Debt overview</div><div class="panel-subtitle">Progress across your balances</div></div><button class="text-link" type="button" data-nav="debts">All debts ${icon('arrowRight')}</button></div><div class="debt-mini-list">${debtMarkup}</div></section>
        <section class="panel"><div class="panel-header"><div><div class="panel-title">Coming up</div><div class="panel-subtitle">Bills & payments due in the next 35 days</div></div><button class="text-link" type="button" data-nav="bills">All bills ${icon('arrowRight')}</button></div><div class="upcoming-list">${upcomingMarkup}</div></section>
      </div>
      <section class="panel" style="margin-top:14px"><div class="panel-header"><div><div class="panel-title">Recent activity</div><div class="panel-subtitle">Your latest transactions</div></div><button class="text-link" type="button" data-nav="transactions">View transactions ${icon('arrowRight')}</button></div><div class="item-list">${recentMarkup}</div></section>`;
  }
  function transactionRow(t){
    const incoming=t.transactionType==='income',debt=t.transactionType==='debt';
    const sym=incoming?'arrowUp':debt?'wallet':'arrowDown';
    return `<div class="recent-row"><span class="transaction-symbol ${incoming?'': 'outgoing'}">${icon(sym)}</span><div class="recent-copy"><strong>${escapeHtml(t.description)}</strong><span>${escapeHtml(t.category)} · ${escapeHtml(shortDate(t.date))}</span></div><strong class="recent-amount ${incoming?'positive':'negative'}">${incoming?'+':'−'}${money(t.amount)}</strong></div>`;
  }
  function tableActions(kind,id){return `<div class="row-actions"><button class="row-action" type="button" data-action="edit" data-kind="${kind}" data-id="${escapeHtml(id)}" aria-label="Edit">${icon('edit')}</button><button class="row-action danger" type="button" data-action="delete" data-kind="${kind}" data-id="${escapeHtml(id)}" aria-label="Delete">${icon('trash')}</button></div>`;}
  function categoryPill(name){const m=categoryMeta(name);return `<span class="category-pill"><i style="background:${escapeHtml(m.color)}"></i>${escapeHtml(name||'Other')}</span>`;}
  function tableWrap(headers,rows,empty){return `<section class="panel data-panel"><div class="table-wrap"><table class="data-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows||`<tr><td colspan="${headers.length}"><div class="empty-panel-pad">${empty}</div></td></tr>`}</tbody></table></div></section>`;}
  function expenseRows(){
    const q=searchQuery.trim().toLowerCase();let items=expandEntries(data.expenses,'expense').filter(e=>(!q||[e.name,e.category,e.notes].some(x=>String(x||'').toLowerCase().includes(q)))&&(listFilters.category==='all'||e.category===listFilters.category));
    if(listFilters.sort==='date-asc')items.sort((a,b)=>a.date.localeCompare(b.date));else if(listFilters.sort==='amount-desc')items.sort((a,b)=>Number(b.amount)-Number(a.amount));else items.sort((a,b)=>b.date.localeCompare(a.date));
    return items.map(e=>`<tr><td><span class="table-primary">${escapeHtml(e.name)}</span><span class="table-secondary">${e.frequency&&e.frequency!=='once'?`Repeats ${escapeHtml(e.frequency)}`:escapeHtml(e.notes||'')}</span></td><td>${categoryPill(e.category)}</td><td>${escapeHtml(fullDate(e.date))}</td><td class="amount-cell expense">−${money(e.amount)}</td><td>${tableActions('expense',e.id)}</td></tr>`).join('');
  }
  function renderExpenses(){const total=expandEntries(data.expenses,'expense').length;const rows=expenseRows();const shown=rows?rows.split('<tr>').length-1:0;return `${pageHeading('Expenses','Track everyday spending and keep every purchase in view.','<button class="primary-button" type="button" data-add="expense"><span>+</span> Add expense</button>')}<div class="toolbar"><label class="search-field">${icon('search')}<input id="listSearch" type="search" placeholder="Search expenses" value="${escapeHtml(searchQuery)}" /></label><select class="filter-select" id="expenseCategoryFilter" aria-label="Filter by category"><option value="all">All categories</option>${data.categories.map(c=>`<option value="${escapeHtml(c.name)}" ${listFilters.category===c.name?'selected':''}>${escapeHtml(c.name)}</option>`).join('')}</select><select class="filter-select" id="sortFilter" aria-label="Sort expenses"><option value="date-desc" ${listFilters.sort==='date-desc'?'selected':''}>Newest first</option><option value="date-asc" ${listFilters.sort==='date-asc'?'selected':''}>Oldest first</option><option value="amount-desc" ${listFilters.sort==='amount-desc'?'selected':''}>Highest amount</option></select><span class="results-label">${shown} of ${total} · ${escapeHtml(dateRangeLabel())}</span></div><div id="expenseTable">${tableWrap(['Expense','Category','Date','Amount',''],rows,emptyState(searchQuery||listFilters.category!=='all'?'No matching expenses':'No expenses yet',searchQuery||listFilters.category!=='all'?'Try a different search or category.':'Add your first expense to start seeing where your money goes.','expense'))}</div>`;}
  function incomeRows(){const q=searchQuery.trim().toLowerCase();let items=expandEntries(data.incomes,'income').filter(i=>!q||[i.name,i.notes].some(x=>String(x||'').toLowerCase().includes(q)));if(listFilters.sort==='date-asc')items.sort((a,b)=>a.date.localeCompare(b.date));else if(listFilters.sort==='amount-desc')items.sort((a,b)=>Number(b.amount)-Number(a.amount));else items.sort((a,b)=>b.date.localeCompare(a.date));return items.map(i=>`<tr><td><span class="table-primary">${escapeHtml(i.name)}</span><span class="table-secondary">${i.frequency&&i.frequency!=='once'?`Repeats ${escapeHtml(i.frequency)}`:escapeHtml(i.notes||'')}</span></td><td>${escapeHtml(fullDate(i.date))}</td><td class="amount-cell income">+${money(i.amount)}</td><td>${tableActions('income',i.id)}</td></tr>`).join('');}
  function renderIncome(){const rows=incomeRows();const total=expandEntries(data.incomes,'income').length,shown=rows?rows.split('<tr>').length-1:0;return `${pageHeading('Income','Keep track of every source of money coming in.','<button class="primary-button" type="button" data-add="income"><span>+</span> Add income</button>')}<div class="toolbar"><label class="search-field">${icon('search')}<input id="listSearch" type="search" placeholder="Search income" value="${escapeHtml(searchQuery)}" /></label><select class="filter-select" id="sortFilter" aria-label="Sort income"><option value="date-desc" ${listFilters.sort==='date-desc'?'selected':''}>Newest first</option><option value="date-asc" ${listFilters.sort==='date-asc'?'selected':''}>Oldest first</option><option value="amount-desc" ${listFilters.sort==='amount-desc'?'selected':''}>Highest amount</option></select><span class="results-label">${shown} of ${total} entries · ${escapeHtml(dateRangeLabel())}</span></div><div id="incomeTable">${tableWrap(['Source','Date','Amount',''],rows,emptyState(searchQuery?'No matching income':'No income added yet',searchQuery?'Try a different search.':'Add salary, freelance work or another source to see your monthly picture.','income'))}</div>`;}
  function renderDebts(){
    const cards=data.debts.map(d=>{const remaining=debtRemaining(d),paid=Number(d.originalAmount)-remaining,pct=Number(d.originalAmount)>0?Math.min(100,Math.max(0,paid/Number(d.originalAmount)*100)):100;const status=remaining<=0?'Paid off':'Active';return `<article class="debt-card"><div class="debt-card-top"><div><div class="debt-title">${escapeHtml(d.name)}</div><div class="debt-description">${d.interestRate?`${escapeHtml(d.interestRate)}% interest · `:''}${d.dueDate?`Due ${escapeHtml(fullDate(d.dueDate))}`:'No due date'}</div></div><span class="status-pill ${remaining<=0?'off':''}">${status}</span></div><div class="debt-balance">${money(remaining,true)}<small>remaining of ${money(d.originalAmount)}</small></div><div class="debt-progress"><span style="width:${pct}%"></span></div><div class="debt-stats"><span>${money(paid)} paid</span><span>${Math.round(pct)}% complete</span></div>${d.notes?`<div class="table-secondary" style="margin-top:10px">${escapeHtml(d.notes)}</div>`:''}<div class="debt-card-actions">${remaining>0?`<button class="primary-button" type="button" data-action="payment" data-id="${escapeHtml(d.id)}">Record payment</button><button class="outline-button" type="button" data-action="mark-paid" data-id="${escapeHtml(d.id)}">Mark paid</button>`:`<button class="outline-button" type="button" data-action="payment-history" data-id="${escapeHtml(d.id)}">Payment history</button>`}<button class="row-action" type="button" data-action="edit" data-kind="debt" data-id="${escapeHtml(d.id)}" aria-label="Edit debt">${icon('edit')}</button><button class="row-action danger" type="button" data-action="delete" data-kind="debt" data-id="${escapeHtml(d.id)}" aria-label="Delete debt">${icon('trash')}</button></div></article>`;}).join('');
    const active=data.debts.reduce((n,d)=>n+debtRemaining(d),0),paid=data.debts.reduce((n,d)=>n+paymentTotal(d.id),0);
    return `${pageHeading('Debts','A clear picture of what you owe and the progress you’ve made.','<button class="primary-button" type="button" data-add="debt"><span>+</span> Add debt</button>')}<div class="budget-cards"><article class="budget-stat"><label>Outstanding</label><strong class="debt-amount">${money(active,true)}</strong><small>Across ${data.debts.filter(d=>debtRemaining(d)>0).length} active debts</small></article><article class="budget-stat"><label>Paid so far</label><strong class="income-amount">${money(paid,true)}</strong><small>From your payment history</small></article><article class="budget-stat"><label>Original balances</label><strong>${money(data.debts.reduce((n,d)=>n+Number(d.originalAmount||0),0),true)}</strong><small>Total borrowed</small></article><article class="budget-stat"><label>Payments this period</label><strong>${money(summarize().debtPaid,true)}</strong><small>Included in your outflow</small></article></div>${cards?`<div class="debt-card-grid">${cards}</div>`:`<div class="panel">${emptyState('No debts to track','Add a debt to see your balance, payment history and payoff progress.','debt')}</div>`}`;
  }
  function renderBills(){
    const rows=data.bills.map(b=>{const next=occurrenceDateForBill(b);const paid=paidBillTotal(b.id);return `<div class="bill-row"><div><div class="bill-name">${escapeHtml(b.name)} ${b.enabled?'':'<span class="pill-muted">Paused</span>'}</div><div class="bill-detail">${escapeHtml(b.category||'Other')}${b.notes?` · ${escapeHtml(b.notes)}`:''}</div></div><div><div class="bill-amount">${money(b.amount)}</div><div class="bill-detail">${escapeHtml(b.frequency)} · ${money(b.frequency==='weekly'?b.amount*52/12:b.frequency==='yearly'?b.amount/12:b.amount,true)}/mo</div></div><div class="bill-due">${next?`Next ${escapeHtml(fullDate(next))}`:'No upcoming date'}${paid>0?`<div class="bill-detail">${money(paid)} paid this period</div>`:''}</div><div class="row-actions"><button class="outline-button" style="min-height:30px;padding:0 9px;font-size:9px" type="button" data-action="pay-bill" data-id="${escapeHtml(b.id)}" ${!b.enabled?'disabled':''}>Mark paid</button><button class="row-action" type="button" data-action="toggle-bill" data-id="${escapeHtml(b.id)}" aria-label="${b.enabled?'Pause':'Enable'} bill">${b.enabled?icon('check'):icon('arrowRight')}</button><button class="row-action" type="button" data-action="edit" data-kind="bill" data-id="${escapeHtml(b.id)}" aria-label="Edit bill">${icon('edit')}</button><button class="row-action danger" type="button" data-action="delete" data-kind="bill" data-id="${escapeHtml(b.id)}" aria-label="Delete bill">${icon('trash')}</button></div></div>`;}).join('');
    const reserve=data.bills.reduce((n,b)=>n+billReserve(b),0);
    return `${pageHeading('Bills & subscriptions','Plan recurring costs and see what’s coming before it’s due.','<button class="primary-button" type="button" data-add="bill"><span>+</span> Add recurring bill</button>')}<div class="budget-cards"><article class="budget-stat"><label>Planned this period</label><strong class="expense-amount">${money(reserve,true)}</strong><small>Upcoming bills not marked paid</small></article><article class="budget-stat"><label>Monthly equivalent</label><strong>${money(data.bills.filter(b=>b.enabled).reduce((n,b)=>n+Number(b.amount||0)*(b.frequency==='weekly'?52/12:b.frequency==='yearly'?1/12:1),0),true)}</strong><small>Active recurring costs</small></article><article class="budget-stat"><label>Active bills</label><strong>${data.bills.filter(b=>b.enabled).length}</strong><small>Of ${data.bills.length} total</small></article><article class="budget-stat"><label>Paid this period</label><strong class="income-amount">${money(data.expenses.filter(e=>e.billId&&inWindow(e.date)).reduce((n,e)=>n+Number(e.amount||0),0),true)}</strong><small>Recorded against a bill</small></article></div><section class="panel data-panel">${rows||`<div class="empty-panel-pad">${emptyState('No recurring bills','Add rent, subscriptions or other repeating costs so they’re included in your plan.','bill')}</div>`}</section><p class="table-secondary" style="margin:11px 3px 0">Planned bills are reserved in your available-to-spend calculation. Mark a bill paid to replace its planned amount with an expense.</p>`;
  }
  function renderTransactions(){
    currentTransactionRows=allTransactions();const q=searchQuery.trim().toLowerCase();
    let filtered=currentTransactionRows.filter(t=>{
      const matchesSearch=!q||[t.description,t.category,t.notes,t.transactionType].some(s=>String(s||'').toLowerCase().includes(q));
      const typeOK=listFilters.type==='all'||listFilters.type===t.transactionType;
      const catOK=listFilters.category==='all'||listFilters.category===t.category;
      const value=Number(t.amount||0),amountOK=listFilters.amount==='all'||listFilters.amount==='under50'&&value<50||listFilters.amount==='50to250'&&value>=50&&value<=250||listFilters.amount==='over250'&&value>250;
      return matchesSearch&&typeOK&&catOK&&amountOK;
    });
    if(listFilters.sort==='date-asc')filtered.sort((a,b)=>a.date.localeCompare(b.date));else if(listFilters.sort==='amount-desc')filtered.sort((a,b)=>Number(b.amount)-Number(a.amount));else filtered.sort((a,b)=>b.date.localeCompare(a.date));
    const rows=filtered.map(t=>`<tr><td><span class="table-primary">${escapeHtml(t.description)}</span><span class="table-secondary">${escapeHtml(t.notes||'')}</span></td><td>${categoryPill(t.category)}</td><td><span class="type-pill ${t.transactionType}">${t.transactionType==='debt'?'Debt payment':t.transactionType==='income'?'Income':'Expense'}</span></td><td>${escapeHtml(fullDate(t.date))}</td><td class="amount-cell ${t.transactionType==='income'?'income':'expense'}">${t.transactionType==='income'?'+':'−'}${money(t.amount)}</td><td>${t.transactionType==='debt'?tableActions('payment',t.id):tableActions(t.transactionType,t.id)}</td></tr>`).join('');
    return `${pageHeading('Transactions','Every income entry, purchase and debt payment in one place.','<button class="primary-button" type="button" data-add="quick"><span>+</span> Add transaction</button>')}<div class="toolbar"><label class="search-field">${icon('search')}<input id="listSearch" type="search" placeholder="Search transactions" value="${escapeHtml(searchQuery)}" /></label><select class="filter-select" id="typeFilter" aria-label="Filter by type">${[['all','All types'],['income','Income'],['expense','Expense'],['debt','Debt payments']].map(([v,l])=>`<option value="${v}" ${listFilters.type===v?'selected':''}>${l}</option>`).join('')}</select><select class="filter-select" id="transactionCategoryFilter" aria-label="Filter by category"><option value="all">All categories</option>${[...data.categories.map(c=>c.name),'Income'].map(c=>`<option ${listFilters.category===c?'selected':''}>${escapeHtml(c)}</option>`).join('')}</select><select class="filter-select" id="amountFilter" aria-label="Filter by amount"><option value="all" ${listFilters.amount==='all'?'selected':''}>Any amount</option><option value="under50" ${listFilters.amount==='under50'?'selected':''}>Under ${money(50)}</option><option value="50to250" ${listFilters.amount==='50to250'?'selected':''}>${money(50)}–${money(250)}</option><option value="over250" ${listFilters.amount==='over250'?'selected':''}>Over ${money(250)}</option></select><select class="filter-select" id="sortFilter" aria-label="Sort transactions"><option value="date-desc" ${listFilters.sort==='date-desc'?'selected':''}>Newest first</option><option value="date-asc" ${listFilters.sort==='date-asc'?'selected':''}>Oldest first</option><option value="amount-desc" ${listFilters.sort==='amount-desc'?'selected':''}>Highest amount</option></select><span class="results-label">${filtered.length} of ${currentTransactionRows.length} transactions</span></div>${tableWrap(['Description','Category','Type','Date','Amount',''],rows,emptyState('No transactions found','Try a different search or add your first transaction.','quick'))}`;
  }
  function renderBudget(){
    const s=summarize(),debtPayments=s.debtPaid+s.debtDue,income=s.incomeTotal,total=Math.max(income,s.outflow,1);const percent=v=>`${Math.min(100,Math.max(0,v/total*100))}%`;
    const breakdown=expenseBreakdown(s),max=Math.max(1,...breakdown.map(x=>x.value));
    const cats=breakdown.map(x=>`<div class="category-spend-row"><span class="category-spend-name">${escapeHtml(x.name)}</span><div class="category-meter"><span style="width:${Math.max(2,x.value/max*100)}%;background:${escapeHtml(x.color)}"></span></div><strong class="category-spend-value">${money(x.value)}</strong></div>`).join('');
    const periodActions=`<span class="status-pill ${s.available<0?'off':''}">${s.available<0?'Over budget':'On track'}</span>`;
    return `${pageHeading('Monthly budget',`A complete picture for ${escapeHtml(dateRangeLabel())}.`,periodActions)}
      <div class="budget-cards">
        <article class="budget-stat"><label>Income</label><strong class="income-amount">${money(s.incomeTotal,true)}</strong><small>${s.incomes.length} incoming ${s.incomes.length===1?'entry':'entries'}</small></article>
        <article class="budget-stat"><label>Fixed expenses</label><strong class="expense-amount">${money(s.fixed,true)}</strong><small>Recurring costs and planned bills</small></article>
        <article class="budget-stat"><label>Variable expenses</label><strong class="expense-amount">${money(s.variable,true)}</strong><small>Day-to-day spending</small></article>
        <article class="budget-stat"><label>Debt payments</label><strong style="color:#ddc17e">${money(debtPayments,true)}</strong><small>${money(s.debtPaid)} paid · ${money(s.debtDue)} minimums due</small></article>
      </div>
      <div class="dashboard-grid">
        <section class="panel">
          <div class="panel-header"><div><div class="panel-title">Your monthly plan</div><div class="panel-subtitle">Income compared with planned and recorded outflow</div></div></div>
          <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px"><div><div class="eyebrow">AVAILABLE TO SPEND</div><div class="metric-amount ${s.available<0?'money-negative':'income-amount'}" style="font-size:34px;margin-top:9px">${money(s.available,true)}</div></div><div style="text-align:right;color:#808b82;font-size:9px">Total outflow<br><strong style="display:block;color:#e7ebe6;font-size:13px;margin-top:4px">${money(s.outflow)}</strong></div></div>
          <div class="budget-visual"><div class="budget-track" role="img" aria-label="Budget breakdown"><span class="fixed" title="Fixed expenses" style="width:${percent(s.fixed)}"></span><span class="variable" title="Variable expenses" style="width:${percent(s.variable)}"></span><span class="debt" title="Debt payments" style="width:${percent(debtPayments)}"></span><span class="remaining" title="Remaining" style="width:${percent(Math.max(0,s.available))}"></span></div><div class="budget-legend"><span><i></i> Fixed expenses</span><span><i></i> Variable expenses</span><span><i></i> Debt payments</span><span><i></i> Remaining</span></div></div>
          <div class="history-row"><strong>Income</strong><b style="color:var(--green)">${money(s.incomeTotal)}</b></div><div class="history-row"><strong>Fixed expenses & bills</strong><b>−${money(s.fixed)}</b></div><div class="history-row"><strong>Variable expenses</strong><b>−${money(s.variable)}</b></div><div class="history-row"><strong>Debt payments</strong><b>−${money(debtPayments)}</b></div><div class="history-row"><strong>Remaining</strong><b class="${s.available<0?'danger-text':'income-amount'}">${money(s.available)}</b></div>
        </section>
        <section class="panel"><div class="panel-header"><div><div class="panel-title">Spending breakdown</div><div class="panel-subtitle">Outflow by category</div></div></div>${cats||`<div class="empty-inline">No spending to break down yet.</div>`}</section>
      </div>
      <div class="panel" style="margin-top:14px"><div class="panel-header"><div><div class="panel-title">Monthly outlook</div><div class="panel-subtitle">Your plan updates whenever you change a transaction, bill or payment.</div></div></div><div class="history-row"><strong>Available funds</strong><span>${money(s.incomeTotal)} income less ${money(s.outflow)} total outflow</span></div></div>`;
  }
  function renderSettings(){
    const cats=data.categories.map(c=>`<div class="category-setting-row"><i style="background:${escapeHtml(c.color)}"></i><span>${escapeHtml(c.name)}</span><button type="button" class="row-action danger" data-action="delete-category" data-id="${escapeHtml(c.id)}" aria-label="Remove category">${icon('trash')}</button></div>`).join('');
    return `${pageHeading('Settings','Make Northstar feel right for you and manage your data.','')}<div class="settings-grid"><div class="settings-stack"><section class="settings-panel"><h2>Preferences</h2><p>Personalize how your finances are displayed.</p><div class="setting-line"><div class="setting-copy"><strong>Currency</strong><small>Used throughout your dashboard and exports</small></div><div class="setting-control"><select id="currencySetting"><option value="EUR" ${data.settings.currency==='EUR'?'selected':''}>EUR · Euro</option><option value="USD" ${data.settings.currency==='USD'?'selected':''}>USD · US dollar</option><option value="GBP" ${data.settings.currency==='GBP'?'selected':''}>GBP · Pound sterling</option></select></div></div><div class="setting-line"><div class="setting-copy"><strong>Month starts on</strong><small>Sets the date range used in monthly totals</small></div><div class="setting-control"><select id="monthStartSetting"><option value="1" ${Number(data.settings.monthStart)===1?'selected':''}>1st of the month</option><option value="15" ${Number(data.settings.monthStart)===15?'selected':''}>15th of the month</option><option value="25" ${Number(data.settings.monthStart)===25?'selected':''}>25th of the month</option></select></div></div><div class="setting-line"><div class="setting-copy"><strong>Appearance</strong><small>Choose a dark or light workspace</small></div><div class="setting-control"><select id="themeSetting"><option value="dark" ${data.settings.theme==='dark'?'selected':''}>Dark</option><option value="light" ${data.settings.theme==='light'?'selected':''}>Light</option></select></div></div></section><section class="settings-panel"><h2>Categories</h2><p>Personalize the categories used for expenses and bills.</p><div class="category-settings">${cats}</div><form class="category-add" id="categoryAddForm"><input name="category" maxlength="28" placeholder="New category name" aria-label="New category name" required /><button class="outline-button" type="submit">Add</button></form></section></div><div class="settings-stack"><section class="settings-panel"><h2>Data management</h2><p>Your data is stored in this browser on this device. Export a backup whenever you like.</p><div class="data-actions"><button class="outline-button" type="button" data-action="export-json">${icon('export')} Export JSON backup</button><button class="outline-button" type="button" data-action="export-csv">${icon('export')} Export CSV</button><button class="outline-button" type="button" data-action="import-json">Import backup</button><input id="importFile" class="visually-hidden" type="file" accept="application/json,.json" /><span class="import-hint">Importing a backup replaces the current data in this browser.</span></div></section><section class="settings-panel"><h2>Reset workspace</h2><p>Start fresh by clearing every income entry, expense, bill, debt and payment saved here.</p><div class="data-actions"><button class="outline-button danger-button" type="button" data-action="reset-data">Reset all data</button><span class="import-hint">This cannot be undone. Export a backup first if you may need this data later.</span></div></section><section class="settings-panel"><h2>Privacy & storage</h2><p>Northstar saves information locally in this browser. No account or external service is connected.</p><div class="setting-line"><div class="setting-copy"><strong>Saved records</strong><small>Income, expenses, bills, debts, payment history and settings</small></div><span class="status-pill">Local storage</span></div></section></div></div>`;
  }

  function selectOptions(selected,includeAll=false){return `${includeAll?'<option value="">No category</option>':''}${data.categories.map(c=>`<option value="${escapeHtml(c.name)}" ${selected===c.name?'selected':''}>${escapeHtml(c.name)}</option>`).join('')}`;}
  function formField(label,name,value='',type='text',opts={}){
    const required=opts.required!==false,placeholder=opts.placeholder||'',min=opts.min!==undefined?` min="${opts.min}"`:'',step=opts.step?` step="${opts.step}"`:'';
    if(type==='select')return `<div class="field ${opts.full?'full':''}"><label for="f-${name}">${escapeHtml(label)}</label><select id="f-${name}" name="${name}" ${required?'required':''}>${opts.options}</select><span class="field-error" data-error="${name}"></span></div>`;
    if(type==='textarea')return `<div class="field ${opts.full?'full':''}"><label for="f-${name}">${escapeHtml(label)}</label><textarea id="f-${name}" name="${name}" placeholder="${escapeHtml(placeholder)}" ${required?'required':''}>${escapeHtml(value)}</textarea><span class="field-error" data-error="${name}"></span></div>`;
    return `<div class="field ${opts.full?'full':''}"><label for="f-${name}">${escapeHtml(label)}</label><input id="f-${name}" name="${name}" type="${type}" value="${escapeHtml(value)}" ${placeholder?`placeholder="${escapeHtml(placeholder)}"`:''} ${required?'required':''}${min}${step} /><span class="field-error" data-error="${name}"></span></div>`;
  }
  function openModal(title,description,body,wide=false){modalRoot.innerHTML=`<div class="modal-backdrop" data-modal-backdrop><section class="modal ${wide?'wide':''}" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><header class="modal-header"><div><h2 id="modalTitle">${escapeHtml(title)}</h2><p>${escapeHtml(description||'')}</p></div><button class="modal-close" type="button" data-close-modal aria-label="Close">×</button></header><div class="modal-body">${body}</div></section></div>`;const focus=modalRoot.querySelector('input:not([type=hidden]),select,button');setTimeout(()=>focus?.focus(),0);}
  function closeModal(){modalRoot.innerHTML='';}
  function toast(message,error=false){const el=document.createElement('div');el.className=`toast ${error?'error':''}`;el.innerHTML=`<span class="toast-mark">${error?'!':'✓'}</span><span>${escapeHtml(message)}</span>`;toastStack.append(el);setTimeout(()=>{el.style.opacity='0';el.style.transform='translateY(4px)';setTimeout(()=>el.remove(),220);},3000);}
  function confirmAction(message,opts={}){return new Promise(resolve=>{confirmResolver=resolve;const required=opts.requiredText||'';openModal(opts.title||'Are you sure?',opts.description||'',`<p class="confirm-copy">${escapeHtml(message)}</p>${opts.warning?`<div class="confirm-warning">${escapeHtml(opts.warning)}</div>`:''}${required?`<div class="field" style="margin-top:14px"><label for="confirmPhrase">Type <strong>${escapeHtml(required)}</strong> to continue</label><input id="confirmPhrase" autocomplete="off" /><span class="field-error" id="confirmError"></span></div>`:''}<div class="modal-actions"><button class="secondary-button" type="button" data-confirm-result="no">Cancel</button><button class="danger-solid" type="button" data-confirm-result="yes" ${required?'disabled':''}>${escapeHtml(opts.confirmLabel||'Continue')}</button></div>`);});}
  function resolveConfirm(value){if(confirmResolver){const done=confirmResolver;confirmResolver=null;closeModal();done(value);}}
  function dateDefault(){return todayISO();}
  function openQuickAdd(){openModal('Add to your finances','What would you like to record?',`<div class="card-list">${[['expense','Expense','Record a purchase or payment','arrowDown'],['income','Income','Add salary or other money received','arrowUp'],['debt','Debt','Track a balance you owe','wallet'],['payment','Debt payment','Record a payment toward a debt','wallet'],['bill','Recurring bill','Plan a subscription or repeating cost','calendar']].map(([kind,label,copy,ic])=>`<button class="data-card data-card-head" style="width:100%;text-align:left;cursor:pointer" type="button" data-add="${kind}"><span class="transaction-symbol ${kind==='income'?'':'outgoing'}">${icon(ic)}</span><span style="flex:1"><span class="data-card-name">${label}</span><span class="data-card-meta">${copy}</span></span>${icon('arrowRight')}</button>`).join('')}</div>`);}
  function openMoreMenu(){openModal('More','Explore the rest of your workspace.',`<div class="card-list">${[['transactions','Transactions','Your complete activity history','repeat'],['budget','Monthly budget','A closer look at your monthly plan','chart'],['settings','Settings','Currency, categories and data tools','settings']].map(([id,label,copy,ic])=>`<button class="data-card data-card-head" style="width:100%;text-align:left;cursor:pointer" type="button" data-nav="${id}"><span class="transaction-symbol">${icon(ic)}</span><span style="flex:1"><span class="data-card-name">${label}</span><span class="data-card-meta">${copy}</span></span>${icon('arrowRight')}</button>`).join('')}</div>`);}
  function openExpenseForm(record){
    const item=record||{};const editing=!!record;const frequency=item.frequency||'once';
    const body=`<form id="recordForm" data-kind="expense" data-id="${escapeHtml(item.id||'')}"><div class="form-grid">${formField('Expense name','name',item.name||'','text',{placeholder:'e.g. Weekly groceries'})}${formField('Amount','amount',item.amount??'','number',{min:'0.01',step:'0.01',placeholder:'0.00'})}${formField('Category','category',item.category||'Other','select',{options:selectOptions(item.category||'Other')})}${formField('Date','date',item.date||dateDefault(),'date')}${formField('Schedule','frequency',frequency,'select',{options:[['once','One-time'],['weekly','Weekly'],['monthly','Monthly'],['yearly','Yearly']].map(([v,l])=>`<option value="${v}" ${frequency===v?'selected':''}>${l}</option>`).join('')})}${formField('Notes (optional)','notes',item.notes||'','textarea',{required:false,full:true,placeholder:'Add a note'})}</div><div class="modal-actions"><button class="secondary-button" type="button" data-close-modal>Cancel</button><button class="primary-button" type="submit">${editing?'Save changes':'Add expense'}</button></div></form>`;
    openModal(editing?'Edit expense':'Add an expense','Capture the details and we’ll update your monthly picture.',body);
  }
  function openIncomeForm(record){
    const item=record||{};const frequency=item.frequency||'once';
    const body=`<form id="recordForm" data-kind="income" data-id="${escapeHtml(item.id||'')}"><div class="form-grid">${formField('Income source','name',item.name||'','text',{placeholder:'e.g. Salary'})}${formField('Amount','amount',item.amount??'','number',{min:'0.01',step:'0.01',placeholder:'0.00'})}${formField('Date received','date',item.date||dateDefault(),'date')}${formField('Schedule','frequency',frequency,'select',{options:[['once','One-time'],['weekly','Weekly'],['monthly','Monthly'],['yearly','Yearly']].map(([v,l])=>`<option value="${v}" ${frequency===v?'selected':''}>${l}</option>`).join('')})}${formField('Notes (optional)','notes',item.notes||'','textarea',{required:false,full:true,placeholder:'Add a note'})}</div><div class="modal-actions"><button class="secondary-button" type="button" data-close-modal>Cancel</button><button class="primary-button" type="submit">${item.id?'Save changes':'Add income'}</button></div></form>`;
    openModal(item.id?'Edit income':'Add income','Record money you receive, whether it’s recurring or one-time.',body);
  }
  function openDebtForm(record){
    const item=record||{};const paid=record?paymentTotal(record.id):0;
    const body=`<form id="recordForm" data-kind="debt" data-id="${escapeHtml(item.id||'')}" data-paid="${paid}"><div class="form-grid">${formField('Debt name','name',item.name||'','text',{placeholder:'e.g. Credit card'})}${formField('Original amount','originalAmount',item.originalAmount??'','number',{min:'0.01',step:'0.01',placeholder:'0.00'})}${formField('Minimum payment','minimumPayment',item.minimumPayment??'','number',{required:false,min:'0',step:'0.01',placeholder:'0.00'})}${formField('Due date','dueDate',item.dueDate||'','date',{required:false})}${formField('Interest rate (optional)','interestRate',item.interestRate??'','number',{required:false,min:'0',step:'0.01',placeholder:'0.00'})}${formField('Notes (optional)','notes',item.notes||'','textarea',{required:false,full:true,placeholder:'Add a note'})}</div><div class="modal-actions"><button class="secondary-button" type="button" data-close-modal>Cancel</button><button class="primary-button" type="submit">${item.id?'Save changes':'Add debt'}</button></div></form>`;
    openModal(item.id?'Edit debt':'Add a debt','Track the original balance, minimum payment and due date.',body);
  }
  function openBillForm(record){
    const item=record||{};const frequency=item.frequency||'monthly';
    const body=`<form id="recordForm" data-kind="bill" data-id="${escapeHtml(item.id||'')}"><div class="form-grid">${formField('Bill name','name',item.name||'','text',{placeholder:'e.g. Internet'})}${formField('Amount per occurrence','amount',item.amount??'','number',{min:'0.01',step:'0.01',placeholder:'0.00'})}${formField('Category','category',item.category||'Subscriptions','select',{options:selectOptions(item.category||'Subscriptions')})}${formField('Frequency','frequency',frequency,'select',{options:[['weekly','Weekly'],['monthly','Monthly'],['yearly','Yearly']].map(([v,l])=>`<option value="${v}" ${frequency===v?'selected':''}>${l}</option>`).join('')})}${formField('Next due date','dueDate',item.dueDate||dateDefault(),'date')}${formField('Notes (optional)','notes',item.notes||'','textarea',{required:false,full:true,placeholder:'Add a note'})}<div class="field full"><label>Bill status</label><select name="enabled"><option value="true" ${item.enabled!==false?'selected':''}>Enabled</option><option value="false" ${item.enabled===false?'selected':''}>Paused</option></select></div></div><div class="modal-actions"><button class="secondary-button" type="button" data-close-modal>Cancel</button><button class="primary-button" type="submit">${item.id?'Save changes':'Add recurring bill'}</button></div></form>`;
    openModal(item.id?'Edit recurring bill':'Add a recurring bill','Set the schedule and we’ll include it in your monthly plan.',body);
  }
  function openPaymentForm(debtId,record){
    const item=record||{},debt=item.debtId?data.debts.find(d=>d.id===item.debtId):data.debts.find(d=>d.id===debtId)||data.debts.find(d=>debtRemaining(d)>0);
    if(!debt){toast('Add a debt before recording a payment.',true);return;}
    const choices=data.debts.filter(d=>debtRemaining(d)>0||d.id===debt.id).map(d=>`<option value="${escapeHtml(d.id)}" ${d.id===debt.id?'selected':''}>${escapeHtml(d.name)} · ${money(debtRemaining(d))} remaining</option>`).join('');
    const body=`<form id="recordForm" data-kind="payment" data-id="${escapeHtml(item.id||'')}" data-old-amount="${item.amount??''}" data-old-debt="${escapeHtml(item.debtId||'')}"><div class="form-grid">${formField('Debt','debtId',debt.id,'select',{options:choices,full:true})}${formField('Payment amount','amount',item.amount??'','number',{min:'0.01',step:'0.01',placeholder:'0.00'})}${formField('Payment date','date',item.date||dateDefault(),'date')}${formField('Notes (optional)','notes',item.notes||'','textarea',{required:false,full:true,placeholder:'Add a note'})}</div><div class="field-hint" id="remainingHint" style="margin-top:9px">Remaining balance: ${money(debtRemaining(debt))}</div><div class="modal-actions"><button class="secondary-button" type="button" data-close-modal>Cancel</button><button class="primary-button" type="submit">${item.id?'Save payment':'Record payment'}</button></div></form>`;
    openModal(item.id?'Edit debt payment':'Record a debt payment','Payments are included once in expenses and reduce your outstanding balance.',body);
  }

  function saveRecord(form){
    const fd=new FormData(form),kind=form.dataset.kind,id=form.dataset.id||'',existing=kind==='payment'?data.payments.find(x=>x.id===id):data[`${kind}s`]?.find(x=>x.id===id);
    const get=k=>String(fd.get(k)||'').trim();
    const fail=(name,msg)=>{const el=form.querySelector(`[data-error="${name}"]`);if(el)el.textContent=msg;else toast(msg,true);};
    form.querySelectorAll('.field-error').forEach(e=>e.textContent='');
    if(kind==='expense'||kind==='income'){
      const name=get('name'),amountValue=Number(get('amount')),date=get('date');if(!name)return fail('name','Add a name.');if(!(amountValue>0))return fail('amount','Enter an amount greater than zero.');if(!date)return fail('date','Choose a date.');
      const record={id:id||uid(),name,amount:amount(amountValue),date,frequency:get('frequency')||'once',category:kind==='expense'?get('category'):'Income',notes:get('notes')};
      if(existing)Object.assign(existing,record);else data[`${kind}s`].push(record);
    }else if(kind==='debt'){
      const name=get('name'),original=Number(get('originalAmount')),paid=Number(form.dataset.paid||0),minpay=Number(get('minimumPayment')||0);if(!name)return fail('name','Add a name.');if(!(original>0))return fail('originalAmount','Enter an amount greater than zero.');if(original+0.001<paid)return fail('originalAmount',`Original amount must be at least ${money(paid)} already paid.`);
      const record={id:id||uid(),name,originalAmount:amount(original),minimumPayment:amount(minpay),dueDate:get('dueDate'),interestRate:get('interestRate'),notes:get('notes')};if(existing)Object.assign(existing,record);else data.debts.push(record);
    }else if(kind==='bill'){
      const name=get('name'),value=Number(get('amount')),date=get('dueDate');if(!name)return fail('name','Add a bill name.');if(!(value>0))return fail('amount','Enter an amount greater than zero.');if(!date)return fail('dueDate','Choose a due date.');
      const record={id:id||uid(),name,amount:amount(value),category:get('category'),frequency:get('frequency'),dueDate:date,enabled:get('enabled')!=='false',notes:get('notes')};if(existing)Object.assign(existing,record);else data.bills.push(record);
    }else if(kind==='payment'){
      const debtId=get('debtId'),debt=data.debts.find(d=>d.id===debtId),value=Number(get('amount')),date=get('date');if(!debt)return fail('debtId','Choose a debt.');if(!(value>0))return fail('amount','Enter an amount greater than zero.');if(!date)return fail('date','Choose a payment date.');
      const priorForDebt=existing&&existing.debtId===debtId?Number(existing.amount):0;const available=debtRemaining(debt)+priorForDebt;
      if(value>available+0.001)return fail('amount',`This payment is higher than the ${money(available)} remaining balance.`);
      const record={id:id||uid(),debtId,amount:amount(value),date,notes:get('notes')};if(existing)Object.assign(existing,record);else data.payments.push(record);
    }
    persist();closeModal();render();toast(`${kind==='payment'?'Debt payment':kind[0].toUpperCase()+kind.slice(1)} ${existing?'updated':'added'}.`);
  }
  function openAdd(kind){if(kind==='quick')return openQuickAdd();if(kind==='expense')return openExpenseForm();if(kind==='income')return openIncomeForm();if(kind==='debt')return openDebtForm();if(kind==='bill')return openBillForm();if(kind==='payment')return openPaymentForm();}
  function recordBillPayment(id){const bill=data.bills.find(b=>b.id===id);if(!bill)return;if(!bill.enabled)return toast('Enable this bill before marking it paid.',true);const win=windowFor();const paid=paidBillTotal(bill.id,win);if(paid>=expectedBillOccurrences(bill,win)*Number(bill.amount)-.001)return toast('This bill is already marked paid for this period.',true);data.expenses.push({id:uid(),name:bill.name,amount:Number(bill.amount),date:todayISO(),category:bill.category||'Other',frequency:'once',notes:`Bill payment${bill.notes?` · ${bill.notes}`:''}`,billId:bill.id});persist();render();toast(`${bill.name} marked paid.`);}
  async function deleteRecord(kind,id){
    const labels={expense:'expense',income:'income entry',debt:'debt and its payment history',bill:'recurring bill',payment:'debt payment'};
    const target=kind==='payment'?data.payments.find(x=>x.id===id):data[`${kind}s`]?.find(x=>x.id===id);if(!target)return;
    const message=kind==='debt'?`Delete “${target.name}” and all of its recorded payments?`:`Delete this ${labels[kind]}?`;
    if(!await confirmAction(message,{title:`Delete ${kind==='payment'?'payment':kind}?`,confirmLabel:'Delete'}))return;
    if(kind==='payment')data.payments=data.payments.filter(x=>x.id!==id);
    else if(kind==='debt'){data.debts=data.debts.filter(x=>x.id!==id);data.payments=data.payments.filter(x=>x.debtId!==id);}
    else if(kind==='bill'){data.bills=data.bills.filter(x=>x.id!==id);}
    else data[`${kind}s`]=data[`${kind}s`].filter(x=>x.id!==id);
    persist();render();toast(`${kind==='payment'?'Debt payment':kind[0].toUpperCase()+kind.slice(1)} deleted.`);
  }
  async function markDebtPaid(id){const debt=data.debts.find(d=>d.id===id);if(!debt)return;const balance=debtRemaining(debt);if(balance<=0)return toast('This debt is already paid off.');if(!await confirmAction(`Record a final ${money(balance)} payment to mark “${debt.name}” as paid?`,{title:'Pay off this debt',confirmLabel:'Record payment'}))return;data.payments.push({id:uid(),debtId:id,amount:balance,date:todayISO(),notes:'Final payment'});persist();render();toast(`${debt.name} paid off. Final payment added to your outflow.`);}
  function showPaymentHistory(id){const debt=data.debts.find(d=>d.id===id);if(!debt)return;const history=data.payments.filter(p=>p.debtId===id).sort((a,b)=>b.date.localeCompare(a.date));openModal(`${debt.name} · payment history`,`${money(paymentTotal(id))} paid toward this debt`,history.length?`<div>${history.map(p=>`<div class="history-row"><div><strong>${money(p.amount)}</strong><span style="display:block">${escapeHtml(fullDate(p.date))}${p.notes?` · ${escapeHtml(p.notes)}`:''}</span></div><b>${money(p.amount)}</b></div>`).join('')}</div>`:`<div class="empty-inline">No payments recorded yet.</div>`);}

  function exportBlob(filename,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);}
  function exportJSON(){exportBlob(`northstar-backup-${todayISO()}.json`,JSON.stringify({...data,exportedAt:new Date().toISOString()},null,2),'application/json');toast('Backup downloaded.');}
  function csvCell(v){return `"${String(v??'').replace(/"/g,'""')}"`;}
  function exportCSV(){const rows=[['Type','Name','Amount','Currency','Date','Category','Frequency','Notes','ID']];for(const [type,key] of [['Income','incomes'],['Expense','expenses'],['Bill','bills'],['Debt','debts'],['Debt Payment','payments']])for(const x of data[key])rows.push([type,x.name||data.debts.find(d=>d.id===x.debtId)?.name||'',x.amount??x.originalAmount??'',data.settings.currency,x.date||x.dueDate||'',x.category||'',x.frequency||'',x.notes||'',x.id]);exportBlob(`northstar-data-${todayISO()}.csv`,rows.map(r=>r.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8');toast('CSV downloaded.');}
  async function resetData(){if(!await confirmAction('This will permanently remove every saved record and restore the default categories.',{title:'Reset all financial data',description:'This action cannot be undone.',warning:'Export a backup first if you want to keep a copy.',requiredText:'RESET',confirmLabel:'Reset everything'}))return;data=defaultStore();persist();selectedMonth=currentPeriodKey();render();toast('Your workspace has been reset.');}
  async function importJSONFile(file){try{const text=await file.text(),parsed=JSON.parse(text);if(!parsed||typeof parsed!=='object'||!['incomes','expenses','bills','debts','payments','categories'].every(k=>Array.isArray(parsed[k])))throw new Error('This file does not look like a Northstar backup.');if(!await confirmAction('Replace the data in this browser with the records from this backup?',{title:'Import backup',description:'Your current records will be replaced.',warning:'This cannot be undone unless you have exported a backup.',confirmLabel:'Import backup'}))return;const base=defaultStore();data={...base,...parsed,settings:{...base.settings,...(parsed.settings||{})}};persist();selectedMonth=currentPeriodKey();render();toast('Backup imported.');}catch(e){toast(e.message||'Could not read this backup file.',true);}finally{const input=document.getElementById('importFile');if(input)input.value='';}}

  document.addEventListener('click',async e=>{
    if(e.target.matches('[data-modal-backdrop]')){if(confirmResolver)resolveConfirm(false);else closeModal();return;}
    const target=e.target.closest('button,[data-close-modal]');if(!target)return;
    if(target.dataset.nav){if(modalRoot.firstElementChild&&!confirmResolver)closeModal();currentPage=target.dataset.nav;searchQuery='';render();view.focus({preventScroll:true});return;}
    if(target.id==='addTop'||target.id==='mobileAdd'){openQuickAdd();return;}
    if(target.dataset.add){openAdd(target.dataset.add);return;}
    if(target.dataset.closeModal!==undefined){if(confirmResolver)resolveConfirm(false);else closeModal();return;}
    if(target.dataset.confirmResult){if(target.dataset.confirmResult==='yes')resolveConfirm(true);else resolveConfirm(false);return;}
    if(target.dataset.action){const {action,kind,id}=target.dataset;
      if(action==='edit'){const collection=kind==='payment'?data.payments:data[`${kind}s`];const item=collection?.find(x=>x.id===id);if(kind==='expense')openExpenseForm(item);else if(kind==='income')openIncomeForm(item);else if(kind==='debt')openDebtForm(item);else if(kind==='bill')openBillForm(item);else if(kind==='payment')openPaymentForm(item?.debtId,item);}
      else if(action==='delete')await deleteRecord(kind,id);
      else if(action==='payment')openPaymentForm(id);
      else if(action==='mark-paid')await markDebtPaid(id);
      else if(action==='payment-history')showPaymentHistory(id);
      else if(action==='pay-bill')recordBillPayment(id);
      else if(action==='toggle-bill'){const b=data.bills.find(x=>x.id===id);if(b){b.enabled=!b.enabled;persist();render();toast(`${b.name} ${b.enabled?'enabled':'paused'}.`);}}
      else if(action==='delete-category')await deleteCategory(id);
      else if(action==='mobile-more')openMoreMenu();
      else if(action==='export-json')exportJSON();else if(action==='export-csv')exportCSV();
      else if(action==='import-json')document.getElementById('importFile')?.click();
      else if(action==='reset-data')await resetData();
      return;
    }
  });
  document.addEventListener('submit',e=>{
    const form=e.target;if(!(form instanceof HTMLFormElement))return;
    if(form.id==='recordForm'){e.preventDefault();saveRecord(form);return;}
    if(form.id==='categoryAddForm'){e.preventDefault();const input=form.elements.category,name=input.value.trim();if(!name)return;if(data.categories.some(c=>c.name.toLowerCase()===name.toLowerCase()))return toast('That category already exists.',true);data.categories.push({id:uid(),name,color:CATEGORY_COLORS[data.categories.length%CATEGORY_COLORS.length]});persist();render();toast(`${name} category added.`);return;}
  });
  document.addEventListener('input',e=>{
    if(e.target.id==='confirmPhrase'){const button=modalRoot.querySelector('[data-confirm-result="yes"]');if(button)button.disabled=e.target.value!==e.target.closest('.field').querySelector('label strong')?.textContent;}
    if(e.target.id==='listSearch'){searchQuery=e.target.value;const pos=e.target.selectionStart;render();const next=document.getElementById('listSearch');if(next){next.focus();next.setSelectionRange(pos,pos);}}
  });
  document.addEventListener('change',e=>{
    if(e.target===monthInput){selectedMonth=e.target.value||currentPeriodKey();render();return;}
    if(e.target.id==='currencySetting'){data.settings.currency=e.target.value;persist();render();toast('Currency updated.');return;}
    if(e.target.id==='themeSetting'){data.settings.theme=e.target.value;persist();render();toast('Appearance updated.');return;}
    if(e.target.id==='monthStartSetting'){data.settings.monthStart=Number(e.target.value);selectedMonth=currentPeriodKey();persist();render();toast('Monthly date range updated.');return;}
    if(e.target.id==='expenseCategoryFilter'||e.target.id==='transactionCategoryFilter'){listFilters.category=e.target.value;if(currentPage==='expenses')render();else render();return;}
    if(e.target.id==='typeFilter'){listFilters.type=e.target.value;render();return;}
    if(e.target.id==='amountFilter'){listFilters.amount=e.target.value;render();return;}
    if(e.target.id==='sortFilter'){listFilters.sort=e.target.value;render();return;}
    if(e.target.id==='importFile'&&e.target.files?.[0])importJSONFile(e.target.files[0]);
    if(e.target.name==='debtId'&&document.getElementById('remainingHint')){const d=data.debts.find(x=>x.id===e.target.value);document.getElementById('remainingHint').textContent=`Remaining balance: ${money(d?debtRemaining(d):0)}`;}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modalRoot.firstElementChild){if(confirmResolver)resolveConfirm(false);else closeModal();}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openQuickAdd();}});
  async function deleteCategory(id){const cat=data.categories.find(c=>c.id===id);if(!cat)return;const used=data.expenses.some(x=>x.category===cat.name)||data.bills.some(x=>x.category===cat.name);if(!await confirmAction(`Remove the “${cat.name}” category? Existing items will be moved to Other.`,{title:'Remove category',confirmLabel:'Remove'}))return;data.categories=data.categories.filter(c=>c.id!==id);if(!data.categories.some(c=>c.name==='Other'))data.categories.push({id:uid(),name:'Other',color:CATEGORY_COLORS[15]});for(const list of [data.expenses,data.bills])for(const item of list)if(item.category===cat.name)item.category='Other';persist();render();toast(`${cat.name} removed${used?'; existing items moved to Other':''}.`);}
  modalRoot.addEventListener('input',e=>{if(e.target.id==='confirmPhrase'){const yes=modalRoot.querySelector('[data-confirm-result="yes"]');const required=modalRoot.querySelector('.field label strong')?.textContent||'';if(yes)yes.disabled=e.target.value!==required;}});
  render();
})();
