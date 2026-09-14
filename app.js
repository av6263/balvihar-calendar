const STORAGE_KEY='cmbNewtonCalendarV1';
const weekdays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const types=['Event','Class','No Class'];

const demoData={
  settings:{schoolYear:'2026-27',classDay:0,startDate:'2026-09-13',endDate:'2027-06-27',defaultLocation:'Lasell'},
  locations:[
    {name:'Lasell',color:'#087c98'},
    {name:'Online',color:'#f2b512'},
    {name:'Andover',color:'#de7075'},
    {name:'No Class',color:'#ffffff',outline:'#334155'}
  ],
  events:[
    {id:'1',date:'2026-09-13',name:'Ganesh Pooja',type:'Event',location:'Lasell',showInList:true},
    {id:'2',date:'2026-09-27',name:'Open House',type:'Event',location:'Lasell',showInList:true},
    {id:'3',date:'2026-10-18',name:'Online Class',type:'Class',location:'Online',showInList:true},
    {id:'4',date:'2026-11-01',name:'Online Class',type:'Class',location:'Online',showInList:true},
    {id:'5',date:'2026-11-22',name:'Diwali Potluck',type:'Event',location:'Lasell',showInList:true},
    {id:'6',date:'2026-12-20',name:'Andover Mandir',type:'Event',location:'Andover',showInList:true},
    {id:'7',date:'2026-12-27',name:'No Class',type:'No Class',location:'No Class',showInList:false},
    {id:'8',date:'2027-01-03',name:'No Class',type:'No Class',location:'No Class',showInList:false},
    {id:'9',date:'2027-04-11',name:'Feedback Day',type:'Event',location:'Lasell',showInList:true},
    {id:'10',date:'2027-05-02',name:'Guru Paduka',type:'Event',location:'Lasell',showInList:true},
    {id:'11',date:'2027-05-16',name:'Holi Potluck',type:'Event',location:'Lasell',showInList:true},
    {id:'12',date:'2027-05-23',name:'Andover Mandir',type:'Event',location:'Andover',showInList:true},
    {id:'13',date:'2027-05-30',name:'No Class',type:'No Class',location:'No Class',showInList:false},
    {id:'14',date:'2027-06-13',name:'Annual Day Presentations',type:'Event',location:'Lasell',showInList:true}
  ]
};

