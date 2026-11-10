import React, { useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/db';

type Kind = 'OFREZCO' | 'NECESITO';
type State = 'pendiente' | 'publicado' | 'rechazado' | 'cerrado';
type Item = { id:string; companyId:string; kind:Kind; title:string; description:string; material:string; quantity:number; unit:string; condition:string; mode:string; regulated:boolean; state:State; createdAt:string; reviewedBy?:string; };
type Request = {id:string; itemId:string; companyId:string; state:'pendiente'|'aprobada'|'rechazada'; createdAt:string; reviewedBy?:string};
const ITEMS='uio_simbiosis_items_v1', REQUESTS='uio_simbiosis_requests_v1';
function load<T,>(key:string):T[]{ try { const value=JSON.parse(localStorage.getItem(key)||'[]'); return Array.isArray(value)?value:[]; }catch{return [];} }
const uid=()=>crypto.randomUUID();
export function SimbiosisView(){
 const {currentUser,currentCompany}=useAuth();
 const [items,setItems]=useState<Item[]>(()=>load<Item>(ITEMS));
 const [requests,setRequests]=useState<Request[]>(()=>load<Request>(REQUESTS));
 const [kind,setKind]=useState<Kind>('OFREZCO');
 const [title,setTitle]=useState(''); const [description,setDescription]=useState(''); const [material,setMaterial]=useState('');
 const [quantity,setQuantity]=useState(''); const [unit,setUnit]=useState('kg'); const [condition,setCondition]=useState(''); const [mode,setMode]=useState('donación'); const [regulated,setRegulated]=useState(false);
 const [query,setQuery]=useState(''); const [message,setMessage]=useState('');
 const [kindFilter,setKindFilter]=useState<'TODOS'|Kind>('TODOS'); const [statusFilter,setStatusFilter]=useState<'TODOS'|State>('TODOS');
 const admin=currentUser?.role==='admin', companyId=currentUser?.company_id;
 const saveItems=(next:Item[])=>{setItems(next);localStorage.setItem(ITEMS,JSON.stringify(next));};
 const saveRequests=(next:Request[])=>{setRequests(next);localStorage.setItem(REQUESTS,JSON.stringify(next));};
 const publish=(e:React.FormEvent)=>{e.preventDefault();if(!companyId||!title.trim()||!material.trim()||!Number.isFinite(Number(quantity))||Number(quantity)<=0){setMessage('Complete los campos obligatorios y una cantidad válida.');return;}
  const item:Item={id:uid(),companyId,kind,title:title.trim(),description:description.trim(),material:material.trim(),quantity:Number(quantity),unit,condition,mode,regulated,state:'pendiente',createdAt:new Date().toISOString()};
  saveItems([item,...items]);setTitle('');setDescription('');setMaterial('');setQuantity('');setRegulated(false);setMessage('Publicación enviada a revisión EHS.');
 };
 const review=(id:string,state:State)=>{if(!admin)return;saveItems(items.map(x=>x.id===id?{...x,state,reviewedBy:currentUser!.id}:x));};
 const request=(item:Item)=>{if(!companyId||companyId===item.companyId||item.state!=='publicado'||item.regulated)return;
  if(requests.some(x=>x.itemId===item.id&&x.companyId===companyId&&x.state==='pendiente'))return;
  saveRequests([{id:uid(),itemId:item.id,companyId,state:'pendiente',createdAt:new Date().toISOString()},...requests]);setMessage('Solicitud enviada a EHS.');
 };
 const reviewRequest=(id:string,state:'aprobada'|'rechazada')=>{if(!admin)return;const target=requests.find(x=>x.id===id);const item=items.find(x=>x.id===target?.itemId);if(!target||!item||item.state!=='publicado'||item.regulated){setMessage('No se puede aprobar: la publicación no está disponible o requiere gestión especial.');return;}saveRequests(requests.map(x=>x.id===id?{...x,state,reviewedBy:currentUser!.id}:x));setMessage('Solicitud revisada. La aprobación no autoriza por sí sola la entrega física.');};
 const visible=useMemo(()=>items.filter(x=>(admin||x.state==='publicado'||x.companyId===companyId)&&(kindFilter==='TODOS'||x.kind===kindFilter)&&(statusFilter==='TODOS'||x.state===statusFilter)&&[x.title,x.material,x.description].join(' ').toLowerCase().includes(query.trim().toLowerCase())).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)),[items,admin,companyId,query,kindFilter,statusFilter]);
 const matches=(item:Item)=>items.filter(x=>x.id!==item.id&&x.companyId!==item.companyId&&x.kind!==item.kind&&x.material.trim().toLowerCase()===item.material.trim().toLowerCase()&&x.unit===item.unit&&x.state==='publicado'&&!x.regulated);
 return <section className="space-y-5">
 <header className="bg-emerald-900 text-white rounded-2xl p-6"><h1 className="text-2xl font-bold">Simbiosis empresarial UIO</h1><p className="text-sm mt-2">Intercambio interno de recursos entre empresas y operadores aeroportuarios, sujeto a aprobación EHS.</p></header>
 <div className="bg-amber-50 border border-amber-300 text-amber-950 rounded-xl p-4 text-sm"><strong>Entorno piloto:</strong> los registros se guardan únicamente en este navegador. No existe autenticación ni autorización de servidor para este módulo. No utilizar con datos sensibles ni para autorizar transferencias reales hasta integrar Supabase Auth, RLS y auditoría persistente. Los materiales regulados requieren gestión separada.</div>
 {message&&<p role="status" className="p-3 bg-slate-100 rounded-xl">{message}</p>}
 {currentUser?.role==='empresa'&&<form onSubmit={publish} className="bg-white border rounded-2xl p-5 space-y-3"><h2 className="font-bold">Nueva oportunidad · {currentCompany?.commercial_name}</h2>
 <div className="flex gap-3"><label><input type="radio" checked={kind==='OFREZCO'} onChange={()=>setKind('OFREZCO')}/> OFREZCO</label><label><input type="radio" checked={kind==='NECESITO'} onChange={()=>setKind('NECESITO')}/> NECESITO</label></div>
 <input aria-label="Título" required maxLength={120} placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} className="w-full border rounded-lg p-2"/>
 <input aria-label="Material" required maxLength={100} placeholder="Material (ej. pallets)" value={material} onChange={e=>setMaterial(e.target.value)} className="w-full border rounded-lg p-2"/>
 <textarea aria-label="Descripción" maxLength={1000} placeholder="Descripción y condiciones de entrega" value={description} onChange={e=>setDescription(e.target.value)} className="w-full border rounded-lg p-2"/>
 <div className="flex gap-2"><input aria-label="Cantidad" required min="0.01" step="any" type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} className="w-1/2 border rounded-lg p-2"/><select aria-label="Unidad" value={unit} onChange={e=>setUnit(e.target.value)} className="border rounded-lg p-2"><option>kg</option><option>unidades</option><option>m³</option></select></div>
 <input aria-label="Estado del material" placeholder="Estado del material" value={condition} onChange={e=>setCondition(e.target.value)} className="w-full border rounded-lg p-2"/>
 <select aria-label="Modalidad" value={mode} onChange={e=>setMode(e.target.value)} className="border rounded-lg p-2"><option>donación</option><option>intercambio</option><option>préstamo</option></select>
 <label className="block text-sm"><input type="checkbox" checked={regulated} onChange={e=>setRegulated(e.target.checked)}/> Material peligroso, sanitario o sujeto a gestión regulada</label>
 {regulated&&<p className="text-red-700 text-sm">No se permitirá publicar ni solicitar transferencias de este material. EHS deberá gestionar su ruta autorizada.</p>}
 <button className="bg-emerald-800 text-white rounded-lg px-4 py-2">Enviar a revisión EHS</button></form>}
 <div className="bg-white border rounded-2xl p-5"><h2 className="font-bold mb-3">Catálogo interno</h2><input aria-label="Buscar oportunidades" placeholder="Buscar material u oportunidad" value={query} onChange={e=>setQuery(e.target.value)} className="w-full border rounded-lg p-2 mb-4"/>
 <div className="flex flex-wrap gap-2 mb-4"><select aria-label="Filtrar por tipo" value={kindFilter} onChange={e=>setKindFilter(e.target.value as typeof kindFilter)} className="border rounded-lg p-2"><option value="TODOS">Todas las oportunidades</option><option value="OFREZCO">Ofrezco</option><option value="NECESITO">Necesito</option></select><select aria-label="Filtrar por estado" value={statusFilter} onChange={e=>setStatusFilter(e.target.value as typeof statusFilter)} className="border rounded-lg p-2"><option value="TODOS">Todos los estados</option><option value="publicado">Publicadas</option><option value="pendiente">Pendientes</option><option value="rechazado">Rechazadas</option><option value="cerrado">Cerradas</option></select><button className="border rounded-lg px-3" onClick={()=>{setQuery('');setKindFilter('TODOS');setStatusFilter('TODOS');}}>Limpiar filtros</button></div><p className="text-xs text-slate-500 mb-3" role="status">{visible.length} oportunidad(es) encontradas</p>{visible.length===0&&<p className="text-slate-500">No encontramos oportunidades con estos filtros. Prueba otro material o limpia los filtros.</p>}
 <div className="grid md:grid-cols-2 gap-3">{visible.map(item=><article key={item.id} className="border rounded-xl p-4 space-y-2"><div className="flex justify-between gap-2"><strong>{item.kind}: {item.title}</strong><span className="text-xs">{item.state}</span></div>
 <p className="text-sm">{item.material} · {item.quantity} {item.unit} · {item.mode}</p><p className="text-sm text-slate-600">{item.description}</p><p className="text-xs">Empresa: {db.getCompany(item.companyId)?.commercial_name||'Operador registrado'} · {item.condition}</p>
 {item.regulated&&<p className="text-red-700 text-sm">Material regulado: no transferible mediante este catálogo.</p>}{item.companyId===companyId&&item.state==='pendiente'&&<p className="text-amber-800 text-xs">Tu publicación está en revisión EHS.</p>}{item.companyId===companyId&&item.state==='rechazado'&&<p className="text-red-700 text-xs">Publicación rechazada. Consulta a EHS antes de volver a enviarla.</p>}
 {item.state==='publicado'&&matches(item).length>0&&<p className="text-emerald-700 text-sm">{matches(item).length} posible(s) coincidencia(s) por material; verificar compatibilidad.</p>}
 {admin&&item.state==='pendiente'&&<div className="flex gap-2"><button onClick={()=>review(item.id,item.regulated?'rechazado':'publicado')} className="bg-emerald-700 text-white rounded px-3 py-1"> {item.regulated?'Rechazar regulado':'Aprobar publicación'}</button><button onClick={()=>review(item.id,'rechazado')} className="border rounded px-3 py-1">Rechazar</button></div>}
 {currentUser?.role==='empresa'&&item.state==='publicado'&&item.companyId!==companyId&&!item.regulated&&<button onClick={()=>request(item)} className="bg-emerald-800 text-white rounded px-3 py-2">Solicitar intercambio</button>}
 {admin&&item.state==='publicado'&&<button onClick={()=>review(item.id,'cerrado')} className="border rounded px-3 py-1">Cerrar</button>}
 </article>)}</div></div>
 {admin&&<div className="bg-white border rounded-2xl p-5"><h2 className="font-bold mb-3">Solicitudes pendientes de aprobación EHS</h2>{requests.filter(x=>x.state==='pendiente').length===0&&<p className="text-slate-500">Sin solicitudes pendientes.</p>}{requests.filter(x=>x.state==='pendiente').map(x=><div key={x.id} className="border-b py-3 flex flex-wrap gap-2 items-center justify-between"><span className="text-sm">{items.find(i=>i.id===x.itemId)?.title||'Oportunidad no disponible'} · {db.getCompany(x.companyId)?.commercial_name||x.companyId}</span><div className="flex gap-2"><button className="bg-emerald-800 text-white rounded px-3 py-1" onClick={()=>reviewRequest(x.id,'aprobada')}>Aprobar solicitud</button><button className="border rounded px-3 py-1" onClick={()=>reviewRequest(x.id,'rechazada')}>Rechazar</button></div></div>)}</div>}
 </section>;
}
