// Basic client-side processing to compute BMI and provide simple recommendations.
// This file runs entirely in the browser; no data is sent anywhere.

(function () {
  const form = document.getElementById('healthForm');
  const result = document.getElementById('result');
  const resetBtn = document.getElementById('resetBtn');

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

    // Basic diet suggestions based on goal and dietary preference
    if (goal === 'lose') {
      recs.diet.push('Aim for a moderate calorie deficit: reduce portion sizes and choose whole foods.');
      if (dietPref === 'vegetarian' || dietPref === 'vegan') {
        recs.diet.push('Focus on legumes, tofu/tempeh, whole grains, and plenty of vegetables.');
      } else if (dietPref === 'lowcarb' || dietPref === 'keto') {
        recs.diet.push('Prioritise lean proteins, vegetables, and healthy fats; watch overall calories.');
      } else {
        recs.diet.push('Lean proteins (chicken, fish), whole grains, and lots of vegetables.');
      }
    } else if (goal === 'gain') {
      recs.diet.push('Increase calorie intake with nutrient-dense foods and add protein at each meal.');
      recs.diet.push('Include strength training and evenly spaced protein to support muscle growth.');
    } else if (goal === 'maintain') {
      recs.diet.push('Maintain balanced portions: vegetables, a protein source, healthy fats, and whole grains.');
    } else {
      recs.diet.push('Focus on balanced meals and small, sustainable changes (more vegetables, less processed food).');
