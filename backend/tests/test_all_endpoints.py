import pytest
from httpx import ASGITransport, AsyncClient
from backend.app.main import app

@pytest.fixture
def anyio_backend():
    return 'asyncio'

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
async def test_roadmap_and_practice():
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

        # Submit practice answer
        task_id = tasks[0]["id"]
        sub_res = await client.post("/api/practice/submit", json={
            "task_id": task_id,
            "user_answer": "Because gradients accumulate in buffers by default and would otherwise sum across iterations",
            "time_taken_seconds": 25
        }, headers=headers)
        assert sub_res.status_code == 200
        sub_data = sub_res.json()
        assert sub_data["is_correct"] is True
        assert sub_data["score"] == 100.0

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
