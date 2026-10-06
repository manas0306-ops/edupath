import {
  DEMO_USER,
  AVAILABLE_ROLES,
  ROLE_SKILL_BENCHMARKS,
  INITIAL_ROADMAP,
  INITIAL_PROJECTS,
  PRACTICE_DIAGNOSTICS
} from './mockApiData';

import {
  AVAILABLE_TOPICS,
  PROGRAMMING_FLASHCARDS,
  SELF_ASSESSMENT_QUIZ_BANK
} from './mockFlashcards';

import {
  CHAPTER_DATA_STORE,
  buildSubjectResponse,
  buildAllSubjectsResponse
} from './mockChapters';

// LocalStorage helpers
const getStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Storage set failed:', e);
  }
};

export const handleMockApiRequest = async (urlStr, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};
  const url = new URL(urlStr, window.location.origin);
  const pathname = url.pathname.replace(/^\/edupath/, ''); // normalize base path

  // Smooth short latency to simulate realistic API response
  await new Promise(r => setTimeout(r, 50));

  // ==========================================
  // 1. AUTHENTICATION
  // ==========================================
  if (pathname === '/api/auth/register' && method === 'POST') {
    const name = body.name || 'Learner';
    const email = (body.email || 'learner@edupath.ai').toLowerCase();
    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      is_active: true,
      is_demo: false,
      profile: {
        user_id: 'user_' + Date.now(),
        current_role: 'Student / Aspiring Engineer',
        target_role: 'AI/ML Engineer',
        experience_level: 'Beginner',
        weekly_hours: 10,
        xp: 120,
        streak_days: 1
      }
    };
    setStorage('edupath_active_user', newUser);
    return jsonResponse({
      access_token: 'mock_jwt_token_' + Date.now(),
      token_type: 'bearer',
      user: newUser
    });
  }

  if (pathname === '/api/auth/login' && method === 'POST') {
    const storedUser = getStorage('edupath_active_user', DEMO_USER);
    return jsonResponse({
      access_token: 'mock_jwt_token_' + Date.now(),
      token_type: 'bearer',
      user: storedUser
    });
  }

  if (pathname === '/api/auth/demo' && method === 'POST') {
    setStorage('edupath_active_user', DEMO_USER);
    return jsonResponse({
      access_token: 'mock_jwt_demo_' + Date.now(),
      token_type: 'bearer',
      user: DEMO_USER
    });
  }

  if (pathname === '/api/auth/me' && method === 'GET') {
    const storedUser = getStorage('edupath_active_user', DEMO_USER);
    return jsonResponse(storedUser);
  }

  // ==========================================
  // 2. DASHBOARD & CHAPTER ANALYTICS
  // ==========================================
  if (pathname === '/api/reports/dashboard' && method === 'GET') {
    const user = getStorage('edupath_active_user', DEMO_USER);
    const goals = getStorage('edupath_goals', [
      { title: "Review PyTorch Autograd & Computational Graphs", duration: "35 mins", done: false },
      { title: "Complete 3 Diagnostic Coding Exercises", duration: "20 mins", done: true },
      { title: "Log 1 Commit to Portfolio Project", duration: "45 mins", done: false }
    ]);
    const roadmap = getStorage('edupath_roadmap', INITIAL_ROADMAP);

    return jsonResponse({
      overall_progress_percentage: roadmap.progress_percentage || 35.0,
      skills_acquired_count: 6,
      skills_in_progress_count: 2,
      remaining_gaps_count: 5,
      total_learning_hours: 14.5,
      practice_accuracy: 84.5,
      streak_days: user.profile?.streak_days || 5,
      xp: user.profile?.xp || 480,
      today_goals: goals,
      struggle_topics: ["PyTorch"],
      ai_insights: "Based on recent diagnostic accuracy, mastering PyTorch tensor operations will unlock 75% of your target career milestones.",
      recommended_next_step: "Review PyTorch Autograd & Computational Graphs"
    });
  }

  if (pathname === '/api/reports/chapters' && method === 'GET') {
    const subjectsList = [buildAllSubjectsResponse()];
    Object.entries(CHAPTER_DATA_STORE).forEach(([sKey, sVal]) => {
      subjectsList.push(buildSubjectResponse(sKey, sVal));
    });
    return jsonResponse({
      subjects: subjectsList,
      selected_default: "all"
    });
  }

  if (pathname.includes('/chapters/') && pathname.endsWith('/toggle') && method === 'POST') {
    return jsonResponse({ success: true });
  }

  if (pathname === '/api/reports/weekly' && method === 'GET') {
    return jsonResponse({
      id: "report_week_01",
      report_title: "Weekly AI Acceleration Report",
      week_start_date: new Date(Date.now() - 7 * 86400000).toISOString(),
      skills_acquired: ["Python Tensor Basics", "Vector Mathematics", "Git Workflow"],
      skills_improving: ["PyTorch Autograd & Backpropagation"],
      weak_areas: ["GPU Memory Allocations"],
      completed_activities_count: 7,
      practice_accuracy_percentage: 84.5,
      learning_hours_logged: 12.5,
      recommended_next_week: "Deep Learning Foundations & Custom Dataset Loaders",
      ai_summary: "Exceptional momentum this week! Your diagnostic accuracy increased by 14% over baseline."
    });
  }

  // ==========================================
  // 3. SKILL GAP ENGINE & GRAPH
  // ==========================================
  if (pathname === '/api/skills/roles' && method === 'GET') {
    return jsonResponse(AVAILABLE_ROLES);
  }

  if (pathname === '/api/skills/gap-analysis' && method === 'POST') {
    const targetRole = body.target_role || "AI/ML Engineer";
    const benchmark = ROLE_SKILL_BENCHMARKS[targetRole] || ROLE_SKILL_BENCHMARKS["AI/ML Engineer"];

    const acquired = benchmark.slice(0, 4).map(s => ({ skill_name: s.name, level: "Intermediate", confidence: 0.9 }));
    const missing = benchmark.slice(4, 9).map(s => ({
      skill_name: s.name,
      importance: s.importance,
      difficulty: s.difficulty,
      estimated_hours: s.hours,
      gap_type: "Missing Core"
    }));
    const partial = benchmark.slice(9).map(s => ({
      skill_name: s.name,
      importance: s.importance,
      difficulty: s.difficulty,
      estimated_hours: s.hours,
      gap_type: "Needs Practice"
    }));

    return jsonResponse({
      target_role: targetRole,
      readiness_percentage: 38.5,
      total_estimated_hours: 120,
      mastered_skills: acquired,
      missing_skills: missing,
      partial_skills: partial,
      acquired_skills: acquired
    });
  }

  if (pathname === '/api/skills/graph' && method === 'GET') {
    const targetRole = url.searchParams.get('target_role') || "AI/ML Engineer";
    const benchmark = ROLE_SKILL_BENCHMARKS[targetRole] || ROLE_SKILL_BENCHMARKS["AI/ML Engineer"];

    const nodes = benchmark.map((s, idx) => ({
      id: s.name,
      label: s.name,
      status: idx < 4 ? "acquired" : (idx < 7 ? "missing" : "partial"),
      importance: s.importance,
      level: s.level
    }));

    const edges = [];
    benchmark.forEach(s => {
      s.deps.forEach(dep => {
        edges.push({ source: dep, target: s.name });
      });
    });

    return jsonResponse({ nodes, edges });
  }

  if (pathname === '/api/skills/compare-roles' && method === 'GET') {
    const comparisons = AVAILABLE_ROLES.map((r, i) => ({
      role_title: r.title,
      readiness_percentage: [38.5, 62.0, 54.0, 41.0][i] || 45.0,
      matching_skills_count: [4, 6, 5, 4][i] || 4,
      total_required_skills_count: [11, 9, 8, 7][i] || 10,
      estimated_hours_to_ready: [120, 75, 90, 110][i] || 95,
      salary_range: r.average_salary
    }));
    return jsonResponse(comparisons);
  }

  if (pathname === '/api/skills/confirm' && method === 'POST') {
    const user = getStorage('edupath_active_user', DEMO_USER);
    if (body.target_role) {
      user.profile.target_role = body.target_role;
      setStorage('edupath_active_user', user);
    }
    return jsonResponse({ success: true, message: "Skills confirmed successfully." });
  }

  if (pathname === '/api/documents/upload' && method === 'POST') {
    return jsonResponse({
      technical_skills: [
        { name: "Python", proficiency: "Advanced", confidence: 0.95 },
        { name: "SQL", proficiency: "Intermediate", confidence: 0.88 },
        { name: "Machine Learning", proficiency: "Intermediate", confidence: 0.82 },
        { name: "Git", proficiency: "Intermediate", confidence: 0.90 },
        { name: "Pandas", proficiency: "Intermediate", confidence: 0.85 }
      ],
      years_experience: 1.5,
      education: "Bachelor of Technology",
      suggested_role: "AI/ML Engineer"
    });
  }

  // ==========================================
  // 4. ROADMAP & PROJECTS
  // ==========================================
  if (pathname === '/api/roadmap' && method === 'GET') {
    const roadmap = getStorage('edupath_roadmap', INITIAL_ROADMAP);
    return jsonResponse(roadmap);
  }

  if (pathname.startsWith('/api/roadmap/items/') && pathname.endsWith('/toggle') && method === 'POST') {
    const parts = pathname.split('/');
    const itemId = parts[4];
    const roadmap = getStorage('edupath_roadmap', INITIAL_ROADMAP);

    let totalItems = 0;
    let completedItems = 0;

    roadmap.milestones.forEach(m => {
      m.items.forEach(item => {
        totalItems++;
        if (item.id === itemId) {
          item.done = !item.done;
        }
        if (item.done) completedItems++;
      });
    });

    if (totalItems > 0) {
      roadmap.progress_percentage = Math.round((completedItems / totalItems) * 100);
    }

    setStorage('edupath_roadmap', roadmap);
    return jsonResponse({ success: true, item_id: itemId, progress_percentage: roadmap.progress_percentage });
  }

  if (pathname === '/api/roadmap/update-velocity' && method === 'POST') {
    const roadmap = getStorage('edupath_roadmap', INITIAL_ROADMAP);
    roadmap.weekly_hours = body.weekly_hours || 12;
    setStorage('edupath_roadmap', roadmap);
    return jsonResponse(roadmap);
  }

  if (pathname === '/api/roadmap/projects' && method === 'GET') {
    const projs = getStorage('edupath_projects', INITIAL_PROJECTS);
    return jsonResponse(projs);
  }

  if (pathname === '/api/roadmap/projects/generate' && method === 'POST') {
    const projs = getStorage('edupath_projects', INITIAL_PROJECTS);
    return jsonResponse(projs);
  }

  if (pathname.startsWith('/api/roadmap/projects/') && method === 'PUT') {
    return jsonResponse({ success: true });
  }

  // ==========================================
  // 5. FLASHCARDS
  // ==========================================
  if (pathname === '/api/flashcards' && method === 'GET') {
    const topic = (url.searchParams.get('topic') || 'all').toLowerCase();
    const storedState = getStorage('edupath_card_state', {});

    let filtered = PROGRAMMING_FLASHCARDS;
    if (topic !== 'all') {
      filtered = filtered.filter(c => c.topic.toLowerCase() === topic);
    }

    let mastered = 0;
    let review = 0;

    const cards = filtered.map(c => {
      const state = storedState[c.id];
      const isM = state === 'mastered';
      const isR = state === 'review_later';
      if (isM) mastered++;
      if (isR) review++;
      return {
        ...c,
        is_mastered: isM,
        needs_review: isR
      };
    });

    return jsonResponse({
      cards,
      total_cards: cards.length,
      mastered_count: mastered,
      review_count: review,
      available_topics: AVAILABLE_TOPICS
    });
  }

  if (pathname.includes('/flashcards/') && pathname.endsWith('/status') && method === 'POST') {
    const parts = pathname.split('/');
    const cardId = parts[3];
    const status = body.status;
    const storedState = getStorage('edupath_card_state', {});
    storedState[cardId] = status;
    setStorage('edupath_card_state', storedState);
    return jsonResponse({ success: true, card_id: cardId, status });
  }

  // ==========================================
  // 6. PRACTICE & SELF-ASSESSMENT QUIZ
  // ==========================================
  if (pathname === '/api/practice/quiz/create' && method === 'POST') {
    const topic = (body.topic || 'python').toLowerCase();
    let pool = SELF_ASSESSMENT_QUIZ_BANK;
    if (topic !== 'all') {
      pool = pool.filter(q => q.topic.toLowerCase() === topic);
    }
    if (pool.length === 0) pool = SELF_ASSESSMENT_QUIZ_BANK;

    const questions = pool.map(q => ({
      id: q.id,
      topic: q.topic,
      difficulty: q.difficulty,
      title: q.title,
      question: q.question,
      code_snippet: q.code_snippet,
      options: q.options,
      hint: q.hint
    }));

    return jsonResponse(questions);
  }

  if (pathname === '/api/practice/quiz/evaluate' && method === 'POST') {
    const answers = body.answers || {};
    let correctCount = 0;
    const results = [];

    SELF_ASSESSMENT_QUIZ_BANK.forEach(q => {
      if (answers[q.id] !== undefined) {
        const userAns = answers[q.id];
        const isCorrect = userAns === q.correct_answer;
        if (isCorrect) correctCount++;
        results.push({
          id: q.id,
          title: q.title,
          question: q.question,
          code_snippet: q.code_snippet,
          user_answer: userAns,
          correct_answer: q.correct_answer,
          is_correct: isCorrect,
          hint: q.hint,
          explanations: q.explanations
        });
      }
    });

    const total = results.length || 1;
    const scorePct = Math.round((correctCount / total) * 100);

    const user = getStorage('edupath_active_user', DEMO_USER);
    user.profile.xp = (user.profile.xp || 480) + (correctCount * 25);
    setStorage('edupath_active_user', user);

    return jsonResponse({
      score: scorePct,
      correct_count: correctCount,
      total_questions: total,
      time_taken_seconds: body.time_taken_seconds || 45,
      xp_awarded: correctCount * 25,
      results
    });
  }

  if (pathname.startsWith('/api/practice/') && method === 'GET') {
    const skillName = decodeURIComponent(pathname.replace('/api/practice/', '')) || "PyTorch";
    const diag = PRACTICE_DIAGNOSTICS[skillName] || PRACTICE_DIAGNOSTICS["PyTorch"];
    return jsonResponse(diag);
  }

  if (pathname === '/api/practice/submit' && method === 'POST') {
    const user = getStorage('edupath_active_user', DEMO_USER);
    user.profile.xp = (user.profile.xp || 480) + 75;
    setStorage('edupath_active_user', user);

    return jsonResponse({
      score: 100,
      total: 100,
      xp_awarded: 75,
      passed: true,
      feedback: "Mastery demonstrated! You successfully solved the Autograd computation question.",
      new_xp: user.profile.xp
    });
  }

  // ==========================================
  // 7. AI MENTOR CHATBOT
  // ==========================================
  if ((pathname === '/api/chat' || pathname === '/api/chat/message') && method === 'POST') {
    const msg = (body.message || '').toLowerCase();
    const lang = body.language || 'en';
    let reply = "Hello! I am your EduPath AI Learning Mentor. I'm conditioned on your active skill gaps to accelerate your career transition.";

    if (msg.includes('pytorch') || msg.includes('tensor')) {
      reply = "PyTorch treats tensors as multidimensional arrays with automated differentiation. In your Week 2 roadmap, focus on `.requires_grad=True` and computational graphs to master backprop.";
    } else if (msg.includes('roadmap') || msg.includes('next') || msg.includes('step')) {
      reply = "Based on your current progress (38.5% readiness), your highest-leverage next action is completing the PyTorch Autograd lab before moving into Convolutional Neural Networks.";
    } else if (msg.includes('job') || msg.includes('salary') || msg.includes('role')) {
      reply = "AI/ML Engineers command between $145,000 - $190,000/yr. The top differentiator in interviews today is hands-on production MLOps experience and Transformer fine-tuning.";
    } else if (msg.includes('project') || msg.includes('portfolio')) {
      reply = "Check the Projects tab! We recommend building the 'Autonomous Multimodal RAG Agent'—it showcases vector embeddings, FastAPI, and Docker all in one repository.";
    } else if (msg.includes('docker') || msg.includes('devops')) {
      reply = "Docker containerization is essential for production ML. Make sure your Dockerfiles use multi-stage builds to keep image sizes small when installing PyTorch with CUDA.";
    } else {
      reply = `Great question regarding ${body.message || 'your career journey'}. Stay consistent with your daily practice goals. Every concept you verify moves your role readiness closer to 100%!`;
    }

    return jsonResponse({
      id: "msg_" + Date.now(),
      role: "assistant",
      content: reply,
      language: lang,
      timestamp: new Date().toISOString()
    });
  }

  // Default fallback
  return jsonResponse({ status: "healthy", mode: "offline_mock_engine", version: "2.1.0" });
};

const jsonResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Powered-By': 'EduPath-AutonomousEngine'
    }
  });
};
