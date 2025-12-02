document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('tourUser'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('userNameDisplay').textContent = user.nombre;
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('tourUser');
        window.location.href = 'index.html';
    });

    initCalendar();
    loadTours();
    loadMyBookings(user.id);
});

let calendar;

function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: async function(info, successCallback, failureCallback) {
            try {
                const response = await fetch('http://localhost:3000/api/tours');
                const tours = await response.json();
                const events = tours.map(t => ({
                    title: t.tipo,
                    start: t.fechaInicio,
                    end: new Date(new Date(t.fechaInicio).getTime() + t.duracion * 60000).toISOString(),
                    color: '#22c55e'
                }));
                successCallback(events);
            } catch (error) {
                failureCallback(error);
            }
        }
    });
    calendar.render();
}

async function loadTours() {
    try {
        const response = await fetch('http://localhost:3000/api/tours');
        const tours = await response.json();
        const list = document.getElementById('toursList');
        
        list.innerHTML = tours.map(t => `
            <div class="bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-primary-500 transition">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-bold text-white">${t.tipo}</h4>
                        <p class="text-sm text-gray-400">${new Date(t.fechaInicio).toLocaleString()}</p>
                        <p class="text-xs text-gray-500">${t.duracion} mins</p>
                    </div>
                    <button onclick="bookTour(${t.idRecorrido})" class="bg-primary-600 hover:bg-primary-500 text-white px-3 py-1 rounded text-sm font-medium">Book</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading tours:', error);
    }
}

async function bookTour(tourId) {
    const user = JSON.parse(localStorage.getItem('tourUser'));
    if(!confirm('Confirm booking for this tour?')) return;

    try {
        const response = await fetch('http://localhost:3000/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idParticipante: user.id, idRecorrido: tourId })
        });
        
        if (response.ok) {
            alert('Tour booked successfully!');
            loadMyBookings(user.id);
            calendar.refetchEvents(); // Refresh calendar if we want to show booked status differently
        } else {
            alert('Failed to book tour.');
        }
    } catch (error) {
        console.error('Booking error:', error);
    }
}
window.bookTour = bookTour;

async function loadMyBookings(userId) {
    // Ideally we have an endpoint for this, but for MVP we can filter participants list or add a new endpoint.
    // Let's use the participants endpoint which joins with tours.
    try {
        const response = await fetch('http://localhost:3000/api/participants');
        const users = await response.json();
        const me = users.find(u => u.idParticipante === userId);
        
        const container = document.getElementById('myBookings');
        if (me && me.tourType) {
            container.innerHTML = `
                <div class="bg-primary-900/30 p-3 rounded border border-primary-500/50">
                    <h4 class="font-bold text-primary-300">${me.tourType}</h4>
                    <p class="text-sm text-gray-300">Status: Confirmed</p>
                </div>
            `;
        } else {
            container.innerHTML = '<p class="text-gray-400 text-sm">No active bookings.</p>';
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}
