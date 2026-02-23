// ── 1. SECURITY GATEKEEPER ──
const ADMIN_PASSWORD = "BuffsAdmin2026!"; 

function checkAccess() {
		const entry = prompt("Enter Admin Access Key:");
		if (entry !== ADMIN_PASSWORD) {
				alert("Access Denied.");
				window.location.href = "/";
				return false;
		}
		return true;
}

// ── 2. SUPABASE CONFIG ──
const SUPABASE_URL = 'https://doehqqwqwjebhfgdvyum.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZZ4mKcw6_e9diz7oFfbVag_YA9zkqFW';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
	auth: { persistSession: false, autoRefreshToken: false }
});

// ── 3. AUTO-GENERATE UI ──
function buildAdminUI() {
		const main = document.body;
		main.style.cssText = "padding: 40px 20px; background-color: #FAF7F2; min-height: 100vh; margin: 0; font-family: 'DM Sans', sans-serif;";

		const header = document.createElement('div');
		header.style.cssText = "max-width: 1000px; margin: 0 auto 30px; font-family: 'Playfair Display', serif;";
		header.innerHTML = `
			<div style="display:flex; justify-content:space-between; align-items:center;">
				<div>
					<h1 style="font-size: 2.5rem; margin-bottom: 5px;">Admin Approval Portal</h1>
					<p style="color: #8A7D6B;">Reviewing all <strong>Pending</strong> submissions.</p>
				</div>
				<button onclick="loadPending()" style="background:#E0D5C0; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:600;">🔄 Refresh List</button>
			</div>
		`;
		main.appendChild(header);

		const listContainer = document.createElement('div');
		listContainer.id = 'pending-list';
		listContainer.style.cssText = "max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 20px;";
		main.appendChild(listContainer);
}

// ── 4. LOAD LISTINGS ──
async function loadPending() {
	const listContainer = document.getElementById('pending-list');
	listContainer.innerHTML = '<p>Searching for pending listings...</p>';

	const { data: listings, error } = await supabaseClient
		.from('listings')
		.select('*')
		.eq('status', 'pending')
		.order('created_at', { ascending: true });

	if (error) {
		listContainer.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
		return;
	}

	if (listings.length === 0) {
		listContainer.innerHTML = `<div style="padding: 60px; border: 2px dashed #E0D5C0; text-align: center; border-radius: 16px; color: #8A7D6B;">🎉 All caught up! No pending listings.</div>`;
		return;
	}

		listContainer.innerHTML = '';

	listings.forEach(item => {
		const photo = (item.photo_urls && item.photo_urls.length > 0) ? item.photo_urls[0] : 'https://via.placeholder.com/150x100?text=No+Photo';
		const photoNote = (item.photo_notes && item.photo_notes.length > 0) ? item.photo_notes[0] : '';
    
		const card = document.createElement('div');
		card.id = `card-${item.id}`;
		card.style.cssText = "display: grid; grid-template-columns: 180px 1fr auto; gap: 24px; background: white; padding: 24px; border-radius: 16px; border: 1px solid #E0D5C0; align-items: center; box-shadow: 0 2px 12px rgba(28,24,16,0.05);";

		card.innerHTML = `
			<div>
				<img src="${photo}" style="width: 180px; height: 120px; object-fit: cover; border-radius: 8px; display:block;">
				${photoNote ? `<div style="font-size:0.85rem;color:#4A4035;margin-top:8px;">Photo note: ${photoNote}</div>` : ''}
			</div>
			<div>
				<div style="font-weight: 700; font-size: 1.2rem; color: #1C1810;">$${item.monthly_rent} — ${item.address}</div>
				<div style="font-size: 0.85rem; color: #4A4035; margin-top: 6px; line-height: 1.5;">
						<strong>Lister:</strong> ${item.first_name} ${item.last_name || ''}<br>
						<strong>Email:</strong> ${item.email}
				</div>
				<div style="margin-top:12px;">
						<a href="/?preview=${item.id}" target="_blank" style="font-size: 0.8rem; color: #B8922A; font-weight: 600; text-decoration: none; border: 1px solid #B8922A; padding: 5px 12px; border-radius: 6px;">View Full Preview ↗</a>
				</div>
			</div>
			<div style="display: flex; flex-direction: column; gap: 10px; min-width: 180px;">
				<button id="app-${item.id}" onclick="handleApprove('${item.id}')" style="background: #3D8A58; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">Approve ✅</button>
        
				<button onclick="window.location.href='mailto:${item.email}?subject=Action Required: Your SubSwap Listing&body=Hi ${item.first_name},%0D%0A%0D%0AThanks for posting your listing at ${item.address}! Before we can approve it, we need you to fix the following:%0D%0A%0D%0A-%20[Add fix here]%0D%0A%0D%0AOnce updated, let us know!%0D%0A%0D%0ABest,%0D%0ASubSwap Team'" 
					 style="background: #FAF7F2; color: #B8922A; border: 1px solid #B8922A; padding: 12px; border-radius: 8px; cursor: pointer; text-align: center; font-size: 0.85rem; font-weight: 600;">
					 Contact Lister ✉️
				</button>

				<button id="rej-${item.id}" onclick="handleReject('${item.id}')" style="background: white; color: #C0392B; border: 1.5px solid #C0392B; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: 600;">Reject & Delete ✕</button>
			</div>
		`;
		listContainer.appendChild(card);
	});
}

// ── 5. BUTTON HANDLERS ──

async function handleApprove(id) {
		const btn = document.getElementById(`app-${id}`);
		if (btn.innerText === "Approve ✅") {
				btn.innerText = "Confirm Approval?";
				btn.style.backgroundColor = "#1e4d2b";
		} else {
				btn.innerText = "Processing...";
				const { error } = await supabaseClient.from('listings').update({ status: 'approved' }).eq('id', id);
				if (error) alert('Error: ' + error.message);
				else loadPending();
		}
}

async function handleReject(id) {
		const btn = document.getElementById(`rej-${id}`);
		if (btn.innerText === "Reject & Delete ✕") {
				btn.innerText = "Confirm Delete?";
				btn.style.backgroundColor = "#C0392B";
				btn.style.color = "white";
		} else {
				btn.innerText = "Deleting...";
				const { error } = await supabaseClient.from('listings').delete().eq('id', id);
				if (error) alert('Error: ' + error.message);
				else loadPending();
		}
}

// ── 6. INITIALIZE ──
document.addEventListener('DOMContentLoaded', () => {
		if (checkAccess()) {
				buildAdminUI();
				loadPending();
		}
});
