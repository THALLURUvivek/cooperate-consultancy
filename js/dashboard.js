document.addEventListener('DOMContentLoaded', () => {

  // ===== SIDEBAR TOGGLE (Mobile) =====
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('active');
    });
  }

  // Close sidebar on nav link click (mobile)
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
      }
    });
  });

  // ===== REAL-TIME CLOCK =====
  const clockElements = document.querySelectorAll('.realtime-clock');
  function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const date = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    clockElements.forEach(el => {
      el.textContent = `${date} — ${time}`;
    });
  }
  if (clockElements.length) {
    updateClock();
    setInterval(updateClock, 1000);
  }

  // ===== SIMULATED LIVE NOTIFICATIONS =====
  function showNotification(message, type) {
    const container = document.getElementById('liveNotifications');
    if (!container) return;

    const notif = document.createElement('div');
    notif.className = 'activity-item';
    notif.style.animation = 'slideIn 0.3s ease';

    const icons = { gold: '◆', green: '✓', blue: 'ℹ', red: '✕' };
    const iconType = type || 'gold';
    const icon = icons[iconType] || '◆';

    notif.innerHTML = `
      <div class="activity-icon ${iconType}">${icon}</div>
      <div class="activity-content">
        <div class="activity-text">${message}</div>
        <div class="activity-time">Just now</div>
      </div>
      <div class="activity-dot"></div>
    `;

    container.insertBefore(notif, container.firstChild);

    if (container.children.length > 10) {
      container.removeChild(container.lastChild);
    }
  }

  // Inject slideIn keyframes
  if (!document.getElementById('dash-anim-style')) {
    const style = document.createElement('style');
    style.id = 'dash-anim-style';
    style.textContent = `
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes countUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  // ===== SIMULATED REAL-TIME DATA UPDATES =====
  function simulateLiveData() {
    // Update revenue number
    const revenueEl = document.getElementById('liveRevenue');
    if (revenueEl) {
      const base = parseFloat(revenueEl.getAttribute('data-base') || '0');
      const variance = parseFloat(revenueEl.getAttribute('data-variance') || '100');
      const newVal = base + (Math.random() - 0.3) * variance;
      revenueEl.textContent = newVal >= 1000 ? `$${(newVal / 1000).toFixed(1)}K` : `$${Math.round(newVal)}`;
    }

    // Update visitor count
    const visitorsEl = document.getElementById('liveVisitors');
    if (visitorsEl) {
      const base = parseInt(visitorsEl.getAttribute('data-base') || '0');
      const variance = parseInt(visitorsEl.getAttribute('data-variance') || '50');
      const newVal = base + Math.floor((Math.random() - 0.4) * variance);
      visitorsEl.textContent = newVal.toLocaleString();
    }

    // Simulate random activity notifications
    const activities = [
      { msg: 'New user <strong>Sarah Chen</strong> registered', type: 'green' },
      { msg: 'Project <strong>Meridian M&A</strong> status updated to 75%', type: 'blue' },
      { msg: 'Invoice <strong>#INV-2026-0042</strong> paid', type: 'green' },
      { msg: 'New task assigned to <strong>David Kim</strong>', type: 'gold' },
      { msg: 'Server uptime check: <strong>99.98%</strong>', type: 'blue' },
      { msg: 'New meeting scheduled: <strong>Q3 Review</strong>', type: 'gold' },
      { msg: 'Alert: Storage at <strong>78%</strong> capacity', type: 'red' },
      { msg: 'Client <strong>Acme Corp</strong> uploaded documents', type: 'blue' },
    ];

    if (Math.random() > 0.65) {
      const act = activities[Math.floor(Math.random() * activities.length)];
      showNotification(act.msg, act.type);
    }
  }

  // Run live data simulation every 4 seconds
  if (document.getElementById('liveRevenue') || document.getElementById('liveNotifications')) {
    setInterval(simulateLiveData, 4000);
  }

  // ===== STAT COUNTER ANIMATION =====
  function animateCounters() {
    document.querySelectorAll('[data-count-to]').forEach(el => {
      const target = parseInt(el.getAttribute('data-count-to'));
      if (!target || el.dataset.counted) return;
      el.dataset.counted = 'true';

      const duration = 2000;
      const step = Math.max(1, Math.ceil(target / (duration / 16)));
      let current = 0;

      const update = () => {
        current += step;
        if (current >= target) {
          el.textContent = target;
          return;
        }
        el.textContent = current;
        requestAnimationFrame(update);
      };
      update();
    });
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-counter-section]').forEach(el => {
    counterObserver.observe(el);
  });

  // ===== MOBILE RESPONSIVE: Window resize handler =====
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && sidebar) {
      sidebar.classList.remove('open');
      if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    }
  });

  // ===== ACTIVE NAV LINK HIGHLIGHT =====
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && currentPage && href === currentPage) {
      item.classList.add('active');
    }
  });

  // ===== TASK CHECKBOX TOGGLE =====
  document.addEventListener('click', (e) => {
    const check = e.target.closest('.task-check');
    if (check) {
      check.classList.toggle('done');
      if (check.classList.contains('done')) {
        check.textContent = '✓';
      } else {
        check.textContent = '';
      }
    }
  });

});
