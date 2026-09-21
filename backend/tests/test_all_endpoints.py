import pytest
from httpx import ASGITransport, AsyncClient
from backend.app.main import app

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.mark.asyncio
async def test_health_and_root():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/health")
        assert res.status_code == 200
        assert res.json()["status"] == "ok"

        root_res = await client.get("/")
        assert root_res.status_code == 200

@pytest.mark.asyncio
async def test_demo_login_and_profile():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Login as demo user
        res = await client.post("/api/auth/demo")
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["user"]["name"] == "Alex Rivera"
        token = data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Get Profile
        p_res = await client.get("/api/profile", headers=headers)
        assert p_res.status_code == 200
        p_data = p_res.json()
        assert p_data["target_role"] == "AI/ML Engineer"
        assert p_data["streak_days"] >= 3

@pytest.mark.asyncio
async def test_document_extraction():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/auth/demo")
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Upload text content
        sample_resume_text = "Proficient in Python, SQL, Git, and Docker. Developed machine learning models using Scikit-learn and Pandas. 3 years experience."
        upload_res = await client.post(
            "/api/documents/upload",
            data={"raw_text": sample_resume_text},
            headers=headers
        )
        assert upload_res.status_code == 200
        extracted = upload_res.json()
        skill_names = [s["name"] for s in extracted["technical_skills"]]
        assert "Python" in skill_names
        assert "SQL" in skill_names
        assert "Docker" in skill_names

@pytest.mark.asyncio
async def test_skill_gap_analysis():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/auth/demo")
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Skill gap analysis
        gap_res = await client.post("/api/skills/gap-analysis", headers=headers)
        assert gap_res.status_code == 200
        gap_data = gap_res.json()
        assert gap_data["target_role"] == "AI/ML Engineer"
        assert len(gap_data["missing_skills"]) > 0 or len(gap_data["partial_skills"]) > 0

        # Skill graph
        graph_res = await client.get("/api/skills/graph", headers=headers)
        assert graph_res.status_code == 200
        graph_data = graph_res.json()
        assert len(graph_data["nodes"]) > 0
        assert len(graph_data["edges"]) > 0

@pytest.mark.asyncio
async def test_roadmap_and_adaptive_struggle():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/auth/demo")
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Roadmap
        r_res = await client.get("/api/roadmap", headers=headers)
        assert r_res.status_code == 200
        r_data = r_res.json()
        assert r_data["total_weeks"] >= 1
        assert len(r_data["items"]) > 0

        # Practice
        prac_res = await client.get("/api/practice/PyTorch", headers=headers)
        assert prac_res.status_code == 200
        tasks = prac_res.json()
        assert len(tasks) > 0

        # Submit practice answer with a struggle (incorrect answer)
        task_id = tasks[0]["id"]
        sub_res = await client.post("/api/practice/submit", json={
            "task_id": task_id,
            "user_answer": "Wrong answer choice",
            "time_taken_seconds": 120
        }, headers=headers)
        assert sub_res.status_code == 200
        sub_data = sub_res.json()
        assert sub_data["is_correct"] is False
        assert sub_data["struggle_detected"] is True
        assert sub_data["adaptive_action"] is not None

@pytest.mark.asyncio
async def test_chat_ai_mentor():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/auth/demo")
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        chat_res = await client.post("/api/chat", json={
            "message": "What should I learn today?",
            "language": "en"
        }, headers=headers)
        assert chat_res.status_code == 200
        c_data = chat_res.json()
        assert c_data["role"] == "assistant"
        assert len(c_data["content"]) > 20
        assert "Focus" in c_data["content"] or "learn" in c_data["content"].lower()

@pytest.mark.asyncio
async def test_career_comparison_and_project_generation():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/auth/demo")
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Compare roles
        comp_res = await client.get("/api/skills/compare-roles", headers=headers)
        assert comp_res.status_code == 200
        comp_data = comp_res.json()
        assert len(comp_data) >= 3
        assert "readiness_percentage" in comp_data[0]

        # 2. Generate portfolio project
        proj_res = await client.post("/api/roadmap/projects/generate", json={
            "topic": "Distributed Graph Recommendation Engine",
            "difficulty": "Advanced",
            "target_skills": ["Python", "PyTorch", "FastAPI", "Docker"]
        }, headers=headers)
        assert proj_res.status_code == 200
        proj_data = proj_res.json()
        assert "Distributed Graph Recommendation Engine" in proj_data["title"]
        assert len(proj_data["github_readme"]) > 50
        assert len(proj_data["resume_bullet"]) > 20
        project_id = proj_data["id"]

        # 3. Update generated project
        upd_res = await client.put(f"/api/roadmap/projects/{project_id}", json={
            "status": "Completed",
            "resume_bullet": "Customized edited resume bullet."
        }, headers=headers)
        assert upd_res.status_code == 200
        upd_data = upd_res.json()
        assert upd_data["status"] == "Completed"
        assert upd_data["resume_bullet"] == "Customized edited resume bullet."