let data=loadData();
function loadData(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||structuredClone(demoData)}catch{return structuredClone(demoData)}}
function saveData(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));renderAll()}
function parseDate(s){const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)}
function fmtDate(s){return parseDate(s).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}
function monthKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`}
function getLocation(name){return data.locations.find(x=>x.name===name)||{name,color:'#087c98'}}
function getEventByDate(iso){return data.events.find(e=>e.date===iso)}
function isoDate(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function escapeHtml(s=''){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]))}

function renderAll(){renderPublic();renderAdmin();}
function renderPublic(){
  document.querySelector('#publicTitle').textContent=`${data.settings.schoolYear} Calendar`;
  const start=parseDate(data.settings.startDate), end=parseDate(data.settings.endDate);
  const months=[]; let cursor=new Date(start.getFullYear(),start.getMonth(),1); const endMonth=new Date(end.getFullYear(),end.getMonth(),1);
  while(cursor<=endMonth){months.push(new Date(cursor));cursor.setMonth(cursor.getMonth()+1)}
  document.querySelector('#calendarGrid').innerHTML=months.map(renderMonth).join('');
  renderEventLists();renderLegend();
}
function renderMonth(monthDate){
  const y=monthDate.getFullYear(),m=monthDate.getMonth(); const first=new Date(y,m,1), last=new Date(y,m+1,0);
  const cells=[]; for(let i=0;i<first.getDay();i++)cells.push('<div class="day blank"></div>');
  const start=parseDate(data.settings.startDate), end=parseDate(data.settings.endDate);
  for(let d=1;d<=last.getDate();d++){
    const date=new Date(y,m,d), iso=isoDate(date), evt=getEventByDate(iso); const active=date>=start&&date<=end;
    let cls='day', style=''; let title='';
    if(active && date.getDay()===Number(data.settings.classDay)){cls+=' class-day'}
    if(evt){title=evt.name;const loc=getLocation(evt.location); if(evt.type==='No Class'){cls='day no-class';style=`border-color:${loc.outline||'#334155'}`}else{cls='day special';style=`background:${loc.color};color:${contrast(loc.color)}`}}
    cells.push(`<div class="${cls}" style="${style}" title="${escapeHtml(title)}">${d}${evt&&evt.type!=='No Class'?'<span class="dot"></span>':''}</div>`)
  }
  return `<section class="month card"><div class="month-title">${monthDate.toLocaleDateString(undefined,{month:'long'}).toUpperCase()} ${y}</div><div class="month-body"><div class="weekdays">${['S','M','T','W','T','F','S'].map(x=>`<div>${x}</div>`).join('')}</div><div class="days">${cells.join('')}</div></div></section>`
}
function contrast(hex){if(!hex||hex==='#ffffff')return '#10223d';const c=hex.replace('#','');const r=parseInt(c.slice(0,2),16),g=parseInt(c.slice(2,4),16),b=parseInt(c.slice(4,6),16);return (r*299+g*587+b*114)/1000>160?'#10223d':'#ffffff'}
function renderEventLists(){
  const events=data.events.filter(e=>e.showInList).sort((a,b)=>a.date.localeCompare(b.date));
  const fall=events.filter(e=>parseDate(e.date).getMonth()>=8); const spring=events.filter(e=>parseDate(e.date).getMonth()<8);
  const rows=arr=>arr.map(e=>`<div class="event-row"><span>${parseDate(e.date).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span><strong>${escapeHtml(e.name)}</strong><span>${escapeHtml(e.location)}</span></div>`).join('')||'<p class="muted">No events</p>';
  document.querySelector('#fallEvents').innerHTML=rows(fall);document.querySelector('#springEvents').innerHTML=rows(spring);
}
function renderLegend(){document.querySelector('#legend').innerHTML=data.locations.map(l=>`<div class="legend-item"><span class="swatch" style="background:${l.color};${l.outline?`border:2px solid ${l.outline}`:''}"></span><span>${escapeHtml(l.name)}</span></div>`).join('')}

function renderAdmin(){
  const s=data.settings;schoolYear.value=s.schoolYear;startDate.value=s.startDate;endDate.value=s.endDate;
  classDay.innerHTML=weekdays.map((d,i)=>`<option value="${i}" ${Number(s.classDay)===i?'selected':''}>${d}</option>`).join('');
  defaultLocation.innerHTML=data.locations.filter(l=>l.name!=='No Class').map(l=>`<option ${s.defaultLocation===l.name?'selected':''}>${escapeHtml(l.name)}</option>`).join('');
  eventType.innerHTML=types.map(t=>`<option>${t}</option>`).join('');
  eventLocation.innerHTML=data.locations.map(l=>`<option>${escapeHtml(l.name)}</option>`).join('');
  filterType.innerHTML='<option value="">All Types</option>'+types.map(t=>`<option>${t}</option>`).join('');
  filterLocation.innerHTML='<option value="">All Locations</option>'+data.locations.map(l=>`<option>${escapeHtml(l.name)}</option>`).join('');
  renderEventsTable();renderLocations();
}
function renderEventsTable(){
  const q=(searchInput.value||'').toLowerCase(),ft=filterType.value,fl=filterLocation.value;
  const rows=data.events.filter(e=>(!q||`${e.name} ${e.location} ${e.type}`.toLowerCase().includes(q))&&(!ft||e.type===ft)&&(!fl||e.location===fl)).sort((a,b)=>a.date.localeCompare(b.date));
  eventsTable.innerHTML=rows.map(e=>`<tr><td>${fmtDate(e.date)}</td><td>${escapeHtml(e.name)}</td><td>${e.type}</td><td>${escapeHtml(e.location)}</td><td class="actions"><button class="link-btn" data-edit="${e.id}">Edit</button> <button class="link-btn delete" data-delete="${e.id}">Delete</button></td></tr>`).join('')||'<tr><td colspan="5" class="muted">No matching events.</td></tr>';
}
function renderLocations(){locationsList.innerHTML=data.locations.map(l=>`<div class="location-row"><span class="location-dot" style="background:${l.color};${l.outline?`border:2px solid ${l.outline}`:''}"></span><strong>${escapeHtml(l.name)}</strong><button class="link-btn delete" data-delete-location="${escapeHtml(l.name)}">Delete</button></div>`).join('')}

function switchView(which){publicView.classList.toggle('active',which==='public');adminView.classList.toggle('active',which==='admin');publicViewBtn.classList.toggle('primary',which==='public');adminViewBtn.classList.toggle('primary',which==='admin')}
publicViewBtn.onclick=()=>switchView('public');adminViewBtn.onclick=()=>switchView('admin');printBtn.onclick=()=>window.print();

document.querySelectorAll('.nav-link').forEach(b=>b.onclick=()=>{document.querySelectorAll('.nav-link').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));document.querySelector('#'+b.dataset.panel).classList.add('active')});

function openEvent(evt=null){eventDialogTitle.textContent=evt?'Edit Event':'Add Event';eventId.value=evt?.id||'';eventDate.value=evt?.date||data.settings.startDate;eventName.value=evt?.name||'';eventType.value=evt?.type||'Event';eventLocation.value=evt?.location||data.settings.defaultLocation;showInList.checked=evt?evt.showInList:true;eventDialog.showModal()}
addEventBtn.onclick=()=>openEvent();cancelEventBtn.onclick=closeEventDialog.onclick=()=>eventDialog.close();
eventForm.addEventListener('submit',e=>{e.preventDefault();const obj={id:eventId.value||crypto.randomUUID(),date:eventDate.value,name:eventName.value.trim(),type:eventType.value,location:eventType.value==='No Class'?'No Class':eventLocation.value,showInList:showInList.checked};const ix=data.events.findIndex(x=>x.id===obj.id);if(ix>=0)data.events[ix]=obj;else data.events.push(obj);eventDialog.close();saveData()});

eventsTable.addEventListener('click',e=>{const edit=e.target.dataset.edit,del=e.target.dataset.delete;if(edit)openEvent(data.events.find(x=>x.id===edit));if(del&&confirm('Delete this event?')){data.events=data.events.filter(x=>x.id!==del);saveData()}});
[searchInput,filterType,filterLocation].forEach(el=>el.addEventListener(el.tagName==='INPUT'?'input':'change',renderEventsTable));

settingsForm.addEventListener('submit',e=>{e.preventDefault();data.settings={...data.settings,schoolYear:schoolYear.value.trim(),classDay:Number(classDay.value),startDate:startDate.value,endDate:endDate.value,defaultLocation:defaultLocation.value};saveData();alert('School year settings saved.')});
duplicateYearBtn.onclick=()=>{const s=data.settings;const start=parseDate(s.startDate),end=parseDate(s.endDate);start.setFullYear(start.getFullYear()+1);end.setFullYear(end.getFullYear()+1);const parts=s.schoolYear.match(/(\d{4}).*?(\d{2,4})/);const next=parts?`${Number(parts[1])+1}-${String(Number(parts[1])+2).slice(-2)}`:`${new Date().getFullYear()+1}-${String(new Date().getFullYear()+2).slice(-2)}`;data.settings.schoolYear=next;data.settings.startDate=isoDate(start);data.settings.endDate=isoDate(end);data.events=data.events.map(e=>{const d=parseDate(e.date);d.setFullYear(d.getFullYear()+1);return {...e,id:crypto.randomUUID(),date:isoDate(d)}});saveData();alert('School year duplicated forward by one year. Review dates and events before publishing.')};

addLocationBtn.onclick=()=>locationDialog.showModal();cancelLocationBtn.onclick=closeLocationDialog.onclick=()=>locationDialog.close();
locationForm.addEventListener('submit',e=>{e.preventDefault();const name=locationName.value.trim();if(data.locations.some(l=>l.name.toLowerCase()===name.toLowerCase()))return alert('That location already exists.');data.locations.push({name,color:locationColor.value});locationName.value='';locationDialog.close();saveData()});
locationsList.addEventListener('click',e=>{const name=e.target.dataset.deleteLocation;if(!name)return;if(name==='No Class')return alert('The No Class item is required.');if(data.events.some(x=>x.location===name))return alert('This location is used by existing events. Change those events first.');if(confirm(`Delete ${name}?`)){data.locations=data.locations.filter(l=>l.name!==name);saveData()}});

exportBtn.onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`chinmaya-calendar-${data.settings.schoolYear}.json`;a.click();URL.revokeObjectURL(a.href)};
importInput.onchange=async()=>{const file=importInput.files[0];if(!file)return;try{const imported=JSON.parse(await file.text());if(!imported.settings||!Array.isArray(imported.events)||!Array.isArray(imported.locations))throw new Error('Invalid structure');data=imported;saveData();alert('Calendar data imported successfully.')}catch(err){alert('Could not import that file. Please use a calendar JSON exported from this app.')}finally{importInput.value=''}};
resetBtn.onclick=()=>{if(confirm('Reset all changes and restore the original demo calendar?')){data=structuredClone(demoData);saveData()}};

renderAll();
