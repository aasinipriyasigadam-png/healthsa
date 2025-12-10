// Full improved client-side processing (includes the earlier snippet logic).
// Runs entirely in the browser; no data is sent outside the client.

(function () {
  const form = document.getElementById('healthForm');
  const result = document.getElementById('result');
  const resetBtn = document.getElementById('resetBtn');

  // Compute BMI safely
  function computeBMI(weightKg, heightCm) {
    if (!weightKg || !heightCm) return null;
    const h = heightCm / 100;
    return +(weightKg / (h * h)).toFixed(1);
  }

  function classifyBMI(bmi) {
    if (bmi === null) return 'unknown';
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }

  function recommendations({name, age, gender, bmi, bmiClass, activity, dietPref, goal}) {
    const recs = {
      shortGreeting: name ? `Hi ${name}!` : 'Hello!',
      bmiText: bmi ? `Your BMI is ${bmi} (${bmiClass}).` : 'BMI data incomplete.',
      diet: [],
      habits: []
    };

    // Goal-based diet suggestions
    if (goal === 'lose') {
      recs.diet.push('Aim for a moderate calorie deficit: reduce portion sizes and pick whole foods.');
      if (dietPref === 'vegetarian' || dietPref === 'vegan') {
        recs.diet.push('Lean on legumes, tofu/tempeh, whole grains, and ample vegetables.');
      } else if (dietPref === 'lowcarb' || dietPref === 'keto') {
        recs.diet.push('Prioritise proteins, non-starchy vegetables, and healthy fats; track portions.');
      } else {
        recs.diet.push('Lean proteins (chicken, fish), whole grains, and lots of vegetables.');
      }
    } else if (goal === 'gain') {
      recs.diet.push('Increase calorie intake with nutrient-dense meals; add protein-rich snacks.');
      recs.diet.push('Combine with strength training and progressive overload.');
    } else if (goal === 'maintain') {
      recs.diet.push('Balance meals: vegetables, a protein source, whole grains, and healthy fats.');
    } else {
      recs.diet.push('Focus on small sustainable shifts: more veg, less processed food, consistent meals.');
    }

    // BMI-related tips
    if (bmiClass === 'underweight') {
      recs.diet.push('Include calorie-dense healthy snacks: nut butter, full-fat yogurt, smoothies with oats.');
      recs.habits.push('Discuss with a clinician if weight is unintended.');
    } else if (bmiClass === 'normal') {
      recs.habits.push('Maintain balanced meals and varied activity. Good job!');
    } else if (bmiClass === 'overweight' || bmiClass === 'obese') {
      recs.habits.push('Aim for gradual weight loss (0.25–0.5 kg/week) with small sustainable changes.');
      recs.habits.push('Limit sugar-sweetened beverages and highly processed snacks.');
    }

    // Activity guidance
    if (activity === 'sedentary') {
      recs.habits.push('Increase daily movement: short walks, standing breaks, and 2–3 light workouts weekly.');
    } else if (activity === 'light') {
      recs.habits.push('Build to consistent moderate activity — target 150 min/week of moderate exercise.');
    } else {
      recs.habits.push('Keep varying your routine; include strength work and recovery days.');
    }

    // General healthy habits
    recs.habits.push('Stay hydrated across the day.');
    recs.habits.push('Prioritise 7–9 hours of sleep and short stress breaks.');
    recs.habits.push('Schedule regular checkups and consult a registered dietitian or doctor for personalised needs.');

    return recs;
  }

  // Render result with improved markup
  function renderResult(data) {
    const rec = recommendations(data);

    const dietHtml = rec.diet.length
      ? `<ul>${rec.diet.map(i => `<li>${i}</li>`).join('')}</ul>`
      : '<p class="muted">No diet suggestions available.</p>';

    const habitsHtml = rec.habits.length
      ? `<ul>${rec.habits.map(i => `<li>${i}</li>`).join('')}</ul>`
      : '<p class="muted">No habit suggestions available.</p>';

    result.innerHTML = `
      <h3>${escapeHtml(rec.shortGreeting)}</h3>
      <p class="muted" style="margin-top:6px">${escapeHtml(rec.bmiText)}</p>

      <div class="reco">
        <div class="section">
          <strong>Diet suggestions</strong>
          ${dietHtml}
        </div>

        <div class="section">
          <strong>Daily health habits</strong>
          ${habitsHtml}
        </div>

        <div style="margin-top:10px; font-size:13px; color:var(--muted)">
          <em>Note:</em> These are general suggestions. For medical conditions or allergies, consult a healthcare professional.
        </div>
      </div>
    `;
    result.classList.remove('visually-hidden');
    result.scrollIntoView({behavior:'smooth', block:'center'});
  }

  // Minimal escaping to avoid accidental HTML injection from inputs
  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Form submission handler
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value, 10) || null;
    const gender = document.getElementById('gender').value;
    const weight = parseFloat(document.getElementById('weight').value) || null;
    const height = parseFloat(document.getElementById('height').value) || null;
    const activity = document.getElementById('activity').value;
    const dietPref = document.getElementById('dietPref').value;
    const goal = document.getElementById('goal').value;

    const bmi = computeBMI(weight, height);
    const bmiClass = classifyBMI(bmi);

    renderResult({name, age, gender, bmi, bmiClass, activity, dietPref, goal});
  });

  // Reset handler
  resetBtn.addEventListener('click', function () {
    form.reset();
    result.classList.add('visually-hidden');
    result.innerHTML = '';
  });

  // Improve UX: focus on first input on load
  window.addEventListener('load', () => {
    const first = document.getElementById('name');
    if (first) first.focus();
  });
})();
