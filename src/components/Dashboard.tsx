// src/components/Dashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { Share2, Info, Zap, Trees, Users } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function Dashboard({ refreshTrigger }: { refreshTrigger: number }) {
  const [metrics, setMetrics] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<number[]>(new Array(12).fill(0));
  const [energyKwh, setEnergyKwh] = useState(0);
  const [treesNeeded, setTreesNeeded] = useState(0);
  const [friendsData, setFriendsData] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      // 1. Cargar Mis Datos
      const res = await fetch('/api/activities');
      const data = await res.json();
      if (data.success) {
        setMetrics(data);
        processMonthlyData(data.activities);
        const energyCo2 = data.breakdown['Energía'] || 0;
        setEnergyKwh(energyCo2 / 0.45);
        setTreesNeeded(data.total / 22);
      }

      // 2. Cargar Datos de Amigos
      const resFriends = await fetch('/api/friends');
      const dataFriends = await resFriends.json();
      if (dataFriends.friends) {
        setFriendsData(dataFriends.friends);
      }

    } catch (error) {
      console.error("Error cargando dashboard:", error);
    }
  };

  const processMonthlyData = (activities: any[]) => {
    const monthlyTotals = new Array(12).fill(0);
    activities.forEach((act: any) => {
      const date = new Date(act.date);
      const monthIndex = date.getMonth();
      monthlyTotals[monthIndex] += act.carbonAmount;
    });
    setMonthlyData(monthlyTotals);
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleShare = async () => {
    const shareData = {
      title: 'Zero-Impact',
      text: `¡Mi huella de carbono es de ${metrics?.total.toFixed(1)} kg CO2eq! 🌳`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        alert('Copia este mensaje: ' + shareData.text);
      }
    } catch (err) { console.log(err); }
  };

  if (!metrics) return <div className="p-8 text-center text-gray-500 animate-pulse">Cargando tu impacto...</div>;

  // --- CONSTRUCCIÓN DINÁMICA DE DATASETS ---
  
  // SOLUCIÓN AQUÍ: Agregamos ': any[]' para que TypeScript acepte cualquier estructura
  const datasets: any[] = [
    {
      label: 'Tú',
      data: monthlyData,
      borderColor: 'rgb(245, 158, 11)', // Naranja
      backgroundColor: 'white',
      pointBackgroundColor: 'white',
      pointBorderColor: 'rgb(245, 158, 11)',
      pointBorderWidth: 2,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 4,
      fill: false,
      order: 1
    },
    {
      label: 'Promedio MX',
      data: [300, 310, 290, 320, 330, 340, 350, 330, 320, 340, 360, 350], 
      borderColor: 'rgb(20, 184, 166)', // Verde Azulado
      backgroundColor: 'rgba(20, 184, 166, 0.05)',
      pointBackgroundColor: 'white',
      pointBorderColor: 'rgb(20, 184, 166)',
      pointBorderWidth: 2,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 4,
      borderDash: [5, 5],
      order: 3
    },
  ];

  // 2. Agregar Amigos (Ahora sin errores rojos)
  const friendColors = ['rgb(59, 130, 246)', 'rgb(168, 85, 247)', 'rgb(236, 72, 153)'];

  friendsData.forEach((friend, index) => {
    datasets.push({
      label: friend.name.split(' ')[0],
      data: friend.data,
      borderColor: friendColors[index % friendColors.length],
      backgroundColor: 'transparent',
      pointBackgroundColor: 'white',
      pointBorderColor: friendColors[index % friendColors.length],
      pointBorderWidth: 2,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 3,
      fill: false,
      order: 2,
      borderDash: [] 
    });
  });

  const lineChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: datasets
  };

  const lineOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { left: 20, right: 50, top: 50, bottom: 10 } },
    animation: {
        y: { duration: 2000, from: 500 },
        delay: (context: any) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default') {
                delay = context.dataIndex * 150 + context.datasetIndex * 100;
            }
            return delay;
        },
    },
    plugins: {
      legend: { position: 'top', align: 'end', labels: { usePointStyle: true, boxWidth: 10 } },
      title: { display: false },
      tooltip: {
        usePointStyle: true,
        callbacks: {
            label: function(context: any) {
                return ` ${context.dataset.label}: ${context.parsed.y} kg CO2eq`;
            }
        }
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: '#f3f4f6' },
        title: { display: true, text: 'Emisiones (kg CO2eq)', color: '#9ca3af', font: { size: 11, weight: 'bold' } }
      },
      x: { grid: { display: false } }
    }
  };

  const doughnutData = {
    labels: Object.keys(metrics.breakdown || {}),
    datasets: [{
        data: Object.values(metrics.breakdown || {}),
        backgroundColor: ['rgba(245, 158, 11, 0.8)', 'rgba(20, 184, 166, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(59, 130, 246, 0.8)', '#a855f7'],
        borderWidth: 0,
        hoverOffset: 5
    }],
  };

  const doughnutOptions: any = {
    cutout: '60%',
    layout: { padding: 20 },
    plugins: { 
      legend: { display: false },
      tooltip: { 
        yAlign: 'bottom', displayColors: true,
        callbacks: { label: function(context: any) { const label = context.label || ''; const value = context.parsed || 0; return ` ${label}: ${value.toFixed(2)} kg CO2eq`; } }
      }
    },
    animation: { animateScale: true, animateRotate: true, duration: 2000, easing: 'easeOutBounce' },
    hoverOffset: 5 
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      {/* Encabezado */}
      <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-stone-50 to-white flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: 'monospace' }}>MI HUELLA DE CARBONO</h2>
        {friendsData.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            <Users size={14} />
            {friendsData.length} Amigos conectados
          </div>
        )}
      </div>

      <div className="p-6 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-full min-h-[400px] relative">
           <Line options={lineOptions} data={lineChartData} />
        </div>
        <div className="lg:col-span-1 flex flex-col justify-center items-center relative">
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 w-full max-w-[250px] text-center transition hover:scale-105 duration-300">
            <span className="text-xs text-gray-400 uppercase font-bold">Total Acumulado</span>
            <div className="text-3xl font-bold text-slate-800 my-2">
              {(metrics.total / 1000).toFixed(2)} <span className="text-sm text-gray-500 font-normal">tnCO2eq</span>
            </div>
            <div className="w-56 h-56 mx-auto mt-4 relative">
               {metrics.total === 0 ? <div className="h-full flex items-center justify-center text-xs text-gray-400">Sin datos</div> : <Doughnut data={doughnutData} options={doughnutOptions} />}
            </div>
            <div className="mt-4 text-left text-xs space-y-1 pl-4">
              {Object.keys(metrics.breakdown || {}).map((cat, idx) => (
                <div key={cat} className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[idx] }}></div>
                   <span className="text-gray-500 capitalize">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#e6f4ed] p-8 grid md:grid-cols-3 gap-8 items-center">
        <div>
          <h4 className="font-bold text-slate-700 flex items-center gap-2"><Zap size={18} className="text-yellow-500"/> Energía Estimada</h4>
          <p className="text-xs text-slate-500 mb-1">Basado en tu huella energética:</p>
          <div className="text-2xl font-bold text-emerald-700">{energyKwh.toFixed(1)} <span className="text-sm font-normal text-slate-600">kWh</span></div>
        </div>
        <div>
          <h4 className="font-bold text-slate-700 flex items-center gap-2"><Trees size={18} className="text-green-600"/> Compensación</h4>
          <p className="text-xs text-slate-500 mb-2 leading-tight">Se necesitarían aprox. <strong className="text-emerald-800">{Math.ceil(treesNeeded)} árboles</strong> adultos para absorber tu generación de CO2eq anual.</p>
          <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all duration-[2000ms] ease-out" style={{ width: `${Math.min(treesNeeded, 100)}%` }}></div></div>
        </div>
        <div className="bg-white/60 p-4 rounded-xl border border-emerald-100">
          <h4 className="font-bold text-slate-700 mb-1 text-sm">Comparte tus Métricas</h4>
          <div className="flex gap-2 mt-2">
            <button onClick={handleShare} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition"><Share2 size={14} /> Compartir</button>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-2 transition"><Info size={14} /> Soporte</button>
          </div>
        </div>
      </div>
    </div>
  );
}