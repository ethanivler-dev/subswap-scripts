// Toggle Mobile Menu
const hb = document.getElementById('nav-hamburger');
const mm = document.getElementById('nav-mobile-menu');
hb.addEventListener('click', (e) => {
	e.stopPropagation();
	mm.classList.toggle('open');
});
document.addEventListener('click', () => mm.classList.remove('open'));

// Database Load
const SUPABASE_URL = 'https://doehqqwqwjebhfgdvyum.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZZ4mKcw6_e9diz7oFfbVag_YA9zkqFW';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadListings() {
	const { data } = await supabaseClient.from('listings').select('*').eq('status', 'approved');
	if (data) {
		document.getElementById('featured-grid').innerHTML = data.map(item => `
			<a href="/listing-details?id=${item.id}" class="listing-card">
				<img src="${item.photo_urls?.[0] || 'https://via.placeholder.com/400'}" class="card-img">
				<div style="font-weight:700; color:var(--gold);">$${item.monthly_rent} / mo</div>
				<div style="font-family:'Playfair Display'; font-size:1.2rem; margin:5px 0;">${item.neighborhood || 'Boulder'}</div>
				<div style="font-size:0.8rem; color:var(--ink-soft);">📍 ${item.address}</div>
				${item.photo_notes && item.photo_notes[0] ? `<div style="font-size:0.85rem;color:var(--ink-soft);margin-top:6px;">Note: ${item.photo_notes[0]}</div>` : ''}
			</a>
		`).join('');
	}
}
loadListings();
